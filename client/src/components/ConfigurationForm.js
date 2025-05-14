import React, { useState, useEffect } from 'react';
import PageHeader from './PageHeader';
import CustomButton from './Button';
import CustomTextField from './TextField';
import axios from 'axios';
import { Typography, Box, Tooltip, IconButton } from '@mui/material';
import ExclusionList from './ExclusionList';
import CollapsibleSection from './CollapsibleSection';
import CustomSnackbar from './CustomSnackbar';
import DiscordRoleList from './DiscordRoleList';
import InfoIcon from '@mui/icons-material/Info';

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
    <div className="main-content" style={{ textAlign: 'center'}}>
      <PageHeader title="Configuration" />
      <CollapsibleSection className="collapsible-section" title={
        <Box display="flex" alignItems="center">
          Add Email Credentials
          <Tooltip title="Configure email credentials for email notifications" placement="right">
            <IconButton size="small" sx={{ ml: 1 }}>
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      }>
        <CustomTextField
          type="email"
          label="Email Address"
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
        />
        <CustomTextField
          type="password"
          label="App Password"
          value={emailPassword}
          onChange={(e) => setEmailPassword(e.target.value)}
        />
        <Box mt={2} display="flex" justifyContent="center">
          <CustomButton onClick={saveEmailCredentials}>Save Email Credentials</CustomButton>
        </Box>
        <Box mt={4}>
          <Typography variant="h5" gutterBottom align="center">
            Saved Email Address
          </Typography>
          <p><strong>Email Address:</strong> {savedEmailAddress}</p>
        </Box>
      </CollapsibleSection>
      <CollapsibleSection className="collapsible-section" title={
        <Box display="flex" alignItems="center">
          Add Tautulli Credentials
          <Tooltip title="Configure Tautulli for importing email addresses of plex users" placement="right">
            <IconButton size="small" sx={{ ml: 1 }}>
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      }>
        <CustomTextField
          type="text"
          label="Tautulli API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <CustomTextField
          type="text"
          label="Tautulli Base URL"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
        />
        <Box mt={2} display="flex" justifyContent="center">
          <CustomButton onClick={saveCredentials}>Save Credentials</CustomButton>
        </Box>
        <Box mt={4}>
          <Typography variant="h5" gutterBottom align="center">
            Saved Credentials
          </Typography>
          <p><strong>API Key:</strong> {savedApiKey}</p>
          <p><strong>Base URL:</strong> {savedBaseUrl}</p>
        </Box>
      </CollapsibleSection>
      <CollapsibleSection className="collapsible-section" title={
        <Box display="flex" alignItems="center">
          Exclusion List
          <Tooltip title="List of emails to exclude when importing email address list from Tautulli" placement="right">
            <IconButton size="small" sx={{ ml: 1 }}>
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      }>
        <CustomTextField
          type="email"
          label="Email to Exclude"
          value={newExclusionEmail}
          onChange={(e) => setNewExclusionEmail(e.target.value)}
        />
        <Box mt={2} display="flex" justifyContent="center">
          <CustomButton onClick={addExclusion}>Add to Exclusion List</CustomButton>
        </Box>
        <ExclusionList exclusions={exclusionList} onRemove={removeExclusion} />
      </CollapsibleSection>
      <CollapsibleSection className="collapsible-section" title={
        <Box display="flex" alignItems="center">
          Discord Roles
          <Tooltip title="Configure discord roles to be tagged when sending discord notifications" placement="right">
            <IconButton size="small" sx={{ ml: 1 }}>
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      }>
        <CustomTextField
          type="text"
          label="Role Name"
          value={newRoleName}
          onChange={(e) => setNewRoleName(e.target.value)}
        />
        <CustomTextField
          type="text"
          label="Role ID"
          value={newRoleId}
          onChange={(e) => setNewRoleId(e.target.value)}
        />
        <Box mt={2} display="flex" justifyContent="center">
          <CustomButton onClick={addDiscordRole}>Add Discord Role</CustomButton>
        </Box>
        <DiscordRoleList roles={discordRoles} onRemove={removeDiscordRole} onToggleActive={toggleDiscordRoleActive} />
      </CollapsibleSection>
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={handleSnackbarClose}
      />
    </div>
  );
}

export default ConfigurationForm;