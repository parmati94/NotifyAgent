import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  animation: `${float} 3s ease-in-out infinite`,
}));

const StyledCircularProgress = styled(CircularProgress)(({ theme }) => ({
  animation: `${pulse} 2s ease-in-out infinite`,
  color: theme.palette.primary.main,
}));

const LoadingSpinner = ({ size = 60, message = "Loading..." }) => {
  return (
    <StyledBox>
      <StyledCircularProgress size={size} thickness={4} />
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <span style={{ 
          fontSize: '1rem', 
          color: '#64748b',
          fontWeight: 500,
          animation: `${pulse} 2s ease-in-out infinite`
        }}>
          {message}
        </span>
      </Box>
    </StyledBox>
  );
};

export default LoadingSpinner;