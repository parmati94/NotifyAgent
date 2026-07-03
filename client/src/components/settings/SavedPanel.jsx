import React from 'react';
import { Box, Typography } from '@mui/material';

// Read-only display of a saved credential value, with a "Not set" fallback.
export const SavedValue = ({ label, value }) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: 2,
      py: 1,
      px: 1.5,
      '&:not(:last-of-type)': { borderBottom: '1px solid', borderColor: 'divider' },
    }}
  >
    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', whiteSpace: 'nowrap' }}>
      {label}
    </Typography>
    <Typography
      variant="body2"
      sx={{
        wordBreak: 'break-all',
        textAlign: 'right',
        fontFamily: (theme) => theme.typography.fontFamilyMono,
        fontSize: '0.78rem',
      }}
    >
      {value ? value : <Box component="span" sx={{ color: 'text.disabled', fontStyle: 'italic', fontFamily: 'inherit' }}>Not set</Box>}
    </Typography>
  </Box>
);

// Wrapper panel for a group of SavedValue rows.
export const SavedPanel = ({ title, children }) => (
  <Box sx={{ mt: 3 }}>
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamilyMono,
        fontSize: '0.68rem',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'text.secondary',
        mb: 1,
      }}
    >
      {title}
    </Typography>
    <Box
      sx={{
        maxWidth: 460,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'background.default',
        overflow: 'hidden',
      }}
    >
      {children}
    </Box>
  </Box>
);
