// src/services/authService.js

import axios from 'axios';

// Use environment variable for API URL
const API_URL = process.env.REACT_APP_API_URL;

// Login Function
export const login = async (username, password) => {
  try {
    console.log('Sending login request:', { username, password });
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Login response:', response.data);
    return response.data;
  } catch (error) {
    // Safely access error message
    const errorMessage = error.response?.data?.message || 'Network error. Please try again.';
    console.error('Login error:', errorMessage);
    throw new Error(errorMessage);
  }
};
