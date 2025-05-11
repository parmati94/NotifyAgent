import React from 'react';
import { Box, Typography } from '@mui/material';

const PageHeader = ({ title, subtitle }) => {
  return (
    <Box
      sx={{
        backgroundColor: '#e0e0e0',
        color: 'black',
        padding: '7px',
        borderRadius: '0 0 0 0',
        textAlign: 'center',
        boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.2)',
        marginBottom: '20px',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 'bold',
          fontFamily: 'monospace',
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