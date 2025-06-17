// // frontend/src/App.jsx
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Navbar from './components/navbar';
// import Footer from './components/footer';
// import HomePage from './pages/HomePage';
// import ProductsPage from './pages/ProductsPage';
// import ControlPanel from './pages/controlPanel';
// import ContactUsPage from './pages/ContactUsPage';
// import PartnersPage from './pages/PartnersPage';
// import InformationPage from './pages/InformationPage';
// import WhyChooseUsPage from './pages/WhyChooseUsPage';
// import Login from './pages/Login';
// import Signup from './pages/Signup';
// import CheckoutPage from './pages/CheckoutPage';
// import OtpSender from './components/OtpSender';
// // Import useAuthContext to check user's login status
// import { useAuthContext } from './hooks/useAuthContext'; 
// import PhoneCam from './pages/PhoneCam'; // Import the PhoneCam page

// function App() {
//   // Get the user state from the AuthContext
//   const { user } = useAuthContext();

//   return (
//     <Router>
//       <Navbar />
//       <main> 
//         <Routes>
//           {/* Public Routes - Always accessible */}
//           <Route path="/" element={<HomePage />} />

//           {/* Authentication Routes - Redirect if user is logged in */}
//           {/* If user exists, trying to go to /login or /signup will redirect to homepage */}
//           <Route 
//             path="/login" 
//             element={user ? <Navigate to="/" /> : <Login />} 
//           />
//           <Route 
//             path="/signup" 
//             element={user ? <Navigate to="/" /> : <Signup />} 
//           />

//           {/* Protected Routes - Only accessible if user is logged in */}
//           {/* If no user, attempting to access these routes will redirect to login page */}
//           <Route 
//             path="/products" 
//             element={user ? <ProductsPage /> : <Navigate to="/login" />} 
//           />
//           <Route path="/send-otp" element={<OtpSender />} /> 
//           <Route 
//             path="/contact" 
//             element={user ? <ContactUsPage /> : <Navigate to="/login" />} 
//           /> 
//           <Route 
//             path="/tools" 
//             element={user ? <ControlPanel /> : <Navigate to="/login" />} 
//           /> 
//             <Route
//             path="/phone-camera"
//             element={user ? <PhoneCam /> : <Navigate to="/login" />}
//           />
//           <Route 
//             path="/partners" 
//             element={user ? <PartnersPage /> : <Navigate to="/login" />} 
//           /> 
//           <Route 
//             path="/information" 
//             element={user ? <InformationPage /> : <Navigate to="/login" />} 
//           /> 
//           <Route 
//             path="/why-choose-us" 
//             element={user ? <WhyChooseUsPage /> : <Navigate to="/login" />} 
//           /> 
//            <Route 
//             path="/checkout" 
//             element={user ? <CheckoutPage /> : <Navigate to="/login" />} 
//           /> 
//           {/* Optional: Add a catch-all route for 404 Not Found if needed */}
//           {/* <Route path="*" element={<NotFoundPage />} /> */}
//         </Routes>
//       </main>
//       <Footer />
//     </Router>
//   );
// }

// export default App;

// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/navbar';
import Footer from './components/footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ControlPanel from './pages/controlPanel'; // Using lowercase 'c'
import ContactUsPage from './pages/ContactUsPage';
import PartnersPage from './pages/PartnersPage';
import InformationPage from './pages/InformationPage';
import WhyChooseUsPage from './pages/WhyChooseUsPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CheckoutPage from './pages/CheckoutPage';
import OtpSender from './components/OtpSender';
import { useAuthContext } from './hooks/useAuthContext'; // Assume this is where AuthContext is consumed
import PhoneCam from './pages/PhoneCam';

function App() {
  const { user, loading } = useAuthContext(); // <-- Destructure loading here

  console.log('--- App.jsx Render Cycle ---');
  console.log('Path:', window.location.pathname);
  console.log('User:', user);
  console.log('Loading:', loading);
  console.log('---------------------------');

  // CRITICAL: Don't render routes until authentication state is known
  if (loading) {
    console.log('App.jsx: Authentication is still loading...');
    return <div>Loading authentication...</div>; // Or a spinner
  }

  // Now, if loading is false and user is null, they aren't logged in.
  // This helps prevent the flicker by waiting for the initial check.
  // If you also want to redirect to / if user is null after loading, you can add:
  // if (!user && window.location.pathname !== '/login' && window.location.pathname !== '/signup' && window.location.pathname !== '/') {
  //     console.log('App.jsx: User is null and not loading, redirecting to /login');
  //     return <Navigate to="/login" />;
  // }


  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
          <Route
            path="/products"
            element={user ? <ProductsPage /> : <Navigate to="/login" />}
          />
          <Route path="/send-otp" element={<OtpSender />} />
          <Route
            path="/contact"
            element={user ? <ContactUsPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/tools"
            element={user ? <ControlPanel /> : <Navigate to="/login" />}
          />
          <Route
            path="/phone-camera"
            element={user ? <PhoneCam /> : <Navigate to="/login" />}
          />
          <Route
            path="/partners"
            element={user ? <PartnersPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/information"
            element={user ? <InformationPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/why-choose-us"
            element={user ? <WhyChooseUsPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/checkout"
            element={user ? <CheckoutPage /> : <Navigate to="/login" />}
          />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;