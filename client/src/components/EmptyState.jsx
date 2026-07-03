import React from 'react';
import { Box, Typography } from '@mui/material';

// Placeholder for an empty list: says what belongs here and offers the
// action that fills it.
const EmptyState = ({ icon, title, description, action }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: 1,
      py: 7,
      px: 3,
      border: '1px dashed',
      borderColor: 'divider',
      borderRadius: 3,
    }}
  >
    {icon && <Box sx={{ color: 'text.secondary', '& svg': { fontSize: 40 } }}>{icon}</Box>}
    <Typography variant="h6">{title}</Typography>
    {description && (
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420 }}>
        {description}
      </Typography>
    )}
    {action && <Box sx={{ mt: 1.5 }}>{action}</Box>}
  </Box>
);

export default EmptyState;
