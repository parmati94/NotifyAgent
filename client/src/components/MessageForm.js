import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { keyframes } from '@emotion/react';
import CustomButton from './Button';
import CustomTextField from './TextField';
import CustomMultilineTextField from './CustomMultilineTextField';
import { Typography, Box, Card, CardContent, CardActions, TextField, MenuItem, Tooltip } from '@mui/material';
import CustomSnackbar from './CustomSnackbar';
import ConfirmationDialog from './ConfirmationDialog';
import PageHeader from './PageHeader';
import ChannelCard from './ChannelCard';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import TagIcon from '@mui/icons-material/Tag';

const ripple = keyframes`
  0% { opacity: 0.9; transform: scale(1); }
  100% { opacity: 0; transform: scale(2.1); }
`;

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
  const [justSent, setJustSent] = useState(false);

  useEffect(() => {
    if (!justSent) return undefined;
    const timer = setTimeout(() => setJustSent(false), 950);
    return () => clearTimeout(timer);
  }, [justSent]);

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
        setDiscordChannels(discordResponse.data);
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
        setEmailCount(emailResponse.data.length);
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

        setSnackbarMessage('Message sent');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setJustSent(true);
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

  const activeWebhooks = discordChannels.filter((channel) => channel.is_active).length;
  const emailReady = emailCredentialStatus && emailStatus;
  const discordReady = activeWebhooks > 0;

  const emailStatusLine = !emailCredentialStatus
    ? 'SMTP not configured'
    : emailCount === 0
      ? 'No recipients yet'
      : `SMTP · ${emailCount} recipient${emailCount === 1 ? '' : 's'}`;

  const discordStatusLine = !webhooksStatus
    ? 'No webhooks yet'
    : activeWebhooks === 0
      ? 'All webhooks turned off'
      : `${activeWebhooks} active webhook${activeWebhooks === 1 ? '' : 's'}`;

  const preflightItems = [
    {
      label: tautulliStatus ? 'Tautulli connected' : 'Tautulli not connected',
      ready: tautulliStatus,
      hint: 'Tautulli is used to import email recipients from Plex.',
    },
    {
      label: rolesStatus ? 'Role mentions on' : 'No role mentions',
      ready: rolesStatus,
      hint: 'Discord roles to mention when a message is sent.',
    },
  ];

  return (
    <Box sx={{ width: '100%', maxWidth: 760, mx: 'auto' }}>
      <PageHeader
        eyebrow="Broadcast"
        title="Compose"
        subtitle="Send one message to every channel you select."
        action={
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', pb: 0.5 }}>
            {preflightItems.map(({ label, ready, hint }) => (
              <Tooltip key={label} title={hint} arrow>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Box
                    sx={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      bgcolor: ready ? 'success.main' : 'action.disabled',
                    }}
                  />
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamilyMono,
                      fontSize: '0.68rem',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: 'text.secondary',
                    }}
                  >
                    {label}
                  </Typography>
                </Box>
              </Tooltip>
            ))}
          </Box>
        }
      />
      <Card>
        <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
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
          <CustomTextField
            type="text"
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <CustomMultilineTextField
            label="Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write the announcement…"
          />
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamilyMono,
              fontSize: '0.68rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'text.secondary',
              mt: 2.5,
              mb: 1,
            }}
          >
            Channels
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <ChannelCard
              icon={<EmailOutlinedIcon />}
              name="Email"
              statusLine={emailStatusLine}
              ready={emailReady}
              selected={sendEmail}
              onToggle={() => setSendEmail((prev) => !prev)}
            />
            <ChannelCard
              icon={<TagIcon />}
              name="Discord"
              statusLine={discordStatusLine}
              ready={discordReady}
              selected={sendDiscord}
              onToggle={() => setSendDiscord((prev) => !prev)}
            />
          </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end', px: { xs: 2.5, md: 3.5 }, pb: 3, pt: 0 }}>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            {justSent && (
              <Box
                aria-hidden
                sx={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '10px',
                  border: '2px solid',
                  borderColor: 'signal.main',
                  opacity: 0,
                  pointerEvents: 'none',
                  '@media (prefers-reduced-motion: no-preference)': {
                    animation: `${ripple} 0.9s ease-out`,
                  },
                }}
              />
            )}
            <CustomButton onClick={handleSendMessageClick}>Send message</CustomButton>
          </Box>
        </CardActions>
      </Card>
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={handleSnackbarClose}
      />
      <ConfirmationDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        title="Send this message?"
        content={
          <>
            {sendEmail && (
              <Typography variant="body1" sx={{ mb: sendDiscord ? 1 : 0 }}>
                Email: {emailCount} recipient{emailCount === 1 ? '' : 's'}
              </Typography>
            )}
            {sendDiscord && (
              <>
                <Typography variant="body1">
                  Discord channels:
                </Typography>
                <ul style={{ marginTop: 4 }}>
                  {discordChannels.filter(channel => channel.is_active).map((channel) => (
                    <li key={channel.channel_name}>
                      <Typography variant="body2">{channel.channel_name}</Typography>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </>
        }
      />
    </Box>
  );
}

export default MessageForm;