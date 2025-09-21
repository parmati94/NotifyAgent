import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, CircularProgress, useTheme } from '@mui/material';
import CustomTextField from './TextField';
import CustomButton from './Button';
import CustomSnackbar from './CustomSnackbar';
import PageTransition from './PageTransition';
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
    <PageTransition animationType="fadeInScale">
      <Box 
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: 2
        }}
      > 
      <Card 
        sx={{ 
          maxWidth: 450, 
          width: '100%', 
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 5,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Decorative background element */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 100,
            height: 100,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '0 0 0 100px',
            opacity: 0.1,
          }}
        />
        
        <CardContent sx={{ p: 6, width: '100%', position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700, 
                background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: 'Inter, monospace',
                letterSpacing: '.1rem',
                marginBottom: 2
              }}
            >
              NotifyAgent
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'text.secondary',
                fontWeight: 500,
                fontSize: '1.1rem'
              }}
            >
              Welcome back! Please sign in to continue
            </Typography>          
          </Box>

          <form onSubmit={handleLogin} style={{ width: '100%' }}>
            <CustomTextField
              label="Username"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              required
              variant="outlined"
              sx={{ 
                width: '100%',
                marginBottom: 3,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                }
              }}
              InputProps={{
                startAdornment: <PersonIcon color="primary" sx={{ mr: 1.5 }} />
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
              sx={{ 
                width: '100%',
                marginBottom: 4,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                }
              }}
              InputProps={{
                startAdornment: <LockIcon color="primary" sx={{ mr: 1.5 }} />
              }}
            />

            <CustomButton
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              loading={loading}
              size="large"
              sx={{ 
                py: 1.5,
                fontSize: '1.1rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                }
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </CustomButton>
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
    </PageTransition>
  );
};

export default LoginForm;
