import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PageHeader from './PageHeader';
import { 
  Box, Typography, Card, CardContent, Grid, useTheme, 
  alpha, Divider, Paper, Chip
} from '@mui/material';
import DataTable from './DataTable';
import SaveIcon from '@mui/icons-material/Save';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton, Tooltip } from '@mui/material';
import CustomButton from './Button';
import ConfirmationDialog from './ConfirmationDialog';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import HistoryIcon from '@mui/icons-material/History';

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const MessageHistory = () => {
  const [messages, setMessages] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const theme = useTheme();

  // Fetch message history when the component mounts
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        console.log('Fetching message history...');
        const response = await axios.get(`${REACT_APP_API_BASE_URL}/get_sent_messages/`);
        console.log('Message history fetched:', response.data);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching message history:', error);
      }
    };

    fetchMessages();
  }, []);

  // Function to clear all messages
  const clearMessages = async () => {
    try {
      console.log('Clearing all messages...');
      await axios.delete(`${REACT_APP_API_BASE_URL}/clear_sent_messages/`);
      setMessages([]); // Clear the messages in the state
      console.log('All messages cleared.');
    } catch (error) {
      console.error('Error clearing messages:', error);
    }
  };

  // Delete all messages from history
  const clearHistory = async () => {
    try {
      await axios.delete(`${REACT_APP_API_BASE_URL}/clear_message_history/`);
      setMessages([]);
      console.log('Message history cleared');
    } catch (error) {
      console.error('Error clearing message history:', error);
    }
  };

  // Handle saving a message as a template
  const handleDialogOpen = (message) => {
    setSelectedMessage(message);
    setTemplateDialogOpen(true);
  };

  const handleDialogClose = () => {
    setTemplateDialogOpen(false);
    setTemplateName('');
    setSelectedMessage(null);
  };

  const handleSaveTemplate = async () => {
    if (!templateName || !selectedMessage) return;

    try {
      await axios.post(`${REACT_APP_API_BASE_URL}/message_templates/`, {
        name: templateName,
        subject: selectedMessage.subject,
        body: selectedMessage.body
      });
      handleDialogClose();
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  // Handle dialog close
  const handleDialogCloseConfirmation = (confirmed) => {
    setDialogOpen(false);
    if (confirmed) {
      clearMessages();
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 2 }}>
      <PageHeader title="Message History" subtitle="View history of sent notifications" />
      
      <Box sx={{ mb: 4 }}>
        <Card elevation={2} sx={{ 
          borderRadius: theme.shape.borderRadius
        }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{
              p: 3,
              backgroundColor: alpha(theme.palette.primary.light, 0.1),
              borderBottom: `1px solid ${theme.palette.divider}`
            }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <HistoryIcon color="primary" />
                    <Typography variant="h6" component="h3">
                      Notification History
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip 
                      label={`${messages.length} Message${messages.length !== 1 ? 's' : ''}`} 
                      size="small"
                      color={messages.length > 0 ? "primary" : "default"}
                      variant="outlined"
                    />
                    <Typography variant="body2" color="text.secondary">
                      {messages.length > 0 
                        ? "Record of previously sent notifications" 
                        : "No message history available"}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} sx={{ 
                  display: 'flex', 
                  justifyContent: { xs: 'flex-start', sm: 'flex-end' }
                }}>
                  <CustomButton 
                    onClick={() => setDialogOpen(true)}
                    color="secondary"
                    startIcon={<DeleteSweepIcon />}
                    variant="outlined"
                    disabled={messages.length === 0}
                  >
                    Clear History
                  </CustomButton>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ width: '100%' }}>
              <DataTable
                columns={[
                  {
                    id: 'subject',
                    header: 'Subject',
                    accessor: (row) => row.subject,
                    align: 'left',
                    searchable: true
                  },
                  {
                    id: 'body',
                    header: 'Body',
                    accessor: (row) => row.body,
                    align: 'left',
                    searchable: true,
                    render: (row) => (
                      <div style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {row.body}
                      </div>
                    )
                  },
                  {
                    id: 'services',
                    header: 'Services Used',
                    accessor: (row) => row.services,
                    align: 'center',
                    searchable: true
                  },
                  {
                    id: 'timestamp',
                    header: 'Time',
                    accessor: (row) => row.timestamp,
                    align: 'center',
                    render: (row) => (
                      new Date(row.timestamp.replace(' ', 'T') + 'Z').toLocaleString()
                    )
                  },
                  {
                    id: 'actions',
                    header: 'Actions',
                    accessor: () => null,
                    align: 'center',
                    sortable: false,
                    width: '100px',
                    render: (row) => (
                      <Tooltip title="Save as Template">
                        <IconButton onClick={() => handleDialogOpen(row)}>
                          <SaveIcon />
                        </IconButton>
                      </Tooltip>
                    ),
                  }
                ]}
                data={messages}
                enableSearch={true}
                enableSort={true}
                defaultRowsPerPage={5}
                rowsPerPageOptions={[5, 10, 20, 50]}
                emptyMessage="No message history available"
              />
              
              {messages.length === 0 && (
                <Box sx={{ 
                  p: 4, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  backgroundColor: alpha(theme.palette.grey[100], 0.5)
                }}>
                  <HistoryIcon 
                    sx={{ 
                      fontSize: 60, 
                      color: alpha(theme.palette.text.secondary, 0.3),
                      mb: 2
                    }} 
                  />
                  <Typography variant="subtitle1" color="text.secondary">
                    No message history found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    When you send notifications, they will appear here
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={dialogOpen}
        title="Clear Message History"
        content="Are you sure you want to clear all message history? This action cannot be undone."
        onConfirm={() => handleDialogCloseConfirmation(true)}
        onCancel={() => handleDialogCloseConfirmation(false)}
      />

      {/* Save Template Dialog */}
      <Dialog open={templateDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Save as Template</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Template Name"
            fullWidth
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveTemplate} color="primary" disabled={!templateName}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MessageHistory;