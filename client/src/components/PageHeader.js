import React from 'react';
import { Box, Typography } from '@mui/material';

const PageHeader = ({ title, subtitle }) => {
  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        color: 'text.primary',
        py: 2,
        px: 2,
        textAlign: 'center',
        boxShadow: '0 4px 16px rgba(26, 39, 51, 0.06)',
        borderBottom: '1px solid',
        borderColor: 'divider',
        mb: '20px',
      }}
    >
      <Typography variant="h4">
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{ fontFamily: 'monospace' }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default PageHeader;