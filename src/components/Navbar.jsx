// frontend/src/components/Navbar.jsx
import React, { useState } from 'react'; // Import useState
import { Link, NavLink } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // State to manage menu open/close
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const handleClick = () => {
    logout();
    setIsOpen(false); // Close menu after logout
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Partners', path: '/partners' },
    { name: 'Information', path: '/information' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'Tools', path: '/tools' },
  ];

  return (
    <div className="backdrop-blur-md bg-blue-900/70 text-white px-6 py-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">

        {/* Brand Logo */}
        <Link to="/" className="text-3xl font-extrabold tracking-wide text-white hover:text-blue-300 transition duration-300">
          Apex Robotics
        </Link>

        {/* Hamburger Menu Button (visible on small screens) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white focus:outline-none focus:text-blue-300"
          aria-label="Toggle navigation"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            )}
          </svg>
        </button>

        {/* Navigation Links and Auth Buttons (Toggles based on isOpen and screen size) */}
        <div
          className={`w-full md:flex md:w-auto md:justify-end items-center transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-screen opacity-100 mt-4 md:mt-0' : 'max-h-0 opacity-0 md:max-h-screen md:opacity-100 overflow-hidden'
          }`}
        >
          {/* Navigation Links */}
          <nav className="flex flex-col md:flex-row justify-center md:gap-6 text-lg w-full md:w-auto">
            {navItems.map(({ name, path }) => (
              <NavLink
                key={name}
                to={path}
                onClick={() => setIsOpen(false)} // Close menu on link click
                className={({ isActive }) =>
                  `block py-2 md:py-0 px-4 text-center md:text-left transition-all duration-200 ease-in-out hover:text-blue-300 hover:scale-105 ${
                    isActive
                      ? 'text-blue-300 font-semibold border-b-2 border-blue-300 pb-1 md:border-b-0'
                      : 'text-white'
                  }`
                }
              >
                {name}
              </NavLink>
            ))}
          </nav>

          {/* Authentication Buttons (Conditional Rendering) */}
          <div className="flex flex-col md:flex-row items-center gap-4 mt-4 md:mt-0 w-full md:w-auto">
            {user ? (
              <>
                <span className="text-white text-lg py-2 md:py-0 text-center">Welcome, {user.email}!</span>
                <button
                  onClick={handleClick}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out w-full md:w-auto"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="w-full md:w-auto">
                  <button onClick={() => setIsOpen(false)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out w-full">
                    Login
                  </button>
                </Link>
                <Link to="/signup" className="w-full md:w-auto">
                  <button onClick={() => setIsOpen(false)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out w-full">
                    Signup
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;