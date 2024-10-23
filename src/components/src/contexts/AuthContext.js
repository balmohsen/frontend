
// src/contexts/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import * as jwt_decode from 'jwt-decode';

// Create the context
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    user: null,
  });

  // Load token from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = jwt_decode(token);
      setAuth({ token, user });
    }
  }, []);

  // Function to handle login
  const login = (token) => {
    const user = jwt_decode(token);
    localStorage.setItem('token', token);
    setAuth({ token, user });
  };

  // Function to handle logout
  const logout = () => {
    localStorage.removeItem('token');
    setAuth({ token: null, user: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
 
  );

};

