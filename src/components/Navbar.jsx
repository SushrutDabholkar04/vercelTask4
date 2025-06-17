// frontend/src/components/Navbar.jsx (assuming this is your path)
import React, { useState } from 'react'; // Import useState for managing mobile menu state
import { Link, NavLink } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout'; // Import your useLogout hook
import { useAuthContext } from '../hooks/useAuthContext'; // Import your useAuthContext hook

const Navbar = () => {
  const { logout } = useLogout(); // Get the logout function
  const { user } = useAuthContext(); // Get the user state from the context
  const [isOpen, setIsOpen] = useState(false); // State to manage mobile menu open/close

  const handleClick = () => {
    logout(); // Call the logout function
    setIsOpen(false); // Close mobile menu on logout
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Partners', path: '/partners' },
    { name: 'Information', path: '/information' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <div className="backdrop-blur-md bg-blue-900/70 text-white px-4 py-3 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center relative"> {/* Added relative for mobile menu positioning */}

        {/* Brand Logo */}
        <Link to="/" className="text-2xl sm:text-3xl font-extrabold tracking-wide text-white hover:text-blue-300 transition duration-300 z-10" onClick={() => setIsOpen(false)}> {/* Close menu on logo click */}
          Apex Robotics
        </Link>

        {/* Mobile Menu Toggle Button (Hamburger) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white focus:outline-none focus:ring-2 focus:ring-blue-300 p-2 rounded-md z-10"
          aria-label="Toggle navigation menu"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            )}
          </svg>
        </button>

        {/* Navigation Links and Auth Buttons - Mobile & Desktop */}
        <div className={`
          absolute top-full left-0 w-full md:relative md:top-auto md:left-auto md:w-auto
          bg-blue-800/95 md:bg-transparent
          flex flex-col md:flex-row items-center justify-center md:justify-end gap-6 md:gap-6 py-4 md:py-0
          transition-transform duration-300 ease-in-out transform
          ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 md:translate-y-0 md:opacity-100'}
          md:flex md:space-x-6 lg:space-x-8 text-lg
        `}>
          <nav className="flex flex-col md:flex-row justify-center gap-4 md:gap-6 text-lg w-full md:w-auto">
            {navItems.map(({ name, path }) => (
              <NavLink
                key={name}
                to={path}
                className={({ isActive }) =>
                  `transition-all duration-200 ease-in-out hover:text-blue-300 hover:scale-105 text-center px-2 py-1 ${
                    isActive
                      ? 'text-blue-300 font-semibold border-b-2 border-blue-300 md:border-b-2 md:pb-1'
                      : 'text-white'
                  }`
                }
                onClick={() => setIsOpen(false)} // Close menu on link click
              >
                {name}
              </NavLink>
            ))}
          </nav>

          {/* Authentication Buttons (Conditional Rendering) */}
          <div className="flex flex-col md:flex-row items-center gap-4 mt-4 md:mt-0">
            {user ? ( // If a user is logged in
              <>
                <span className="text-white text-lg text-center px-2 py-1">Welcome, {user.email}!</span> {/* Display user's email */}
                <button
                  onClick={handleClick} // Call logout function on click
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out w-full md:w-auto"
                >
                  Logout
                </button>
              </>
            ) : ( // If no user is logged in
              <>
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out w-full md:w-auto">
                    Login
                  </button>
                </Link>
                <Link to="/signup" onClick={() => setIsOpen(false)}>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out w-full md:w-auto">
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