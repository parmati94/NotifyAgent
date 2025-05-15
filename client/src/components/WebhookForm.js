import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PageHeader from './PageHeader';
import CustomButton from './Button';
import CustomTextField from './TextField';
import DataTable from './DataTable';
import DeleteIcon from '@mui/icons-material/Delete';
import Checkbox from '@mui/material/Checkbox';
import { 
  Box, Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Typography, Card, CardContent, Grid, Divider, Paper, useTheme, alpha,
  IconButton, Chip
} from '@mui/material';
import CustomSnackbar from './CustomSnackbar';
import AddIcon from '@mui/icons-material/Add';
import LinkIcon from '@mui/icons-material/Link';
import CloseIcon from '@mui/icons-material/Close';
import DiscordIcon from '@mui/icons-material/Chat';

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function WebhookForm() {
  const [webhooks, setWebhooks] = useState([]);
  const [channelName, setChannelName] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [dialogOpen, setDialogOpen] = useState(false);
  const theme = useTheme();

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

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 2 }}>
      <PageHeader title="Discord Webhooks" subtitle="Manage Discord webhook integrations" />
      
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
                  <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
                    Discord Webhook Configuration
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    You have {webhooks.length} webhook{webhooks.length !== 1 ? 's' : ''} configured
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ 
                  display: 'flex', 
                  justifyContent: { xs: 'flex-start', sm: 'flex-end' }
                }}>
                  <CustomButton 
                    onClick={() => setDialogOpen(true)}
                    color="primary"
                    startIcon={<AddIcon />}
                    variant="contained"
                    size="medium"
                  >
                    Add Webhook
                  </CustomButton>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ width: '100%' }}>
              <DataTable
                columns={[
                  {
                    id: 'active',
                    header: 'Active',
                    accessor: (row) => row.is_active,
                    align: 'center',
                    sortable: false,
                    render: (row) => (
                      <Checkbox
                        checked={row.is_active}
                        onChange={() => toggleWebhookActive(row.channel_name)}
                      />
                    ),
                  },
                  {
                    id: 'channelName',
                    header: 'Channel Name',
                    accessor: (row) => row.channel_name,
                    align: 'center',
                    searchable: true,
                  },
                  {
                    id: 'webhookUrl',
                    header: 'Webhook URL',
                    accessor: (row) => row.webhook_url,
                    align: 'center',
                    searchable: true,
                  },
                  {
                    id: 'actions',
                    header: 'Actions',
                    accessor: () => null,
                    align: 'center',
                    sortable: false,
                    render: (row) => (
                      <IconButton onClick={() => deleteWebhook(row.channel_name)}>
                        <DeleteIcon />
                      </IconButton>
                    ),
                  },
                ]}
                data={webhooks}
                idField="channel_name"
                enableSearch={true}
                enableSort={true}
                emptyMessage="No webhooks configured"
              />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Add Webhook Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: theme.shape.borderRadius,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          backgroundColor: theme.palette.primary.light,
          color: theme.palette.primary.dark,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DiscordIcon />
            <Typography variant="h6">Add Discord Webhook</Typography>
          </Box>
          <IconButton 
            onClick={() => setDialogOpen(false)}
            size="small"
            sx={{ color: theme.palette.primary.dark }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ mb: 1, ml: 0.5 }}>
                Enter the details of your Discord webhook integration
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                autoFocus
                label="Channel Name"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                fullWidth
                variant="outlined"
                placeholder="e.g., general-notifications"
                InputProps={{
                  startAdornment: <Box component="span" sx={{ mr: 1, color: theme.palette.grey[400] }}>#</Box>
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                label="Webhook URL"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                fullWidth
                variant="outlined"
                placeholder="https://discord.com/api/webhooks/..."
                InputProps={{
                  startAdornment: <LinkIcon color="action" sx={{ mr: 1 }} />
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                You can find the webhook URL in your Discord server settings under Integrations {'>'} Webhooks
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ 
          p: 3, 
          pt: 2,
          borderTop: `1px solid ${theme.palette.grey[200]}` 
        }}>
          <CustomButton 
            onClick={() => setDialogOpen(false)} 
            color="secondary"
            variant="outlined"
          >
            Cancel
          </CustomButton>
          <CustomButton 
            onClick={addWebhook} 
            color="primary"
            disabled={!channelName.trim() || !webhookUrl.trim() || !webhookUrl.includes('discord.com/api/webhooks/')}
          >
            Add Webhook
          </CustomButton>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={handleSnackbarClose}
      />
    </Box>
  );
}

export default WebhookForm;