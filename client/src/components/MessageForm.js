import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomButton from './Button';
import CustomTextField from './TextField';
import CustomMultilineTextField from './CustomMultilineTextField';
import { 
  Typography, Box, Checkbox, FormControlLabel, FormGroup, Card, CardContent, CardActions, 
  Grid, Divider, FormControl, InputLabel, Select, MenuItem, Chip, Tooltip, 
  useTheme, alpha
} from '@mui/material';
import CustomSnackbar from './CustomSnackbar';
import ConfirmationDialog from './ConfirmationDialog';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import EmailIcon from '@mui/icons-material/Email';
import MessageIcon from '@mui/icons-material/Message';
import TemplateIcon from '@mui/icons-material/Description';

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

  const theme = useTheme();

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

  const handleClearForm = () => {
    setSubject('');
    setBody('');
    setSendEmail(true);
    setSendDiscord(true);
    setSelectedTemplateId('');
  };

  const handleSendMessage = () => {
    handleSendMessageClick();
  };

  const confirmSendMessage = () => {
    handleDialogClose(true);
  };

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', p: 2 }}>
      <Card elevation={3} sx={{
        borderRadius: theme.shape.borderRadius,
        overflow: 'hidden',
        mb: 4,
        border: `1px solid ${theme.palette.grey[200]}`,
      }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{
            backgroundColor: theme.palette.primary.light,
            p: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            borderBottom: `1px solid ${theme.palette.grey[200]}`
          }}>
            <MessageIcon sx={{ color: theme.palette.primary.dark, fontSize: 32 }} />
            <Typography variant="h5" component="h2" sx={{ fontWeight: 600, color: theme.palette.primary.dark }}>
              Send Notification
            </Typography>
          </Box>

          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* Template Selection */}
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="template-select-label">Select a Template</InputLabel>
                  <Select
                    labelId="template-select-label"
                    id="template-select"
                    value={selectedTemplateId}
                    label="Select a Template"
                    onChange={handleTemplateChange}
                    startAdornment={selectedTemplateId && <TemplateIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />}
                  >
                    <MenuItem value="">
                      <em>No template</em>
                    </MenuItem>
                    {templates.map(template => (
                      <MenuItem key={template.id} value={template.id}>{template.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Message Subject */}
              <Grid item xs={12}>
                <CustomTextField
                  id="subject"
                  name="subject"
                  label="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  fullWidth
                  required
                />
              </Grid>

              {/* Message Body */}
              <Grid item xs={12}>
                <CustomMultilineTextField
                  id="body"
                  name="body"
                  label="Message Body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  fullWidth
                  required
                  minRows={8}
                />
              </Grid>

              {/* Send Options */}
              <Grid item xs={12}>
                <Box sx={{ 
                  border: `1px solid ${theme.palette.grey[300]}`,
                  borderRadius: theme.shape.borderRadius,
                  p: 2,
                  backgroundColor: alpha(theme.palette.primary.light, 0.1),
                }}>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                    Send Options
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={sendEmail}
                            onChange={(e) => setSendEmail(e.target.checked)}
                            icon={<CheckBoxOutlineBlankOutlinedIcon />}
                            checkedIcon={<CheckBoxOutlinedIcon />}
                            sx={{
                              color: theme.palette.primary.main,
                              '&.Mui-checked': {
                                color: theme.palette.primary.main,
                              },
                            }}
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EmailIcon fontSize="small" />
                            <Typography>Send Email</Typography>
                          </Box>
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={sendDiscord}
                            onChange={(e) => setSendDiscord(e.target.checked)}
                            icon={<CheckBoxOutlineBlankOutlinedIcon />}
                            checkedIcon={<CheckBoxOutlinedIcon />}
                            sx={{
                              color: theme.palette.primary.main,
                              '&.Mui-checked': {
                                color: theme.palette.primary.main,
                              },
                            }}
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <MessageIcon fontSize="small" />
                            <Typography>Send Discord</Typography>
                          </Box>
                        }
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              {/* Status Section */}
              <Grid item xs={12}>
                <Box sx={{ 
                  border: `1px solid ${theme.palette.grey[300]}`,
                  borderRadius: theme.shape.borderRadius,
                  p: 2,
                  backgroundColor: alpha(theme.palette.info.light, 0.05),
                }}>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                    Configuration Status
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Chip 
                          label="Email Recipients" 
                          size="small" 
                          color={emailStatus ? "success" : "error"} 
                          variant="outlined"
                          sx={{ mr: 1 }} 
                        />
                        <Typography variant="body2">
                          {emailCount > 0 ? `${emailCount} recipients` : 'No recipients'}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Chip 
                          label="Email Credentials" 
                          size="small" 
                          color={emailCredentialStatus ? "success" : "error"} 
                          variant="outlined"
                          sx={{ mr: 1 }} 
                        />
                        <Typography variant="body2">
                          {emailCredentialStatus ? 'Configured' : 'Not configured'}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Chip 
                          label="Discord Webhooks" 
                          size="small" 
                          color={webhooksStatus ? "success" : "error"} 
                          variant="outlined"
                          sx={{ mr: 1 }} 
                        />
                        <Typography variant="body2">
                          {discordChannels.length > 0 ? `${discordChannels.length} channels` : 'No channels'}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Chip 
                          label="Tautulli" 
                          size="small" 
                          color={tautulliStatus ? "success" : "error"} 
                          variant="outlined"
                          sx={{ mr: 1 }} 
                        />
                        <Typography variant="body2">
                          {tautulliStatus ? 'Connected' : 'Not connected'}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        
        <CardActions sx={{ 
          justifyContent: 'flex-end', 
          p: 3, 
          backgroundColor: alpha(theme.palette.background.default, 0.7),
          borderTop: `1px solid ${theme.palette.grey[200]}`
        }}>
          <CustomButton 
            onClick={handleClearForm} 
            color="secondary" 
            variant="outlined" 
            sx={{ mr: 1 }}
          >
            Clear Form
          </CustomButton>
          <CustomButton 
            onClick={handleSendMessage} 
            color="primary"
            disabled={!subject.trim() || !body.trim() || (!sendEmail && !sendDiscord)}
          >
            Send Message
          </CustomButton>
        </CardActions>
      </Card>

      <ConfirmationDialog
        open={dialogOpen}
        title="Send Message"
        content={`Are you sure you want to send this message to ${emailCount} email recipients${discordChannels.length > 0 ? ` and ${discordChannels.length} Discord channels` : ''}?`}
        onConfirm={confirmSendMessage}
        onCancel={() => setDialogOpen(false)}
      />
      
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
      />
    </Box>
  );
}

export default MessageForm;