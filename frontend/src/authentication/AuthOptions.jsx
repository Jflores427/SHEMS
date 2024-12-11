import React, { createContext, useState, useEffect } from 'react';
import api from '../functionsAPI/api';

// Create the AuthContext
export const AuthOptions = createContext();

// AuthProvider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Holds user data (id, username, etc.)
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Tracks authentication status


    const login = async (username, password) => {
        try {
            const response = await api.post('/login', { "username": username, "password": password });
            setUser(response.data.userData); 
            setIsAuthenticated(true);
            console.log('Logged in successfully:', response.data.userData);
        } catch (error) {
            console.error('Login failed:', error.response?.data?.message || error.message);
            setIsAuthenticated(false);
        }
    };

    const logout = async () => {
        try {
            await api.post('/logout');
            setUser(null);
            setIsAuthenticated(false);
            console.log('Logged out successfully');
        } catch (error) {
            console.error('Logout failed:', error.response?.data?.message || error.message);
        }
    };

    // Validate token function (checks authentication on page refresh)
    const validateToken = async () => {
        try {
            const response = await api.post('/validate-token', {});
            setUser(response.data.userData); 
            setIsAuthenticated(true);
            console.log('Token validated:', response.data.userData);
        } catch (error) {
            console.error('Token validation failed:', error.response?.data?.message || error.message);
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    // Effect to check authentication on app load
    useEffect(() => {
        // validateToken(); // Runs once when the component mounts
    }, []);

    return (
        <AuthOptions.Provider value={{ user, isAuthenticated, login, logout, validateToken }}>
            {children}
        </AuthOptions.Provider>
    );
};


// import React, { createContext, useState } from "react";
// export const AuthOptions = createContext();

// export const AuthProvider = ({ children }) => {
//   const [auth, setAuth] = useState(false);
//   const [username, setUsername] = useState("");
//   const [customerID, setCustomerID] = useState(null);

//   // const loggedIn = (username,customerID) => {
//   //   setAuth(true);
//   //   setUsername(username);
//   //   setCustomerID(customerID);
//   // };
//   // const loggedOut = () => {
//   //   setAuth(false);
//   //   setUsername("");
//   //   setCustomerID(null);
//   // };


//   useEffect(() => {
//     // On mount, check if a token exists in localStorage and validate it
//     const token = localStorage.getItem("authToken");
//     if (token) {
//         fetchUser(token);
//     }
// }, []);


// const fetchUser = async (token) => {
//   try {
//       const response = await fetch("/validate-token", {
//           method: "POST",
//           headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//           },
//       });
//       if (response.ok) {
//           const userData = await response.json();
//           setUser(userData);
//       } else {
//           localStorage.removeItem("authToken");
//       }
//   } catch (err) {
//       console.error("Token validation failed:", err);
//   }
// };

// const login = async (credentials) => {
//   try {
//       const response = await fetch("/login", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(credentials),
//       });
//       if (response.ok) {
//           const { token, userData } = await response.json();
//           localStorage.setItem("authToken", token);
//           setUser(userData);
//       } else {
//           throw new Error("Login failed");
//       }
//   } catch (err) {
//       console.error(err);
//   }
// };

// const logout = () => {
//   localStorage.removeItem("authToken");
//   setUser(null);
// };

//   return (
//     <AuthOptions.Provider value={{ auth, username, customerID, login, logout }}>
//       {children}
//     </AuthOptions.Provider>
//   );
// };