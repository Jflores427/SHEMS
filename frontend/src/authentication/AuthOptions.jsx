import React, { createContext, useState, useEffect } from 'react';
import { login, logout, validateToken, refreshToken } from "../functionsAPI/apiAuth"

export const AuthOptions = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Holds user data (cID, username, etc.)
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Tracks authentication status

    const handleLogin = async (username, password) => {
        try {
            const userData = await login(username, password);
            setUser(userData);
            setIsAuthenticated(true);
            console.log('Logged in successfully:', userData);
        } catch (error) {
            setIsAuthenticated(false);
            console.error('Login failed:', error.message);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            setUser(null);
            setIsAuthenticated(false);
            console.log('Logged out successfully');
        } catch (error) {
            console.error('Logout failed:', error.message);
        }
    };

    const checkAuth = async () => {
        try {
            const userData = await validateToken();
            setUser(userData);
            setIsAuthenticated(true);
            console.log('Token validated:', userData);
        } catch (error) {
            setUser(null);
            setIsAuthenticated(false);
            console.error('Token validation failed:', error.message);
        }
    };

    const refreshAuth = async () => {
        try {
            const message = await refreshToken();
            console.log(message);
        } catch (error) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        checkAuth();
        setInterval(refreshAuth, 600_000);  // Refresh Auth Token every 10 minutes
    }, []);

    return (
        <AuthOptions.Provider value={{ user, isAuthenticated, login: handleLogin, logout: handleLogout }}>
            {children}
        </AuthOptions.Provider>
    );
};