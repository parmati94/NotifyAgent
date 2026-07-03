import React from 'react';
import { Box, Typography } from '@mui/material';

// Title + one-line description at the top of a settings pane.
const SectionHeader = ({ title, description }) => (
  <Box sx={{ mb: 2.5 }}>
    <Typography variant="h6">{title}</Typography>
    {description && (
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        {description}
      </Typography>
    )}
  </Box>
);

export default SectionHeader;
