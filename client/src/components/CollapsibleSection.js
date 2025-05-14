import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const CollapsibleSection = ({ className, title, children }) => {
  return (
    <Box mt={4} mb={4} sx={{ width: '70%', mx: 'auto' }}>
      <Accordion className={className} sx={{ boxShadow: '0 1px 4px 0' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5" align="center" sx={{ width: '100%' }}>
            {title}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ width: '75%', margin: '0 auto' }}>
            {children}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default CollapsibleSection;