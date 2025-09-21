import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomButton from './Button';
import CustomTextField from './TextField';
import CustomMultilineTextField from './CustomMultilineTextField';
import PageTransition from './PageTransition';
import { Typography, Box, Checkbox, FormControlLabel, FormGroup, Card, CardContent, CardActions } from '@mui/material';
import CustomSnackbar from './CustomSnackbar';
import ConfirmationDialog from './ConfirmationDialog';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';

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
          const emailResponse = await axios.post(`${REACT_APP_API_BASE_URL}/send_email/`, {
            subject,
            body
          });
          console.log('Email sent:', emailResponse.data);
          servicesUsed.push(`email(${emailCount})`);
        }
  
        if (sendDiscord) {
          const discordResponse = await axios.post(`${REACT_APP_API_BASE_URL}/send_discord/`, {
            subject,
            body
          });
          console.log('Discord message sent:', discordResponse.data);
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

  return (
    <PageTransition animationType="fadeInUp">
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        minHeight: 'calc(100vh - 70px)', 
        padding: { xs: 2, md: 4 },
        width: '100%' 
      }}>
      {/* Status Bar */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 3,
        width: '100%', 
        maxWidth: 1200,
        padding: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderRadius: 4,
        border: '1px solid rgba(255, 255, 255, 0.2)',
        marginBottom: 4,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {emailCredentialStatus
            ? <CheckBoxOutlinedIcon sx={{ color: 'primary.main' }} />
            : <CheckBoxOutlineBlankOutlinedIcon sx={{ color: 'text.secondary' }} />}
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Email Credentials
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {tautulliStatus
            ? <CheckBoxOutlinedIcon sx={{ color: 'primary.main' }} />
            : <CheckBoxOutlineBlankOutlinedIcon sx={{ color: 'text.secondary' }} />}
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Tautulli Credentials
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {emailStatus
            ? <CheckBoxOutlinedIcon sx={{ color: 'primary.main' }} />
            : <CheckBoxOutlineBlankOutlinedIcon sx={{ color: 'text.secondary' }} />}
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Emails
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {webhooksStatus
            ? <CheckBoxOutlinedIcon sx={{ color: 'primary.main' }} />
            : <CheckBoxOutlineBlankOutlinedIcon sx={{ color: 'text.secondary' }} />}
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Discord Webhooks
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {rolesStatus
            ? <CheckBoxOutlinedIcon sx={{ color: 'primary.main' }} />
            : <CheckBoxOutlineBlankOutlinedIcon sx={{ color: 'text.secondary' }} />}
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Discord Roles
          </Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        width: '100%',
        maxWidth: 800 
      }}>
        <Card sx={{ 
          width: '100%', 
          padding: 4,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 5,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
        }}>
          <CardContent sx={{ padding: 0 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700,
                marginBottom: 4,
                textAlign: 'center'
              }}
            >
              Send Message
            </Typography>
            
            <CustomTextField
              type="text"
              label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              fullWidth
              margin="normal"
              sx={{ width: '100%', marginBottom: 3 }}
            />
            
            <CustomMultilineTextField
              label="Body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Enter your message body here..."
              minRows={4}
              sx={{ width: '100%', marginBottom: 3 }}
            />
            
            <FormGroup row sx={{ justifyContent: 'center', marginBottom: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sendEmail}
                    onChange={(e) => setSendEmail(e.target.checked)}
                    sx={{
                      color: 'primary.main',
                      '&.Mui-checked': {
                        color: 'primary.main',
                      },
                    }}
                  />
                }
                label="Send via Email"
                sx={{ marginRight: 3 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sendDiscord}
                    onChange={(e) => setSendDiscord(e.target.checked)}
                    sx={{
                      color: 'primary.main',
                      '&.Mui-checked': {
                        color: 'primary.main',
                      },
                    }}
                  />
                }
                label="Send via Discord"
              />
            </FormGroup>
            
            <Box sx={{ marginBottom: 4 }}>
              <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: 600 }}>
                Select a Template
              </Typography>
              <select 
                onChange={handleTemplateChange} 
                value={selectedTemplateId}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '2px solid #e2e8f0',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '16px',
                  fontFamily: 'Inter, sans-serif',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <option value="">No template</option>
                {templates.map(template => (
                  <option key={template.id} value={template.id}>{template.name}</option>
                ))}
              </select>
            </Box>
          </CardContent>
          
          <CardActions sx={{ justifyContent: 'center', paddingTop: 2 }}>
            <CustomButton 
              onClick={handleSendMessageClick}
              size="large"
              sx={{ 
                minWidth: 200,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                }
              }}
            >
              Send Message
            </CustomButton>
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
    </PageTransition>
  );
}

export default MessageForm;