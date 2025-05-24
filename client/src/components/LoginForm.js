import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, CircularProgress, useTheme } from '@mui/material';
import CustomTextField from './TextField';
import CustomButton from './Button';
import CustomSnackbar from './CustomSnackbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import { useAuth } from '../context/AuthContext';

// Use the environment variable if available, otherwise use a default value
const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');
  
  const navigate = useNavigate();
  const theme = useTheme();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    
    // Log user interaction for debugging
    console.log('Login button clicked for user:', username);
    
    if (loading) return;
    setLoading(true);

    try {
      // Debug log for URL
      console.log(`Sending login request to: ${REACT_APP_API_BASE_URL}/login/`);
      
      // Create URLSearchParams for proper x-www-form-urlencoded format
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      // Show what we're sending for debugging
      console.log('Form data:', username);

      // Using axios for more straightforward error handling
      const response = await axios.post(`${REACT_APP_API_BASE_URL}/login/`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      console.log('Login response:', response.data);
        if (response.data && response.data.token) {
        console.log('Login successful, token received');
        
        // Use the login function from AuthContext with expiry time from server
        login(
          { username: response.data.username }, 
          response.data.token,
          response.data.expires_at // Pass the expiry time from the backend
        );
        
        setSnackbarMessage('Login successful');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        
        // Redirect to homepage after successful login
        setTimeout(() => {
          navigate('/');
        }, 1000);
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Axios provides error.response for handling API errors
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        console.error('Error response status:', error.response.status);
        console.error('Error response data:', error.response.data);
        setSnackbarMessage(error.response.data.detail || 'Login failed. Please check your credentials.');
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
        setSnackbarMessage('No response received from server. Please try again later.');
      } else {
        // Something happened in setting up the request
        console.error('Error message:', error.message);
        setSnackbarMessage('An error occurred. Please try again.');
      }
      
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default
      }}
    > <Card 
        sx={{ 
          maxWidth: 400, 
          width: '90%', 
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <CardContent sx={{ p: 4, width: '100%' }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                color: theme.palette.primary.main,
                fontFamily: 'monospace',
                letterSpacing: '.2rem',
              }}
            >
              NotifyAgent
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Please sign in to continue
            </Typography>          
          </Box>

          <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CustomTextField
              label="Username"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              required
              variant="outlined"
              InputProps={{
                startAdornment: <PersonIcon color="action" sx={{ mr: 1 }} />
              }}
            />
            
            <CustomTextField
              label="Password"
              fullWidth
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              variant="outlined"
              InputProps={{
                startAdornment: <LockIcon color="action" sx={{ mr: 1 }} />
              }}
            />

            <Box sx={{ mt: 3 }}>
              <CustomButton
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ py: 1.2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Sign In'}
              </CustomButton>
            </Box>
          </form>
        </CardContent>
      </Card>
      
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={handleSnackbarClose}
      />
    </Box>
  );
};

export default LoginForm;
