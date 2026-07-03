import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box } from '@mui/material';
import CustomTextField from '../TextField';
import CustomButton from '../Button';
import SectionHeader from './SectionHeader';
import { SavedPanel, SavedValue } from './SavedPanel';
import { API_BASE_URL } from '../../config';

const TautulliSection = ({ notify }) => {
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [savedApiKey, setSavedApiKey] = useState('');
  const [savedBaseUrl, setSavedBaseUrl] = useState('');

  useEffect(() => {
    axios.get(`${API_BASE_URL}/get_tautulli_credentials/`)
      .then((response) => {
        setSavedApiKey(response.data.api_key);
        setSavedBaseUrl(response.data.base_url);
      })
      .catch((error) => console.error('Error fetching Tautulli credentials:', error));
  }, []);

  const saveCredentials = () => {
    axios.post(`${API_BASE_URL}/set_tautulli_credentials/`, { api_key: apiKey, base_url: baseUrl })
      .then((response) => {
        setSavedApiKey(response.data.api_key);
        setSavedBaseUrl(response.data.base_url);
        setApiKey('');
        setBaseUrl('');
        notify('Tautulli credentials saved', 'success');
      })
      .catch((error) => {
        console.error('Error saving Tautulli credentials:', error);
        notify('Error saving Tautulli credentials', 'error');
      });
  };

  return (
    <Box>
      <SectionHeader
        title="Tautulli"
        description="Used to import recipient email addresses from your Plex users."
      />
      <Box sx={{ maxWidth: 420 }}>
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
        <Box mt={2}>
          <CustomButton onClick={saveCredentials}>Save credentials</CustomButton>
        </Box>
      </Box>
      <SavedPanel title="Saved credentials">
        <SavedValue label="API Key" value={savedApiKey} />
        <SavedValue label="Base URL" value={savedBaseUrl} />
      </SavedPanel>
    </Box>
  );
};

export default TautulliSection;
