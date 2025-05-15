import React, { useState, useEffect } from 'react';
import PageHeader from './PageHeader';
import CustomButton from './Button';
import CustomTextField from './TextField';
import axios from 'axios';
import { 
  Typography, Box, Tooltip, IconButton, Card, CardContent,
  Grid, Divider, Paper, useTheme, alpha, Accordion, AccordionSummary,
  AccordionDetails, Chip, Stack
} from '@mui/material';
import ExclusionList from './ExclusionList';
import CustomSnackbar from './CustomSnackbar';
import DiscordRoleList from './DiscordRoleList';
import InfoIcon from '@mui/icons-material/Info';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EmailIcon from '@mui/icons-material/Email';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function ConfigurationForm() {
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [savedApiKey, setSavedApiKey] = useState('');
  const [savedBaseUrl, setSavedBaseUrl] = useState('');
  const [exclusionList, setExclusionList] = useState([]);
  const [newExclusionEmail, setNewExclusionEmail] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [savedEmailAddress, setSavedEmailAddress] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Discord state variables
  const [discordRoles, setDiscordRoles] = useState([]);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleId, setNewRoleId] = useState('');

  const theme = useTheme();

  useEffect(() => {
    // Fetch saved Tautulli credentials from the backend when the component mounts
    axios.get(`${REACT_APP_API_BASE_URL}/get_tautulli_credentials/`)
      .then(response => {
        const { api_key, base_url } = response.data;
        setSavedApiKey(api_key);
        setSavedBaseUrl(base_url);
      })
      .catch(error => {
        console.error('Error fetching Tautulli credentials:', error);
      });

    // Fetch exclusion list from the backend when the component mounts
    axios.get(`${REACT_APP_API_BASE_URL}/get_exclusion_list/`)
      .then(response => {
        setExclusionList(response.data);
      })
      .catch(error => {
        console.error('Error fetching exclusion list:', error);
      });

    // Fetch saved email credentials from the backend when the component mounts
    axios.get(`${REACT_APP_API_BASE_URL}/get_email_credentials/`)
      .then(response => {
        const { email_address } = response.data;
        setSavedEmailAddress(email_address);
      })
      .catch(error => {
        console.error('Error fetching email credentials:', error);
      });

    // Fetch Discord roles from the backend when the component mounts
    axios.get(`${REACT_APP_API_BASE_URL}/get_discord_roles/`)
      .then(response => {
        setDiscordRoles(response.data);
      })
      .catch(error => {
        console.error('Error fetching Discord roles:', error);
      });
  }, []);

  const saveCredentials = () => {
    const credentials = {
      api_key: apiKey,
      base_url: baseUrl
    };

    axios.post(`${REACT_APP_API_BASE_URL}/set_tautulli_credentials/`, credentials)
      .then(response => {
        const { api_key, base_url } = response.data;
        setSavedApiKey(api_key);
        setSavedBaseUrl(base_url);
        setApiKey('');
        setBaseUrl('');
        setSnackbarMessage('Tautulli credentials saved successfully');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      })
      .catch(error => {
        console.error('Error saving Tautulli credentials:', error);
        setSnackbarMessage('Error saving Tautulli credentials');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
  };

  const saveEmailCredentials = () => {
    const credentials = {
      email_address: emailAddress,
      email_password: emailPassword
    };

    axios.post(`${REACT_APP_API_BASE_URL}/set_email_credentials/`, credentials)
      .then(response => {
        const { email_address } = response.data;
        setSavedEmailAddress(email_address);
        setEmailAddress('');
        setEmailPassword('');
        setSnackbarMessage('Email credentials saved successfully');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      })
      .catch(error => {
        console.error('Error saving email credentials:', error);
        setSnackbarMessage('Error saving email credentials');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
  };

  const addExclusion = () => {
    axios.post(`${REACT_APP_API_BASE_URL}/set_exclusion/`, { email: newExclusionEmail })
      .then(response => {
        setExclusionList([...exclusionList, response.data]);
        setNewExclusionEmail('');
        setSnackbarMessage('Email added to exclusion list successfully');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      })
      .catch(error => {
        console.error('Error adding email to exclusion list:', error);
        setSnackbarMessage('Error adding email to exclusion list');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
  };

  const removeExclusion = (email) => {
    axios.delete(`${REACT_APP_API_BASE_URL}/delete_exclusion/${email}`)
      .then(response => {
        if (response.data) {
          setExclusionList(exclusionList.filter(exclusion => exclusion.email !== email));
          setSnackbarMessage('Email removed from exclusion list successfully');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
        }
      })
      .catch(error => {
        console.error('Error removing email from exclusion list:', error);
        setSnackbarMessage('Error removing email from exclusion list');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
  };

  const addDiscordRole = () => {
    const role = {
      role_name: newRoleName,
      role_id: newRoleId,
      is_active: true // Default to active when adding a new role
    };

    axios.post(`${REACT_APP_API_BASE_URL}/set_discord_role/`, role)
      .then(response => {
        setDiscordRoles([...discordRoles, response.data]);
        setNewRoleName('');
        setNewRoleId('');
        setSnackbarMessage('Discord role added successfully');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      })
      .catch(error => {
        console.error('Error adding Discord role:', error);
        setSnackbarMessage('Error adding Discord role');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
  };

  const removeDiscordRole = (roleId) => {
    axios.delete(`${REACT_APP_API_BASE_URL}/delete_discord_role/${roleId}`)
      .then(response => {
        if (response.data) {
          setDiscordRoles(discordRoles.filter(role => role.role_id !== roleId));
          setSnackbarMessage('Discord role removed successfully');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
        }
      })
      .catch(error => {
        console.error('Error removing Discord role:', error);
        setSnackbarMessage('Error removing Discord role');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
  };

  const toggleDiscordRoleActive = async (roleId) => {
    const role = discordRoles.find(r => r.role_id === roleId);
    if (!role) return;

    try {
      const updatedRole = { ...role, is_active: !role.is_active };
      await axios.put(`${REACT_APP_API_BASE_URL}/update_discord_role/`, updatedRole);
      setDiscordRoles(discordRoles.map(r => (r.role_id === roleId ? updatedRole : r)));
      setSnackbarMessage('Discord role updated successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error updating Discord role:', error);
      setSnackbarMessage('Error updating Discord role');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 2 }}>
      <PageHeader title="Configuration" subtitle="Configure notification settings and integrations" />

      <Grid container spacing={3}>
        {/* Tautulli Configuration */}
        <Grid item xs={12}>
          <Accordion 
            defaultExpanded 
            elevation={2}
            sx={{ 
              borderRadius: theme.shape.borderRadius, 
              mb: 0,
              '&:before': {
                display: 'none',
              },
              '&.Mui-expanded': {
                margin: 0,
              }
            }}
          >
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon />}
              sx={{ 
                backgroundColor: alpha(theme.palette.primary.light, 0.1),
                borderTopLeftRadius: theme.shape.borderRadius,
                borderTopRightRadius: theme.shape.borderRadius
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AutoAwesomeIcon color="primary" />
                <Box>
                  <Typography variant="h6">Tautulli Integration</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Configure connection to Tautulli for user imports
                  </Typography>
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <Chip 
                      label={savedApiKey ? "Connected" : "Not Connected"} 
                      color={savedApiKey ? "success" : "error"} 
                      size="small"
                      variant="outlined"
                    />
                    <Typography variant="body2" color="text.secondary">
                      {savedApiKey 
                        ? `Connected to Tautulli at ${savedBaseUrl}` 
                        : "No Tautulli connection configured"}
                    </Typography>
                  </Stack>
                </Grid>

                <Grid item xs={12} md={6}>
                  <CustomTextField
                    label="Tautulli API Key"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    fullWidth
                    required
                    placeholder="Enter your Tautulli API key"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <CustomTextField
                    label="Tautulli Base URL"
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    fullWidth
                    required
                    placeholder="http://your-tautulli-server:8181"
                    InputProps={{
                      endAdornment: (
                        <Tooltip title="Enter the base URL of your Tautulli installation, e.g. http://localhost:8181">
                          <IconButton size="small">
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <CustomButton
                    onClick={saveCredentials}
                    color="primary"
                    sx={{ mt: 1 }}
                  >
                    Save Tautulli Settings
                  </CustomButton>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Email Settings */}
        <Grid item xs={12}>
          <Accordion 
            elevation={2}
            sx={{ 
              borderRadius: theme.shape.borderRadius, 
              mb: 0,
              '&:before': {
                display: 'none',
              },
              '&.Mui-expanded': {
                margin: 0,
              }
            }}
          >
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon />}
              sx={{ 
                backgroundColor: alpha(theme.palette.primary.light, 0.1),
                borderTopLeftRadius: theme.shape.borderRadius,
                borderTopRightRadius: theme.shape.borderRadius
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <EmailIcon color="primary" />
                <Box>
                  <Typography variant="h6">Email Settings</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Configure email server credentials for sending notifications
                  </Typography>
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <Chip 
                      label={savedEmailAddress ? "Configured" : "Not Configured"} 
                      color={savedEmailAddress ? "success" : "error"} 
                      size="small"
                      variant="outlined"
                    />
                    <Typography variant="body2" color="text.secondary">
                      {savedEmailAddress 
                        ? `Email sender configured as ${savedEmailAddress}` 
                        : "No email sender configured"}
                    </Typography>
                  </Stack>
                </Grid>

                <Grid item xs={12} md={6}>
                  <CustomTextField
                    label="Email Address"
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    fullWidth
                    required
                    placeholder="notifications@yourdomain.com"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <CustomTextField
                    label="Email Password"
                    type="password"
                    value={emailPassword}
                    onChange={(e) => setEmailPassword(e.target.value)}
                    fullWidth
                    required
                    placeholder="Enter email password or app password"
                    InputProps={{
                      endAdornment: (
                        <Tooltip title="For Gmail, you'll need to use an App Password">
                          <IconButton size="small">
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <CustomButton
                    onClick={saveEmailCredentials}
                    color="primary"
                    sx={{ mt: 1 }}
                  >
                    Save Email Settings
                  </CustomButton>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Exclusion List */}
        <Grid item xs={12}>
          <Accordion 
            elevation={2}
            sx={{ 
              borderRadius: theme.shape.borderRadius, 
              mb: 0,
              '&:before': {
                display: 'none',
              },
              '&.Mui-expanded': {
                margin: 0,
              }
            }}
          >
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon />}
              sx={{ 
                backgroundColor: alpha(theme.palette.primary.light, 0.1),
                borderTopLeftRadius: theme.shape.borderRadius,
                borderTopRightRadius: theme.shape.borderRadius
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <PersonOffIcon color="primary" />
                <Box>
                  <Typography variant="h6">Exclusion List</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manage users excluded from notifications
                  </Typography>
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', mb: 3 }}>
                    <CustomTextField
                      label="Email to Exclude"
                      value={newExclusionEmail}
                      onChange={(e) => setNewExclusionEmail(e.target.value)}
                      placeholder="user@example.com"
                      sx={{ mr: 2, flexGrow: 1 }}
                    />
                    <CustomButton
                      onClick={addExclusion}
                      color="primary"
                      disabled={!newExclusionEmail}
                      sx={{ mt: { xs: 2, sm: 0 } }}
                    >
                      Add to Exclusion List
                    </CustomButton>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      borderRadius: theme.shape.borderRadius,
                      minHeight: '150px',
                      backgroundColor: alpha(theme.palette.background.paper, 0.6),
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                      Excluded Recipients ({exclusionList.length})
                    </Typography>
                    <ExclusionList
                      exclusions={exclusionList}
                      onRemove={removeExclusion}
                    />
                  </Paper>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Discord Roles */}
        <Grid item xs={12}>
          <Accordion 
            elevation={2}
            sx={{ 
              borderRadius: theme.shape.borderRadius, 
              mb: 0,
              '&:before': {
                display: 'none',
              },
              '&.Mui-expanded': {
                margin: 0,
              }
            }}
          >
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon />}
              sx={{ 
                backgroundColor: alpha(theme.palette.primary.light, 0.1),
                borderTopLeftRadius: theme.shape.borderRadius,
                borderTopRightRadius: theme.shape.borderRadius
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <SettingsIcon color="primary" />
                <Box>
                  <Typography variant="h6">Discord Roles</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Configure Discord roles for notifications
                  </Typography>
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <CustomTextField
                    label="Role Name"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    fullWidth
                    placeholder="e.g., Plex Users"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <CustomTextField
                    label="Role ID"
                    value={newRoleId}
                    onChange={(e) => setNewRoleId(e.target.value)}
                    fullWidth
                    placeholder="Discord role ID (e.g., 123456789012345678)"
                    InputProps={{
                      endAdornment: (
                        <Tooltip title="Enable Developer Mode in Discord, right-click the role and select 'Copy ID'">
                          <IconButton size="small">
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <CustomButton
                    onClick={addDiscordRole}
                    color="primary"
                    disabled={!newRoleName || !newRoleId}
                    sx={{ mb: 3 }}
                  >
                    Add Discord Role
                  </CustomButton>
                </Grid>
                
                <Grid item xs={12}>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      borderRadius: theme.shape.borderRadius,
                      minHeight: '150px',
                      backgroundColor: alpha(theme.palette.background.paper, 0.6),
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                      Configured Roles ({discordRoles.length})
                    </Typography>
                    <DiscordRoleList
                      roles={discordRoles}
                      onRemove={removeDiscordRole}
                      onToggleActive={toggleDiscordRoleActive}
                    />
                  </Paper>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>

      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={handleSnackbarClose}
      />
    </Box>
  );
}

export default ConfigurationForm;