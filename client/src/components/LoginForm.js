import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, Card, CardContent, CardActions } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import CustomSnackbar from './CustomSnackbar';

const REACT_APP_API_BASE_URL = window._env_.REACT_APP_API_BASE_URL || 'http://localhost:8000';

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.message) {
      setSnackbarMessage(location.state.message);
      setSnackbarSeverity(location.state.severity);
      setSnackbarOpen(true);
    }
  }, [location.state]);

  const handleLogin = async (event) => {
    event.preventDefault(); // Prevent the default form submission
    try {
      const response = await axios.post(`${REACT_APP_API_BASE_URL}/token`, new URLSearchParams({
        username: username,
        password: password
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      onLogin(response.data.access_token);
      navigate('/', {
        state: {
          message: 'Login successful. Welcome!',
          severity: 'success',
        },
      });
    } catch (error) {
      setSnackbarMessage('Login failed. Please check your credentials.');
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
        <form onSubmit={handleLogin}>
          <CardContent>
            <Typography variant="h4" color="primary" gutterBottom align="center">
              Login
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
              Login
            </Button>
          </CardActions>
        </form>
        <Box sx={{ textAlign: 'center', marginTop: 2 }}>
          <Typography variant="body2">
            Don't have an account? <Link to="/register">Register</Link>
          </Typography>
        </Box>
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

export default LoginForm;