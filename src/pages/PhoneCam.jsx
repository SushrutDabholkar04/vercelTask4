import React, { useEffect, useRef, useState, Suspense } from "react";
import { io } from "socket.io-client";
import { Canvas, useLoader } from "@react-three/fiber";
import URDFLoader from 'urdf-loader';
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from 'three'; 

const NODE_SERVER_URL = "https://backend-746d.onrender.com";
const PHONE_DEVICE_ID = `phone-${Math.random().toString(36).substring(7)}`;


const ROBOT_URDF_PATH = "/hexapod_robot/crab_model.urdf";
const ROBOT_PACKAGE_PATH = "/";



const UrdfRobotModel = ({ jointStates, controlMode, onRobotLoaded }) => {
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

            
            if (onRobotLoaded) {
                onRobotLoaded(robot);
            }
        }
    }, [robot, onRobotLoaded]); 

    useEffect(() => {
        if (robot && controlMode === 'urdf') {
            const rotationAmount = 0.1;
            const liftAmount = 0.1;

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
                const moveAmount = 0.5; 
                robot.position.z -= moveAmount; 
                console.log("Hexapod: Moving forward.");
            }
            else if (jointStates.cmd === 'backward') {
                const moveAmount = 0.5;
                robot.position.z += moveAmount; 
                console.log("Hexapod: Moving backward.");
            }
            else if (jointStates.cmd === 'up') {
                const moveAmount = 0.5;
                robot.position.y += moveAmount; 
                console.log("Hexapod: Moving up.");
            }
            else if (jointStates.cmd === 'down') {
                const moveAmount = 0.5;
                robot.position.y -= moveAmount; 
                console.log("Hexapod: Moving down.");
            }
        }
    }, [jointStates, robot, controlMode]);

    return <primitive object={robot} />;
};


const PhoneCam = () => {
    const localVideoRef = useRef(null);
    const peerConnection = useRef(null);
    const socket = useRef(null);
    const orbitControlsRef = useRef(); 
    const cameraRef = useRef(); 

    const [status, setStatus] = useState("Connecting to server...");
    const [jointStates, setJointStates] = useState({});
    const [displayMode, setDisplayMode] = useState('video');
    const [callActive, setCallActive] = useState(false);

    
    const [loadedRobot, setLoadedRobot] = useState(null);

    
    const handleRobotLoaded = (robotObject) => {
        setLoadedRobot(robotObject);
    };

    useEffect(() => {
        socket.current = io(NODE_SERVER_URL);

        socket.current.on("connect", () => {
            setStatus("Connected to server. Registering phone...");
            socket.current.emit("register_phone", PHONE_DEVICE_ID);
        });

        socket.current.on("connect_error", (err) => {
            console.error("Socket.IO Connect Error:", err);
            setStatus(`Connection Error: ${err.message}`);
        });

        socket.current.on("start_webrtc_offer", async ({ requestingLaptopSocketId }) => {
            setStatus("Laptop requested stream. Setting up WebRTC...");
            await setupPeerConnection(requestingLaptopSocketId);
            setCallActive(true);
        });

        socket.current.on("sdp_answer_from_laptop", async (sdpAnswer) => {
            setStatus("Received SDP Answer. Establishing connection...");
            if (peerConnection.current && peerConnection.current.remoteDescription === null) {
                await peerConnection.current.setRemoteDescription(new RTCSessionDescription(sdpAnswer));
                console.log("Phone: Remote description set (Answer).");
            }
        });

        socket.current.on("ice_candidate_from_laptop", async (candidate) => {
            if (peerConnection.current && candidate) {
                await peerConnection.current.addIceCandidate(candidate);
                console.log("Phone: Added remote ICE candidate.");
            }
        });

        socket.current.on("control", (cmd) => {
            setStatus(`Command received: ${cmd}`);
            if (displayMode === 'urdf') {
                // Only update joint states if in URDF mode
                setJointStates({ cmd: cmd, timestamp: Date.now() });
            } 
        });

        socket.current.on("disconnect", () => {
            setStatus("Disconnected from server.");
            console.log("Phone: Disconnected from server.");
            setCallActive(false);
        });

        const getLocalStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
                return stream;
            } catch (err) {
                setStatus(`Camera access denied or unavailable: ${err.message}`);
                console.error("Camera error:", err);
                alert("Camera access denied or unavailable. Please allow camera permissions.");
                return null;
            }
        };

        let localStream = null;
        getLocalStream().then(stream => {
            localStream = stream;
        });

        return () => {
            if (peerConnection.current) {
                peerConnection.current.close();
                peerConnection.current = null;
            }
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
                localStream = null;
            }
            if (socket.current) {
                socket.current.disconnect();
            }
        };
    }, [displayMode]);

    
    useEffect(() => {
        if (displayMode === 'urdf' && loadedRobot && orbitControlsRef.current && cameraRef.current) {
            console.log("Adjusting camera and orbit controls for the loaded robot...");
            const box = new THREE.Box3().setFromObject(loadedRobot);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());

            const maxDim = Math.max(size.x, size.y, size.z);
            const fov = cameraRef.current.fov * (Math.PI / 180);
            let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));

            // Adjust camera distance for better view
            cameraZ *= 1.5;

            cameraRef.current.position.set(center.x, center.y + size.y / 2, cameraZ + center.z);
            cameraRef.current.lookAt(center);

            orbitControlsRef.current.target.copy(center);
            orbitControlsRef.current.update();

            cameraRef.current.far = cameraZ * 2;
            cameraRef.current.near = 0.01;
            cameraRef.current.updateProjectionMatrix();

            console.log("Camera adjusted to center:", center, "and position:", cameraRef.current.position);
        }
    }, [displayMode, loadedRobot]);


    const setupPeerConnection = async (requestingLaptopSocketId) => {
        if (peerConnection.current) {
            peerConnection.current.close();
        }

        const pc = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
            ]
        });
        peerConnection.current = pc;

        pc.oniceconnectionstatechange = () => {
            console.log('Phone ICE connection state:', pc.iceConnectionState);
            setStatus(`ICE State: ${pc.iceConnectionState}`);
        };

        if (localVideoRef.current && localVideoRef.current.srcObject) {
            localVideoRef.current.srcObject.getTracks().forEach(track => pc.addTrack(track, localVideoRef.current.srcObject));
            console.log("Phone: Local stream added to PeerConnection.");
        } else {
            console.error("Phone: No local stream found to add to PeerConnection.");
            setStatus("Error: No local stream to start WebRTC.");
            return;
        }

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                console.log("Phone: Sending ICE candidate to laptop.");
                socket.current.emit("ice_candidate_from_phone", {
                    candidate: event.candidate,
                    phoneDeviceId: PHONE_DEVICE_ID,
                    requestingLaptopSocketId: requestingLaptopSocketId
                });
            }
        };

        try {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            console.log("Phone: Sending SDP Offer to laptop.");
            socket.current.emit("sdp_offer_from_phone", {
                sdpOffer: offer,
                phoneDeviceId: PHONE_DEVICE_ID,
                requestingLaptopSocketId: requestingLaptopSocketId
            });
            setStatus("Offer sent. Waiting for answer...");
        } catch (error) {
            console.error("Phone: Error creating or sending offer:", error);
            setStatus(`Error setting up WebRTC: ${error.message}`);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>📱 Phone Camera & Robot</h2>
            <p style={styles.statusText}>Status: <span style={styles.statusValue}>{status}</span></p>
            <p style={styles.deviceIdText}>Your Device ID: <strong style={styles.deviceIdValue}>{PHONE_DEVICE_ID}</strong></p>

            <div style={styles.modeToggleContainer}>
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
                    Show URDF Robot
                </button>
            </div>

            {displayMode === 'video' && (
                <div style={styles.videoContainer}>
                    <video ref={localVideoRef} autoPlay playsInline muted style={styles.videoStream} />
                </div>
            )}

            {displayMode === 'urdf' && (
                <div style={styles.urdfContainer}>
                    <Canvas camera={{ fov: 50, near: 0.1, far: 2000 }} onCreated={({ camera }) => { cameraRef.current = camera; }}>
                        <ambientLight intensity={0.8} />
                        <directionalLight position={[2, 5, 2]} intensity={1} />
                        <directionalLight position={[-2, -5, -2]} intensity={0.5} />
                        <Environment preset="studio" />
                        <Suspense fallback={null}>
                            <UrdfRobotModel
                                jointStates={jointStates}
                                controlMode={displayMode}
                                onRobotLoaded={handleRobotLoaded}
                            />
                        </Suspense>
                        <OrbitControls ref={orbitControlsRef} />
                    </Canvas>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: '20px', // Slightly reduced padding for mobile
        maxWidth: '95%', // Increased max-width to use more screen real estate
        margin: '20px auto', // Adjusted margin
        textAlign: 'center',
        fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        backgroundColor: "#ffffff",
        borderRadius: "15px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
        background: 'linear-gradient(145deg, #f0f0f0, #ffffff)',
        border: '1px solid #e0e0e0',
        boxSizing: 'border-box', // Include padding and border in the element's total width and height
    },
    heading: {
        color: '#2c3e50',
        marginBottom: '15px', // Reduced margin
        fontSize: '1.8em', // Adjusted font size for mobile
        fontWeight: '700',
        letterSpacing: '0.5px', // Slightly reduced letter spacing
    },
    statusText: {
        fontSize: '1em', // Adjusted font size
        color: '#555',
        marginBottom: '8px', // Reduced margin
    },
    statusValue: {
        fontWeight: 'bold',
        color: '#007bff',
    },
    deviceIdText: {
        fontSize: '0.9em', // Adjusted font size
        color: '#777',
        marginBottom: '20px', // Reduced margin
        wordBreak: 'break-all', // Ensure long device IDs wrap on small screens
    },
    deviceIdValue: {
        color: '#34495e',
    },
    modeToggleContainer: {
        marginBottom: '20px', // Reduced margin
        display: 'flex',
        flexWrap: 'wrap', // Allow buttons to wrap on smaller screens
        justifyContent: 'center',
        gap: '10px', // Reduced gap between buttons
    },
    modeButton: {
        padding: '10px 20px', // Reduced padding
        border: '2px solid #007bff',
        borderRadius: '25px', // Slightly smaller border-radius
        backgroundColor: '#ffffff',
        color: '#007bff',
        cursor: 'pointer',
        fontSize: '0.9em', // Adjusted font size
        fontWeight: '600',
        transition: 'all 0.3s ease',
        outline: 'none',
        boxShadow: '0 2px 5px rgba(0, 123, 255, 0.2)',
        flexGrow: 1, // Allow buttons to grow and fill space
        maxWidth: 'calc(50% - 10px)', // Limit width for two columns on wider mobile screens
    },
    modeButtonActive: {
        backgroundColor: '#007bff',
        color: 'white',
        borderColor: '#0056b3',
        boxShadow: '0 4px 10px rgba(0, 123, 255, 0.4)',
    },
    videoContainer: {
        border: '2px solid #e0e0e0',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
        width: '100%', // Make video container fill parent width
        height: 'auto', // Allow height to adjust
        aspectRatio: '16 / 9', // Maintain a 16:9 aspect ratio for the video container
        margin: '0 auto',
        backgroundColor: '#f5f5f5',
    },
    videoStream: {
        width: '100%',
        height: '100%', // Make video fill its container
        display: 'block',
        objectFit: 'cover', // Cover the container while maintaining aspect ratio
    },
    urdfContainer: {
        width: '100%', // Make URDF container fill parent width
        height: '300px', // Fixed height for URDF container, you might adjust this
        border: '2px solid #e0e0e0',
        borderRadius: '10px',
        margin: '0 auto',
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
        boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
    },
    '@media (max-width: 480px)': {
        // Specific adjustments for very small screens
        modeButton: {
            maxWidth: '100%', // Stack buttons on top of each other on very small screens
        },
        urdfContainer: {
            height: '250px', // Reduce height for very small screens
        }
    }
};

export default PhoneCam;