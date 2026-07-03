import * as React from 'react';
import TextField from '@mui/material/TextField';

export default function CustomMultilineTextField({ label, value, onChange, placeholder, minRows = 4 }) {
  return (
    <TextField
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
    />
  );
}
