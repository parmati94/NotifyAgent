import * as React from 'react';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

const StyledMultilineTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    transition: 'all 0.3s ease',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    '&:hover': {
      transform: 'translateY(-2px)',
      backgroundColor: 'rgba(255, 255, 255, 1)',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.light,
        borderWidth: 2,
      },
    },
    '&.Mui-focused': {
      transform: 'translateY(-2px)',
      backgroundColor: 'rgba(255, 255, 255, 1)',
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

export default function CustomMultilineTextField({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  minRows = 3,
  maxRows = 8,
  sx,
  ...rest 
}) {
  return (
    <StyledMultilineTextField
      type="text"
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      variant="outlined"
      fullWidth
      margin="normal"
      multiline
      minRows={minRows}
      maxRows={maxRows}
      sx={{ 
        width: '75%',
        ...sx 
      }}
      {...rest}
    />
  );
}