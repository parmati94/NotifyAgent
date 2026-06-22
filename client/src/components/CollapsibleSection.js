import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, Tooltip, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// A settings section rendered as an accordion. `icon` shows a leading
// accent icon and `info` renders a tooltip help bubble next to the title.
const CollapsibleSection = ({ className, title, icon, info, children }) => {
  return (
    <Box mt={3} mb={3} sx={{ width: { xs: '92%', md: '70%' }, mx: 'auto' }}>
      <Accordion className={className} disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, width: '100%' }}>
            {icon && (
              <Box sx={{ display: 'flex', color: 'primary.main' }}>{icon}</Box>
            )}
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
            {info && (
              <Tooltip title={info} placement="right">
                <IconButton size="small" sx={{ color: 'text.secondary', ml: -0.5 }}>
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ width: { xs: '100%', sm: '80%' }, mx: 'auto', py: 1 }}>
            {children}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default CollapsibleSection;
