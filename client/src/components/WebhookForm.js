import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomButton from './Button';
import CustomTextField from './TextField';
import WebhookTable from './WebhookTable';
import { Typography, Box } from '@mui/material';
import CustomSnackbar from './CustomSnackbar';

const REACT_APP_API_BASE_URL = window._env_.REACT_APP_API_BASE_URL || 'http://localhost:8000';

function WebhookForm() {
  const [webhooks, setWebhooks] = useState([]);
  const [channelName, setChannelName] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

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
      const response = await axios.post(`${REACT_APP_API_BASE_URL}/set_webhook/`, {
        channel_name: channelName,
        webhook_url: webhookUrl
      });
      // Manually add the new webhook to the state
      setWebhooks([...webhooks, { channel_name: channelName, webhook_url: webhookUrl }]);
      setChannelName('');
      setWebhookUrl('');
      setSnackbarMessage('Webhook URL set successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
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

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
      <Box sx={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px', textAlign: 'center', marginBottom: '20px' }}>
        <Typography variant="h4" color="primary" gutterBottom>
          Webhook URL's
        </Typography>
      </Box>
      <WebhookTable webhooks={webhooks} onDelete={deleteWebhook} />
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Add New Webhook
        </Typography>
        <Box sx={{ width: '75%', margin: '0 auto' }}>
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
          <Box mt={2} display="flex" justifyContent="center">
            <CustomButton onClick={addWebhook}>Add Webhook</CustomButton>
          </Box>
        </Box>
      </Box>
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