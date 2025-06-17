// import React, { createContext, useReducer, useEffect } from 'react' 

// export const AuthContext = createContext()

// export const authReducer = (state, action) => {
//   switch (action.type) {
//     case 'LOGIN':
//       return { user: action.payload }
//     case 'LOGOUT':
//       return { user: null }
//     default:
//       return state
//   }
// }

// export const AuthContextProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(authReducer, {
//     user: null
//   })

//   useEffect(() => {
//     let user = null;
//     try {
//       const storedUser = localStorage.getItem('user');
//       if (storedUser) {
//         user = JSON.parse(storedUser);
//       }
//     } catch (error) {
//       console.error("Error parsing user from localStorage:", error);
    
//     }

//     if (user) {
//       dispatch({ type: 'LOGIN', payload: user });
//     }
//   }, []);

//   console.log('AuthContext state:', state);

//   return (
//     <AuthContext.Provider value={{ ...state, dispatch }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

import React, { createContext, useReducer, useEffect, useState } from 'react'; // <-- Import useState

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      // Ensure authIsReady is part of your state if you use it in App.jsx
      return { ...state, user: action.payload }; // Removed authIsReady for simplicity if not used
    case 'LOGOUT':
      return { ...state, user: null };
    // You might also add AUTH_IS_READY if you want a separate action for initial setup
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null
    // Add authIsReady here if you plan to use it (e.g., authIsReady: false)
  });

  const [loading, setLoading] = useState(true); // <--- ADD THIS LOADING STATE

  useEffect(() => {
    let user = null;
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        user = JSON.parse(storedUser);
      }
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      // If there's an error, treat as no user
      user = null;
    }

    if (user) {
      // Potentially add logic here to verify the user token with your backend.
      // If verification fails, dispatch LOGOUT.
      dispatch({ type: 'LOGIN', payload: user });
    }
    // This is CRITICAL: Set loading to false *after* the initial check
    setLoading(false); // <--- SET LOADING TO FALSE HERE

  }, []); // Empty dependency array: runs only once on mount

  console.log('AuthContext state:', state); // Keep this for debugging
  console.log('AuthContext loading:', loading); // <--- Log loading state

  return (
    <AuthContext.Provider value={{ ...state, dispatch, loading }}> {/* <-- Pass loading in value */}
      {children}
    </AuthContext.Provider>
  );
};