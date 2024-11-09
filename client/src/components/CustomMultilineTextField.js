import * as React from 'react';
import TextField from '@mui/material/TextField';

export default function CustomMultilineTextField({ label, value, onChange, placeholder }) {
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
      multiline
      minRows={1}
      sx={{ width: '75%' }}
    />
  );
}