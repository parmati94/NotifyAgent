import * as React from 'react';
import TextField from '@mui/material/TextField';

export default function CustomTextField({ label, value, onChange, placeholder }) {
  return (
    <TextField
      type="text"
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      variant="standard"
      fullWidth
      margin="normal"
      sx={{ width: '75%' }}
    />
  );
}