import React, { useState, useEffect } from 'react';
import { Alert, Box, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const TestingNotice = () => {
  const { user } = useAuth();
  const [timeLeft, setTimeLeft] = useState(null);
  
  useEffect(() => {
    // Only run if user is logged in
    if (!user) {
      setTimeLeft(null);
      return;
    }
    
    // Update time left every second
    const interval = setInterval(() => {
      const expiry = localStorage.getItem('tokenExpiry');
      if (expiry) {
        const remaining = parseInt(expiry) - new Date().getTime();
        setTimeLeft(Math.max(0, remaining));
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [user]);
  
  if (!user || !timeLeft) return null;
  
  return (
    <Box sx={{ position: 'fixed', bottom: 10, right: 10, zIndex: 9999, width: '300px' }}>
      <Alert severity="warning" variant="filled">
        Testing Mode: 1-minute session with 15-second warning
        <Typography variant="body2" sx={{ mt: 1 }}>
          Session expires in: {Math.floor(timeLeft / 1000)} seconds
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.7rem' }}>
          Warning at: {localStorage.getItem('plannedWarningTime')}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.7rem' }}>
          Expiry at: {localStorage.getItem('plannedExpiryTime')}
        </Typography>
      </Alert>
    </Box>
  );
};

export default TestingNotice;
