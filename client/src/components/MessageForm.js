import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomButton from './Button';
import CustomTextField from './TextField';
import CustomMultilineTextField from './CustomMultilineTextField';
import { Typography, Box, Checkbox, FormControlLabel, FormGroup, Card, CardContent, CardActions, Chip, TextField, MenuItem, Tooltip } from '@mui/material';
import CustomSnackbar from './CustomSnackbar';
import ConfirmationDialog from './ConfirmationDialog';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function MessageForm() {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sendEmail, setSendEmail] = useState(true);
  const [sendDiscord, setSendDiscord] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [emailCount, setEmailCount] = useState(0);
  const [discordChannels, setDiscordChannels] = useState([]);
  const [webhooksStatus, setWebhooksStatus] = useState(false);
  const [rolesStatus, setRolesStatus] = useState(false);
  const [emailStatus, setEmailStatus] = useState(false);
  const [emailCredentialStatus, setemailCredentialStatus] = useState(false);
  const [tautulliStatus, setTautulliStatus] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get(`${REACT_APP_API_BASE_URL}/message_templates/`);
        setTemplates(response.data);
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };
  
    fetchTemplates();
  }, []);
  useEffect(() => {
    const fetchConfigData = async () => {
      try {
        const discordResponse = await axios.get(`${REACT_APP_API_BASE_URL}/get_webhooks/`);
        setWebhooksStatus(discordResponse.data.length > 0);
      } catch (error) {
        console.error('Error fetching webhooks:', error);
      }
  
      try {
        const emailCredentialResponse = await axios.get(`${REACT_APP_API_BASE_URL}/get_email_credentials/`);
        setemailCredentialStatus(emailCredentialResponse.data !== null && emailCredentialResponse.data !== undefined);
      } catch (error) {
        console.error('Error fetching email credentials:', error);
        setemailCredentialStatus(false);
      }
  
      try {
        const emailResponse = await axios.get(`${REACT_APP_API_BASE_URL}/get_emails/`);
        setEmailStatus(emailResponse.data.length > 0);
      } catch (error) {
        console.error('Error fetching emails:', error);
      }
  
      try {
        const tautulliResponse = await axios.get(`${REACT_APP_API_BASE_URL}/get_tautulli_credentials/`);
        setTautulliStatus(tautulliResponse.data !== null && tautulliResponse.data !== undefined);
      } catch (error) {
        console.error('Error fetching Tautulli credentials:', error);
        setTautulliStatus(false);
      }
  
      try {
        const rolesResponse = await axios.get(`${REACT_APP_API_BASE_URL}/get_discord_roles/`);
        setRolesStatus(rolesResponse.data.length > 0);
      } catch (error) {
        console.error('Error fetching Discord roles:', error);
      }
    };
  
    fetchConfigData();
  }, []);

  const handleSendMessageClick = async () => {
    if (!subject || !body) {
      setSnackbarMessage('Subject and body cannot be empty');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      if (sendEmail) {
        const emailResponse = await axios.get(`${REACT_APP_API_BASE_URL}/get_emails/`);
        setEmailCount(emailResponse.data.length);
      }

      if (sendDiscord) {
        const discordResponse = await axios.get(`${REACT_APP_API_BASE_URL}/get_webhooks/`);
        setDiscordChannels(discordResponse.data);
      }

      setDialogOpen(true);
    } catch (error) {
      console.error('Error fetching email or discord data:', error);
      setSnackbarMessage('Error fetching email or discord data');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleDialogClose = async (confirmed) => {
    setDialogOpen(false);
    if (confirmed) {
      try {
        let servicesUsed = [];
  
        if (sendEmail) {
          await axios.post(`${REACT_APP_API_BASE_URL}/send_email/`, {
            subject,
            body
          });
          servicesUsed.push(`email(${emailCount})`);
        }

        if (sendDiscord) {
          await axios.post(`${REACT_APP_API_BASE_URL}/send_discord/`, {
            subject,
            body
          });
          servicesUsed.push(`discord(${discordChannels.filter(channel => channel.is_active).length})`);
        }
  
        // Call the endpoint after messages are sent
        await axios.post(`${REACT_APP_API_BASE_URL}/save_sent_message/`, {
          subject,
          body,
          services: servicesUsed.join(', ')
        });

        setSnackbarMessage('Message sent successfully');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Error sending message:', error);
        setSnackbarMessage('Error sending message');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  
  const handleTemplateChange = (event) => {
    const selectedTemplateId = event.target.value;
    setSelectedTemplateId(selectedTemplateId);

    if (selectedTemplateId === '') {
      setSubject('');
      setBody('');
    } else {
      const selectedTemplate = templates.find(template => template.id === parseInt(selectedTemplateId));
      if (selectedTemplate) {
        setSubject(selectedTemplate.subject);
        setBody(selectedTemplate.body);
      }
    }
  };

  const statusItems = [
    { label: 'Email Credentials', ready: emailCredentialStatus, hint: 'SMTP credentials needed to send emails' },
    { label: 'Tautulli Credentials', ready: tautulliStatus, hint: 'Used to import recipients from Tautulli' },
    { label: 'Emails', ready: emailStatus, hint: 'At least one recipient email is on file' },
    { label: 'Discord Webhooks', ready: webhooksStatus, hint: 'At least one webhook is configured' },
    { label: 'Discord Roles', ready: rolesStatus, hint: 'Optional roles to mention in Discord' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', minHeight: 'calc(100vh - 70px)', bgcolor: 'background.default', margin: '0 auto', width: '100%' }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1.5, alignItems: 'center', width: '100%', padding: 2, backgroundColor: 'background.paper', borderRadius: '0 0 16px 16px', boxShadow: '0 4px 16px rgba(26, 39, 51, 0.06)', borderBottom: '1px solid', borderColor: 'divider', marginBottom: 4 }}>
        {statusItems.map(({ label, ready, hint }) => (
          <Tooltip key={label} title={hint} arrow>
            <Chip
              icon={ready ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
              label={label}
              variant={ready ? 'filled' : 'outlined'}
              color={ready ? 'success' : 'default'}
              sx={{ px: 0.5, ...(ready ? {} : { color: 'text.secondary' }) }}
            />
          </Tooltip>
        ))}
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flexGrow: 1, width: '100%', px: 2, pb: 4 }}>
        <Card sx={{ maxWidth: 700, width: '100%', padding: 2 }} >
          <CardContent>
            <Typography variant="h4" color="text.primary" gutterBottom align="center">
              Send Message
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
              Compose a notification to broadcast via email and Discord.
            </Typography>
            <CustomTextField
              type="text"
              label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              fullWidth
              margin="normal"
            />
            <CustomMultilineTextField
              label="Body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Body"
            />
            <FormGroup row sx={{ justifyContent: 'center', marginTop: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={sendEmail}
                    onChange={(e) => setSendEmail(e.target.checked)}
                  />
                }
                label="Send via Email"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={sendDiscord}
                    onChange={(e) => setSendDiscord(e.target.checked)}
                  />
                }
                label="Send via Discord"
              />
            </FormGroup>
            <Box mt={2} sx={{ width: '75%', mx: 'auto' }}>
              <TextField
                select
                fullWidth
                size="small"
                label="Template"
                value={selectedTemplateId}
                onChange={handleTemplateChange}
                helperText="Optionally prefill the subject and body from a saved template."
              >
                <MenuItem value="">No template</MenuItem>
                {templates.map((template) => (
                  <MenuItem key={template.id} value={template.id}>{template.name}</MenuItem>
                ))}
              </TextField>
            </Box>
          </CardContent>
          <CardActions sx={{ justifyContent: 'center' }}>
            <CustomButton onClick={handleSendMessageClick}>Send Message</CustomButton>
          </CardActions>
        </Card>
      </Box>
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={handleSnackbarClose}
      />
      <ConfirmationDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        title="Confirm Send"
        content={
          <>
            <Typography variant="body1">
              Are you sure you want to send this message to {emailCount} email address(s) and the following Discord channels:
            </Typography>
            <ul>
              {discordChannels.filter(channel => channel.is_active).map((channel) => (
                <li key={channel.channel_name}>
                  <Typography variant="body2">{channel.channel_name}</Typography>
                </li>
              ))}
            </ul>
          </>
        }
      />
    </Box>
  );
}

export default MessageForm;