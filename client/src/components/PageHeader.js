import React from 'react';
import { Box, Typography } from '@mui/material';

const PageHeader = ({ title, subtitle }) => {
  return (
    <Box
      sx={{
        backgroundColor: '#f5f8fb',
        color: 'black',
        padding: '7px',
        borderRadius: '0 0 0 0',
        textAlign: 'center',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
        marginBottom: '20px',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 'medium',
          fontFamily: 'Montserrat, Roboto, Arial, sans-serif',
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant="subtitle1"
          sx={{
            opacity: 0.8,
            fontFamily: 'monospace',
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default PageHeader;