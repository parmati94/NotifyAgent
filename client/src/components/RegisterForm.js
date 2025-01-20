import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, Card, CardContent, CardActions } from '@mui/material';
import CustomSnackbar from './CustomSnackbar';

const REACT_APP_API_BASE_URL = window._env_.REACT_APP_API_BASE_URL || 'http://localhost:8000';

function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');

  const handleRegister = async () => {
    try {
      await axios.post(`${REACT_APP_API_BASE_URL}/register/`, { email, password });
      setSnackbarMessage('Registration successful. You can now log in.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.detail) {
        // Display specific error message from the API
        setSnackbarMessage(error.response.data.detail);
      } else {
        // Display a generic error message
        setSnackbarMessage('Registration failed. Please try again.');
      }
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
      <Card sx={{ maxWidth: 400, width: '100%', padding: 2, boxShadow: 6, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h4" color="primary" gutterBottom align="center">
            Register
          </Typography>
          <TextField
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
        </CardContent>
        <CardActions sx={{ justifyContent: 'center' }}>
          <Button variant="contained" color="primary" onClick={handleRegister}>
            Register
          </Button>
        </CardActions>
      </Card>
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={handleSnackbarClose}
      />
    </Box>
  );
}

export default RegisterForm;