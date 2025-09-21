import * as React from 'react';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.light,
        borderWidth: 2,
      },
    },
    '&.Mui-focused': {
      transform: 'translateY(-2px)',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
        boxShadow: `0 0 0 3px ${theme.palette.primary.main}20`,
      },
    },
  },
  '& .MuiInputLabel-root': {
    fontWeight: 500,
    '&.Mui-focused': {
      color: theme.palette.primary.main,
    },
  },
}));

export default function CustomTextField({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  sx, 
  InputProps, 
  variant = 'outlined',
  ...rest 
}) {
  return (
    <StyledTextField
      type="text"
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      variant={variant}
      fullWidth
      margin="normal"
      sx={{ 
        width: '75%', 
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
        },
        ...sx 
      }}
      InputProps={InputProps}
      {...rest}
    />
  );
}