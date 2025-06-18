import React, { useEffect, useRef, useState, Suspense } from "react";
import { io } from "socket.io-client";
import { Canvas, useLoader } from "@react-three/fiber";
import URDFLoader from 'urdf-loader';
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom'; // <--- NEW: Import useNavigate

const NODE_SERVER_URL = "https://backend-746d.onrender.com";

const ROBOT_URDF_PATH = "/hexapod_robot/crab_model.urdf";
const ROBOT_PACKAGE_PATH = "/hexapod_robot/";

const UrdfRobotModel = ({ jointStates, controlMode }) => {
    const robot = useLoader(URDFLoader, ROBOT_URDF_PATH, (loader) => {
        loader.workingPath = ROBOT_PACKAGE_PATH;
        loader.parseVisual = true;
        loader.parseCollision = false;
    });

    useEffect(() => {
        if (robot) {
            console.log("URDF Hexapod Robot Loaded:", robot);
            console.log("Available Hexapod Joints:", Object.keys(robot.joints));

            const scaleFactor = 10;
            robot.scale.set(scaleFactor, scaleFactor, scaleFactor);
            robot.position.set(0, -2.0 * scaleFactor, 0);
        }
    }, [robot]);

    useEffect(() => {
        if (robot && controlMode === 'urdf' && jointStates.cmd) {
            const rotationAmount = 0.1;
            const liftAmount = 0.1;
            const moveAmount = 0.5;

            const getJointValue = (jointName) => {
                const joint = robot.joints[jointName];
                return joint ? (joint.angle || 0) : 0;
            };

            if (jointStates.cmd === 'left') {
                ['coxa_joint_r1', 'coxa_joint_r2', 'coxa_joint_r3'].forEach(jointName => {
                    const joint = robot.joints[jointName];
                    if (joint) {
                        joint.setJointValue(getJointValue(jointName) + rotationAmount);
                    }
                });
                ['coxa_joint_l1', 'coxa_joint_l2', 'coxa_joint_l3'].forEach(jointName => {
                    const joint = robot.joints[jointName];
                    if (joint) {
                        joint.setJointValue(getJointValue(jointName) - rotationAmount);
                    }
                });
                console.log("Hexapod: Attempting 'left' turn.");
            }
            else if (jointStates.cmd === 'right') {
                ['coxa_joint_r1', 'coxa_joint_r2', 'coxa_joint_r3'].forEach(jointName => {
                    const joint = robot.joints[jointName];
                    if (joint) {
                        joint.setJointValue(getJointValue(jointName) - rotationAmount);
                    }
                });
                ['coxa_joint_l1', 'coxa_joint_l2', 'coxa_joint_l3'].forEach(jointName => {
                    const joint = robot.joints[jointName];
                    if (joint) {
                        joint.setJointValue(getJointValue(jointName) + rotationAmount);
                    }
                });
                console.log("Hexapod: Attempting 'right' turn.");
            }
            else if (jointStates.cmd === 'jump') {
                const allFemurJoints = [
                    'femur_joint_r1', 'femur_joint_r2', 'femur_joint_r3',
                    'femur_joint_l1', 'femur_joint_l2', 'femur_joint_l3'
                ];

                allFemurJoints.forEach(jointName => {
                    const joint = robot.joints[jointName];
                    if (joint) {
                        joint.setJointValue(getJointValue(jointName) - liftAmount);
                    }
                });

                setTimeout(() => {
                    allFemurJoints.forEach(jointName => {
                        const joint = robot.joints[jointName];
                        if (joint) {
                            joint.setJointValue(getJointValue(jointName) + liftAmount);
                        }
                    });
                }, 300);

                console.log("Hexapod: Attempting 'jump'.");
            }
            else if (jointStates.cmd === 'forward') {
                robot.position.z -= moveAmount;
                console.log("Hexapod: Moving forward. New Z:", robot.position.z);
            }
            else if (jointStates.cmd === 'backward') {
                robot.position.z += moveAmount;
                console.log("Hexapod: Moving backward. New Z:", robot.position.z);
            }
            else if (jointStates.cmd === 'up') {
                robot.position.y += moveAmount;
                console.log("Hexapod: Moving up. New Y:", robot.position.y);
            }
            else if (jointStates.cmd === 'down') {
                robot.position.y -= moveAmount;
                console.log("Hexapod: Moving down. New Y:", robot.position.y);
            }
        }
    }, [jointStates, robot, controlMode]);

    return <primitive object={robot} />;
};


const ControlPanel = () => {
    const navigate = useNavigate(); // <--- NEW: Initialize useNavigate

    const remoteVideoRef = useRef(null);
    const peerConnection = useRef(null);
    const socket = useRef(null);

    const [availablePhones, setAvailablePhones] = useState([]);
    const [selectedPhoneId, setSelectedPhoneId] = useState("");
    const [status, setStatus] = useState("Connecting to server...");
    const [overlayOn, setOverlayOn] = useState(false);
    const [localJointStates, setLocalJointStates] = useState({});
    const [displayMode, setDisplayMode] = useState('video'); // 'video' or 'urdf'

    useEffect(() => {
        socket.current = io(NODE_SERVER_URL);

        socket.current.on("connect", () => {
            setStatus("Connected to server. Registering laptop...");
            socket.current.emit("register_laptop");
            socket.current.emit("get_available_phones");
        });

        socket.current.on("connect_error", (err) => {
            console.error("Socket.IO Connect Error:", err);
            setStatus(`Connection Error: ${err.message}`);
        });

        socket.current.on("available_phones", (phones) => {
            console.log("Available phones:", phones);
            setAvailablePhones(phones);
            if (!selectedPhoneId && phones.length > 0) {
                setSelectedPhoneId(phones[0]);
            }
        });

        socket.current.on("sdp_offer_from_phone", async ({ sdpOffer, phoneDeviceId }) => {
            setStatus(`Received SDP Offer from ${phoneDeviceId}. Setting up WebRTC...`);
            await setupPeerConnection(phoneDeviceId, sdpOffer);
        });

        socket.current.on("ice_candidate_from_phone", async (candidate) => {
            if (peerConnection.current && candidate) {
                await peerConnection.current.addIceCandidate(candidate);
                console.log("Laptop: Added remote ICE candidate.");
            }
        });

        socket.current.on("stream_error", (message) => {
            setStatus(`Stream Error: ${message}`);
            console.error("Stream Error:", message);
        });

        socket.current.on("disconnect", () => {
            setStatus("Disconnected from server.");
            console.log("Laptop: Disconnected from server.");
        });

        return () => {
            if (peerConnection.current) {
                peerConnection.current.close();
                peerConnection.current = null;
            }
            if (socket.current) {
                socket.current.disconnect();
            }
        };
    }, []);

    const setupPeerConnection = async (phoneDeviceId, sdpOffer = null) => {
        if (peerConnection.current) {
            peerConnection.current.close();
        }

        const pc = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        });
        peerConnection.current = pc;

        pc.oniceconnectionstatechange = () => {
            console.log('Laptop ICE connection state:', pc.iceConnectionState);
            setStatus(`ICE State: ${pc.iceConnectionState}`);
        };

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket.current.emit("ice_candidate_from_laptop", {
                    candidate: event.candidate,
                    phoneDeviceId
                });
            }
        };

        pc.ontrack = (event) => {
            if (remoteVideoRef.current && event.streams && event.streams[0]) {
                remoteVideoRef.current.srcObject = event.streams[0];
                remoteVideoRef.current.play().catch(e => console.error("Video auto-play failed:", e));
                setStatus("Streaming live!");
            }
        };
        pc.onaddstream = (event) => { // Fallback for older browsers
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.stream;
                remoteVideoRef.current.play().catch(e => console.error("Video auto-play failed:", e));
                setStatus("Streaming live!");
            }
        };

        if (sdpOffer) {
            await pc.setRemoteDescription(new RTCSessionDescription(sdpOffer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socket.current.emit("sdp_answer_from_laptop", {
                sdpAnswer: answer,
                phoneDeviceId
            });
            setStatus("Answer sent. Stream should start...");
        }
    };

    const handleSelectPhone = (e) => {
        const id = e.target.value;
        setSelectedPhoneId(id);
        if (id) {
            setStatus(`Requesting stream from ${id}...`);
            if (socket.current) {
                socket.current.emit("request_stream", {
                    phoneDeviceId: id,
                    laptopSocketId: socket.current.id
                });
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = null;
                }
            }
        }
    };

    const sendCommand = (cmd) => {
        if (displayMode === 'urdf') {
            setLocalJointStates({ cmd: cmd, timestamp: Date.now() });
        } else {
            if (!selectedPhoneId) {
                alert("Please select a phone to control.");
                return;
            }
            if (socket.current) {
                socket.current.emit("control", { cmd, targetPhoneId: selectedPhoneId });
                console.log(`Command "${cmd}" sent to ${selectedPhoneId}`);
            }
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>Control Panel</h2>
            <p style={styles.status}>Status: {status}</p>

            <div style={styles.dropdownGroup}>
                <label htmlFor="phone-select" style={styles.label}>Select Phone Device: </label>
                <select
                    id="phone-select"
                    value={selectedPhoneId}
                    onChange={handleSelectPhone}
                    style={styles.select}
                >
                    <option value="">-- Select a phone --</option>
                    {availablePhones.length === 0 && <option value="" disabled>No phones online</option>}
                    {availablePhones.map((id) => (
                        <option key={id} value={id}>{id}</option>
                    ))}
                </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
                <button
                    onClick={() => setDisplayMode('video')}
                    style={{ ...styles.modeButton, ...(displayMode === 'video' && styles.modeButtonActive) }}
                >
                    Show Camera Feed
                </button>
                <button
                    onClick={() => setDisplayMode('urdf')}
                    style={{ ...styles.modeButton, ...(displayMode === 'urdf' && styles.modeButtonActive) }}
                >
                    Show URDF Robot (Local)
                </button>
                {/* NEW: Button to navigate to /phone-camera */}
                <button
                    onClick={() => navigate('/phone-camera')} // <--- NEW: Navigation button
                    style={styles.navigateButton} // Use a specific style for this button
                >
                    Go to Phone Camera Page
                </button>
            </div>

            {displayMode === 'video' && (
                <>
                    {selectedPhoneId ? (
                        <div style={styles.videoWrapper}>
                            <video
                                ref={remoteVideoRef}
                                autoPlay
                                playsInline
                                style={styles.video}
                            />
                            {overlayOn && <div style={styles.overlay}> Stream Paused</div>}
                        </div>
                    ) : (
                        <p style={styles.noPhoneMessage}>Please select a phone to view its live feed.</p>
                    )}

                    {selectedPhoneId && (
                        <button onClick={() => setOverlayOn(!overlayOn)} style={styles.toggleButton}>
                            {overlayOn ? "Turn On Stream View" : "Turn Off Stream View"}
                        </button>
                    )}
                </>
            )}

            {displayMode === 'urdf' && (
                <div style={styles.urdfContainer}>
                    <Canvas camera={{ position: [1, 1, 1], fov: 75 }}>
                        <ambientLight intensity={0.8} />
                        <directionalLight position={[2, 5, 2]} intensity={1} />
                        <directionalLight position={[-2, -5, -2]} intensity={0.5} />
                        <Environment preset="studio" />
                        <Suspense fallback={null}>
                            <UrdfRobotModel jointStates={localJointStates} controlMode={displayMode} />
                        </Suspense>
                        <OrbitControls />
                    </Canvas>
                </div>
            )}

            <div style={styles.controlButtons}>
                <button onClick={() => sendCommand("forward")} style={styles.controlBtn}>⬆️ Forward</button>
                <button onClick={() => sendCommand("backward")} style={styles.controlBtn}>⬇️ Backward</button>
                <button onClick={() => sendCommand("left")} style={styles.controlBtn}>⬅️ Turn Left</button>
                <button onClick={() => sendCommand("right")} style={styles.controlBtn}>➡️ Turn Right</button>
                <button onClick={() => sendCommand("up")} style={styles.controlBtn}>👆 Move Up</button>
                <button onClick={() => sendCommand("down")} style={styles.controlBtn}>👇 Move Down</button>
                <button onClick={() => sendCommand("jump")} style={styles.controlBtn}>🤸 Jump</button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        padding: "30px",
        maxWidth: "600px",
        margin: "20px auto",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
        border: "1px solid #e0e0e0",
        textAlign: "center",
    },
    header: {
        color: "#2c3e50",
        fontSize: "28px",
        marginBottom: "20px",
        borderBottom: "2px solid #3498db",
        paddingBottom: "10px",
        display: "inline-block",
    },
    status: {
        fontSize: "16px",
        color: "#555",
        marginBottom: "25px",
        backgroundColor: "#e7f3ff",
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #b3d9ff",
    },
    dropdownGroup: {
        marginBottom: "25px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
    },
    label: {
        fontSize: "16px",
        color: "#333",
        fontWeight: "bold",
    },
    select: {
        padding: "10px 15px",
        borderRadius: "8px", // Corrected from "8고자"
        border: "1px solid #a0a0a0",
        backgroundColor: "#f9f9f9",
        fontSize: "15px",
        cursor: "pointer",
        outline: "none",
        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.08)",
        appearance: "none",
        backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23333%22%20d%3D%22M287%20197.8c-3.6%203.6-7.8%205.4-12.8%205.4H18.2c-5%200-9.2-1.8-12.8-5.4-3.6-3.6-5.4-7.8-5.4-12.8s1.8-9.2%205.4-12.8L133.2%2017c3.6-3.6%207.8-5.4%2012.8-5.4s9.2%201.8%2012.8%205.4l127.8%20127.8c3.6%203.6%205.4%207.8%205.4%2012.8s-1.8%209.2-5.4%2012.8z%22%2F%3E%3C%2Fsvg%3E")',
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 10px center",
        backgroundSize: "12px",
        paddingRight: "30px",
    },
    videoWrapper: {
        position: "relative",
        width: "100%",
        maxWidth: "400px",
        aspectRatio: "4 / 3",
        backgroundColor: "#1c1c1c",
        border: "2px solid #34495e",
        borderRadius: "10px",
        margin: "0 auto 20px auto",
        overflow: "hidden",
        boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    },
    video: {
        width: "100%",
        height: "100%",
        objectFit: "contain",
        display: "block",
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.95)",
        color: "#ecf0f1",
        fontSize: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2,
        fontWeight: "bold",
        borderRadius: "10px",
    },
    toggleButton: {
        marginTop: "15px",
        padding: "10px 20px",
        backgroundColor: "#6c757d",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "15px",
        transition: "background-color 0.3s ease, transform 0.2s ease",
        outline: "none",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    },
    controlButtons: {
        marginTop: "30px",
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "15px",
        justifyContent: "center",
        alignItems: "center",
        maxWidth: "450px",
        margin: "30px auto 0 auto"
    },
    controlBtn: {
        padding: "12px 15px",
        fontSize: "14px",
        backgroundColor: "#3498db",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "background-color 0.3s ease, transform 0.2s ease",
        fontWeight: "bold",
        textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
        outline: "none",
        whiteSpace: "nowrap",
    },
    noPhoneMessage: {
        color: "#777",
        fontSize: "16px",
        marginTop: "20px",
    },
    modeButton: {
        padding: '8px 15px',
        margin: '0 5px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        backgroundColor: '#f0f0f0',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'background-color 0.2s, color 0.2s, border-color 0.2s',
    },
    modeButtonActive: {
        backgroundColor: '#007bff',
        color: 'white',
        borderColor: '#007bff',
    },
    urdfContainer: {
        width: '100%',
        maxWidth: '560px',
        height: '400px',
        border: '1px solid gray',
        margin: '10px auto',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
    },
    navigateButton: { // NEW style for the navigation button
        padding: '10px 20px',
        backgroundColor: '#28a745', // Green color for distinction
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease',
        marginTop: '10px', // Add some space above
        display: 'block', // Make it a block element to take full width or be on its own line
        margin: '10px auto', // Center it
    },
};

export default ControlPanel;