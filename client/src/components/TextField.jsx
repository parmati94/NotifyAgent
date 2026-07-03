import * as React from 'react';
import TextField from '@mui/material/TextField';

export default function CustomTextField({ label, value, onChange, placeholder, sx, InputProps, ...rest }) {
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
      sx={sx}
      InputProps={InputProps}
      {...rest}
    />
  );
}
