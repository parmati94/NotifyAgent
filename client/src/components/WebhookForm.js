import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PageHeader from './PageHeader';
import CustomButton from './Button';
import CustomTextField from './TextField';
import WebhookTable from './WebhookTable';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import CustomSnackbar from './CustomSnackbar';

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function WebhookForm() {
  const [webhooks, setWebhooks] = useState([]);
  const [channelName, setChannelName] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch existing webhooks when the component mounts
  useEffect(() => {
    const fetchWebhooks = async () => {
      try {
        console.log('Fetching webhooks...');
        const response = await axios.get(`${REACT_APP_API_BASE_URL}/get_webhooks/`);
        console.log('Webhooks fetched:', response.data);
        setWebhooks(response.data);
      } catch (error) {
        console.error('Error fetching webhooks:', error);
      }
    };

    fetchWebhooks();
  }, []);

  // Add a new webhook
  const addWebhook = async () => {
    try {
      await axios.post(`${REACT_APP_API_BASE_URL}/set_webhook/`, {
        channel_name: channelName,
        webhook_url: webhookUrl,
        is_active: true // Default to active when adding a new webhook
      });
      // Manually add the new webhook to the state
      setWebhooks([...webhooks, { channel_name: channelName, webhook_url: webhookUrl, is_active: true }]);
      setChannelName('');
      setWebhookUrl('');
      setSnackbarMessage('Webhook URL set successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setDialogOpen(false);
    } catch (error) {
      console.error('Error setting webhook URL:', error);
      setSnackbarMessage('Error setting webhook URL');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Delete a webhook
  const deleteWebhook = async (channelName) => {
    try {
      await axios.delete(`${REACT_APP_API_BASE_URL}/webhooks/${channelName}`);
      setWebhooks(webhooks.filter(webhook => webhook.channel_name !== channelName));
      setSnackbarMessage('Webhook deleted successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error deleting webhook:', error);
      setSnackbarMessage('Error deleting webhook');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Toggle webhook active state
  const toggleWebhookActive = async (channelName) => {
    const webhook = webhooks.find(w => w.channel_name === channelName);
    if (!webhook) return;

    try {
      const updatedWebhook = { ...webhook, is_active: !webhook.is_active };
      await axios.put(`${REACT_APP_API_BASE_URL}/update_webhook/`, updatedWebhook);
      setWebhooks(webhooks.map(w => (w.channel_name === channelName ? updatedWebhook : w)));
      setSnackbarMessage('Webhook updated successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error updating webhook:', error);
      setSnackbarMessage('Error updating webhook');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <div>
      <PageHeader title="Webhooks" />
      <WebhookTable webhooks={webhooks} onDelete={deleteWebhook} onToggleActive={toggleWebhookActive} />
      <Box mt={4} display="flex" justifyContent="center">
        <CustomButton onClick={handleDialogOpen}>Add Webhook</CustomButton>
      </Box>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Add New Webhook</DialogTitle>
        <DialogContent>
          <CustomTextField
            type="text"
            label="Channel Name"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
          />
          <CustomTextField
            type="text"
            label="Webhook URL"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={addWebhook} color="primary">
            Add Webhook
          </Button>
        </DialogActions>
      </Dialog>
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={handleSnackbarClose}
      />
    </div>
  );
}

export default WebhookForm;