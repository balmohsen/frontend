// frontend/src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';

// Create AuthContext
export const AuthContext = createContext();

// AuthProvider Component
export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        token: localStorage.getItem('token') || null,
        user: localStorage.getItem('token') ? jwtDecode(localStorage.getItem('token')) : null,
    });

    // Function to handle login
    const login = (token) => {
        localStorage.setItem('token', token);
        const decodedUser = jwtDecode(token);
        setAuth({ token, user: decodedUser });
    };

    // Function to handle logout
    const logout = () => {
        localStorage.removeItem('token');
        setAuth({ token: null, user: null });
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                setAuth({ token, user: decodedUser });
            } catch (err) {
                console.error('Invalid token:', err);
                logout();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
