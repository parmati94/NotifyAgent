import React, { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';

import { API_BASE_URL } from '../config';

const PAGE_SIZE = 10;

// Sent messages as a transmission log: mono timestamp, subject, clamped body
// (click a row to expand), service chips, and a save-as-template action.
const MessageLog = ({ messages }) => {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);

  const handleDialogOpen = (message) => {
    setSelectedMessage(message);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setTemplateName('');
    setSelectedMessage(null);
  };

  const handleSaveTemplate = async () => {
    if (!templateName || !selectedMessage) return;

    try {
      await axios.post(`${API_BASE_URL}/message_templates/`, {
        name: templateName,
        subject: selectedMessage.subject,
        body: selectedMessage.body
      });
      handleDialogClose();
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  const sortedMessages = [...messages].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const visibleMessages = sortedMessages.slice(0, visibleCount);

  const formatTimestamp = (timestamp) =>
    new Date(timestamp.replace(' ', 'T') + 'Z').toLocaleString();

  return (
    <Box>
      <Paper sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
        {visibleMessages.map((message, index) => {
          const expanded = expandedIndex === index;
          return (
            <Box
              key={index}
              onClick={() => setExpandedIndex(expanded ? null : index)}
              sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'flex-start',
                px: { xs: 2, md: 3 },
                py: 2,
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'action.hover' },
                '&:not(:last-child)': { borderBottom: '1px solid', borderColor: 'divider' },
              }}
            >
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamilyMono,
                  fontSize: '0.74rem',
                  color: 'text.secondary',
                  whiteSpace: 'nowrap',
                  pt: 0.4,
                  width: 150,
                  flexShrink: 0,
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                {formatTimestamp(message.timestamp)}
              </Typography>
              <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                  {message.subject}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamilyMono,
                    fontSize: '0.72rem',
                    color: 'text.secondary',
                    display: { xs: 'block', sm: 'none' },
                    mb: 0.5,
                  }}
                >
                  {formatTimestamp(message.timestamp)}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    whiteSpace: 'pre-line',
                    ...(expanded
                      ? {}
                      : {
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }),
                  }}
                >
                  {message.body}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                {(message.services || '').split(', ').filter(Boolean).map((service) => (
                  <Chip
                    key={service}
                    label={service}
                    size="small"
                    variant="outlined"
                    sx={{ fontFamily: (theme) => theme.typography.fontFamilyMono, fontSize: '0.66rem' }}
                  />
                ))}
                <Tooltip title="Save as template">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDialogOpen(message);
                    }}
                  >
                    <SaveIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          );
        })}
      </Paper>

      {visibleCount < sortedMessages.length && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>
            Show more ({sortedMessages.length - visibleCount} older)
          </Button>
        </Box>
      )}

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Save Template</DialogTitle>
        <DialogContent>
          <TextField
            label="Template Name"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveTemplate} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MessageLog;
