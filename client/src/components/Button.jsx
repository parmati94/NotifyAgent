import * as React from 'react';
import Button from '@mui/material/Button';

export default function CustomButton({ onClick, children, type, disabled, sx, ...props }) {
  return <Button 
    variant="contained" 
    color="primary" 
    onClick={onClick}
    type={type}
    disabled={disabled}
    sx={sx}
    {...props}
  >
    {children}
  </Button>;
}