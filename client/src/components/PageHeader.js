import React from 'react';
import { Box, Typography } from '@mui/material';

// Page title block: mono uppercase eyebrow over a display-face heading,
// with an optional action slot on the right (e.g. a page-level button).
const PageHeader = ({ title, eyebrow, subtitle, action }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 2,
        flexWrap: 'wrap',
        mb: 3.5,
      }}
    >
      <Box>
        {eyebrow && (
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamilyMono,
              fontSize: '0.68rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'primary.main',
              mb: 0.5,
            }}
          >
            {eyebrow}
          </Typography>
        )}
        <Typography variant="h4">{title}</Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
    </Box>
  );
};

export default PageHeader;
