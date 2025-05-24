import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const SessionExpiryDialog = () => {  const { sessionExpiring, extendSession, logout } = useAuth();
  const [secondsLeft, setSecondsLeft] = useState(300); // 5 minutes = 300 seconds

  useEffect(() => {
    let intervalId;
    
    // Reset timer whenever the dialog opens
    if (sessionExpiring) {
      setSecondsLeft(300); // 5 minutes
      
      // Start countdown
      intervalId = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalId);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Clear countdown when dialog closes
      clearInterval(intervalId);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [sessionExpiring]);

  const handleExtendSession = async () => {
    console.log('User clicked to extend session');
    const result = await extendSession();
    console.log('Session extension result:', result);
  };

  return (
    <Dialog
      open={sessionExpiring}
      aria-labelledby="session-expiry-dialog-title"
      aria-describedby="session-expiry-dialog-description"
    >
      <DialogTitle id="session-expiry-dialog-title">
        Session About to Expire
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="session-expiry-dialog-description">
          Your session will expire in {secondsLeft} seconds. Would you like to extend your session or logout?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={logout} color="secondary">
          Logout
        </Button>
        <Button onClick={handleExtendSession} color="primary" autoFocus>
          Extend Session
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionExpiryDialog;
