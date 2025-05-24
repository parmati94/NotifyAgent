import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

// Use the environment variable directly
const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';
console.log(`Auth Context using API base URL: ${REACT_APP_API_BASE_URL}`);

// Create auth context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpiring, setSessionExpiring] = useState(false);
    // Function to handle logout
  const logout = useCallback(() => {
    // Clear timers
    if (window.warningTimer) {
      clearTimeout(window.warningTimer);
      window.warningTimer = null;
    }
    
    if (window.logoutTimer) {
      clearTimeout(window.logoutTimer);
      window.logoutTimer = null;
    }
    
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('plannedWarningTime');
    localStorage.removeItem('plannedExpiryTime');
    
    // Remove auth header
    delete axios.defaults.headers.common['Authorization'];
    
    setUser(null);
    setSessionExpiring(false);
  }, []);
  // Function to set up automatic session timeout
  const setupSessionTimeout = useCallback(() => {
    // Clear any existing timeouts - these are in-memory timers, don't use localStorage
    if (window.logoutTimer) {
      clearTimeout(window.logoutTimer);
      window.logoutTimer = null;
    }
    
    if (window.warningTimer) {
      clearTimeout(window.warningTimer);
      window.warningTimer = null;
    }
    
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    if (!tokenExpiry) return;
    
    const expiryTime = parseInt(tokenExpiry);
    const currentTime = new Date().getTime();
    const timeUntilExpiry = expiryTime - currentTime;
    
    console.log(`Session will expire in ${timeUntilExpiry/1000} seconds`);
    
    // If already expired, logout immediately
    if (timeUntilExpiry <= 0) {
      console.log('Token already expired, logging out');
      logout();
      return;
    }
      // Set a warning 5 minutes before expiry
    const warningTime = Math.max(timeUntilExpiry - (5 * 60 * 1000), 0); // 5 minutes = 5 * 60 * 1000 ms
    console.log(`Warning will show in ${warningTime/1000} seconds`);
    
    // Store the planned warning and expiry times for debugging
    localStorage.setItem('plannedWarningTime', new Date(currentTime + warningTime).toISOString());
    localStorage.setItem('plannedExpiryTime', new Date(expiryTime).toISOString());
    
    window.warningTimer = setTimeout(() => {
      console.log('Session expiry warning triggered at', new Date().toISOString());
      setSessionExpiring(true);
    }, warningTime);
    
    // Set actual logout at expiry time
    window.logoutTimer = setTimeout(() => {
      console.log('Session expired, automatic logout triggered at', new Date().toISOString());
      logout();
    }, timeUntilExpiry);
    
    return () => {
      if (window.warningTimer) clearTimeout(window.warningTimer);
      if (window.logoutTimer) clearTimeout(window.logoutTimer);
    };
  }, [logout]);

  useEffect(() => {
    // Check if user is already logged in on component mount
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');
      const tokenExpiry = localStorage.getItem('tokenExpiry');
      
      // Check if token has expired locally
      if (tokenExpiry && new Date().getTime() > parseInt(tokenExpiry)) {
        console.log('Token expired locally');
        logout();
        setLoading(false);
        return;
      }
      
      if (token && storedUser) {
        try {
          // Set the token for all future requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // Validate token with the backend
          const response = await axios.get(`${REACT_APP_API_BASE_URL}/verify-token/`);
          
          if (response.data && response.data.valid) {
            setUser(JSON.parse(storedUser));
            
            // Update token expiry if provided by backend
            if (response.data.expiry) {
              localStorage.setItem('tokenExpiry', response.data.expiry.toString());
            }
            
            // Set up session timeout
            setupSessionTimeout();
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
    
    // Set up axios interceptor for handling 401 errors
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          // Auto logout on 401 Unauthorized responses
          console.log('Received 401 response, logging out');
          logout();
        }
        return Promise.reject(error);
      }
    );
    
    // Clean up
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [logout, setupSessionTimeout]);
      const extendSession = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (token && user) {
      try {
        console.log('Extending session...');
        // Call the refresh token endpoint to get a new token
        const response = await axios.post(`${REACT_APP_API_BASE_URL}/refresh-token/`);
        
        if (response.data && response.data.token) {
          console.log('Received new token with expiry:', response.data.expires_at);
          // Update token in localStorage
          localStorage.setItem('authToken', response.data.token);
            // Update expiry time
          if (response.data.expires_at) {
            localStorage.setItem('tokenExpiry', response.data.expires_at.toString());
          } else {
            // Fallback: calculate new expiry time - 1 hour
            const expiryTimeMs = new Date().getTime() + (60 * 60 * 1000); // 1 hour in milliseconds
            localStorage.setItem('tokenExpiry', expiryTimeMs.toString());
          }
          
          // Update auth header
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
          
          // Reset the warning
          setSessionExpiring(false);
          
          // Set up new timeout
          setupSessionTimeout();
          
          console.log('Session extended successfully');
          return true;
        }
      } catch (error) {
        console.error('Error extending session:', error);
        // If there's an error, logout the user
        logout();
        return false;
      }
    }
    return false;
  }, [user, setupSessionTimeout, logout]);  const login = useCallback((userData, token, expiryTimeMs) => {
    // Use 1 hour expiry if not provided by backend
    const tokenExpiryTime = expiryTimeMs || (new Date().getTime() + (60 * 60 * 1000)); // 1 hour in milliseconds
    
    console.log('Login with token expiry at:', new Date(tokenExpiryTime).toISOString());
    
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('tokenExpiry', tokenExpiryTime.toString());
    
    // Set auth header for future requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    setUser(userData);
    
    // Set up session timeout
    setupSessionTimeout();
  }, [setupSessionTimeout]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      sessionExpiring, 
      extendSession 
    }}>
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
