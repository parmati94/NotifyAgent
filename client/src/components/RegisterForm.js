import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, Card, CardContent, CardActions } from '@mui/material';
import CustomSnackbar from './CustomSnackbar';
import { useNavigate } from 'react-router-dom';

const REACT_APP_API_BASE_URL = window._env_.REACT_APP_API_BASE_URL || 'http://localhost:8000';

function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');

  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault(); // Prevent the default form submission
    try {
      await axios.post(`${REACT_APP_API_BASE_URL}/register/`, { username, email, password });
      navigate('/login', {
        state: {
          message: 'Registration successful. You can now log in.',
          severity: 'success',
        },
      });
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
        <form onSubmit={handleRegister}>
          <CardContent>
            <Typography variant="h4" color="primary" gutterBottom align="center">
              Register
            </Typography>
            <TextField
              type="text"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              margin="normal"
            />
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
            <Button type="submit" variant="contained" color="primary">
              Register
            </Button>
          </CardActions>
        </form>
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