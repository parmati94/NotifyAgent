import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Use the environment variable directly
const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';
console.log(`Auth Context using API base URL: ${REACT_APP_API_BASE_URL}`);

// Create auth context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in on component mount
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          // Set the token for all future requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Validate token with the backend
          const response = await axios.get(`${REACT_APP_API_BASE_URL}/verify-token/`);
          
          if (response.data && response.data.valid) {
            setUser(JSON.parse(storedUser));
          } else {
            // If token is invalid, clear local storage
            logout();
          }
        } catch (error) {
          console.error('Auth verification error:', error);
          logout();
        }
      }
      
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Set auth header for future requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Remove auth header
    delete axios.defaults.headers.common['Authorization'];
    
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
