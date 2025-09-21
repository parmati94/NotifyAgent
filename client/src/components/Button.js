import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { CircularProgress } from '@mui/material';

const StyledButton = styled(Button)(({ theme, variant }) => ({
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
    transition: 'left 0.5s',
  },
  
  '&:hover::before': {
    left: '100%',
  },
  
  ...(variant === 'gradient' && {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    '&:hover': {
      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
      transform: 'translateY(-3px)',
      boxShadow: '0 12px 30px rgba(102, 126, 234, 0.4)',
    },
  }),
}));

export default function CustomButton({ 
  onClick, 
  children, 
  type, 
  disabled, 
  loading = false,
  variant = 'contained',
  size = 'medium',
  sx, 
  ...props 
}) {
  return (
    <StyledButton 
      variant={variant}
      color="primary" 
      onClick={onClick}
      type={type}
      disabled={disabled || loading}
      size={size}
      sx={{
        minWidth: size === 'large' ? 200 : size === 'small' ? 100 : 150,
        height: size === 'large' ? 56 : size === 'small' ? 36 : 44,
        ...sx
      }}
      {...props}
    >
      {loading && (
        <CircularProgress 
          size={20} 
          sx={{ 
            position: 'absolute',
            color: 'inherit',
          }} 
        />
      )}
      <span style={{ opacity: loading ? 0 : 1 }}>
        {children}
      </span>
    </StyledButton>
  );
}