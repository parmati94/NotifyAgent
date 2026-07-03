import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box } from '@mui/material';
import CustomTextField from '../TextField';
import CustomButton from '../Button';
import SectionHeader from './SectionHeader';
import { SavedPanel, SavedValue } from './SavedPanel';
import { API_BASE_URL } from '../../config';

const EmailSection = ({ notify }) => {
  const [emailAddress, setEmailAddress] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [savedEmailAddress, setSavedEmailAddress] = useState('');

  useEffect(() => {
    axios.get(`${API_BASE_URL}/get_email_credentials/`)
      .then((response) => setSavedEmailAddress(response.data.email_address))
      .catch((error) => console.error('Error fetching email credentials:', error));
  }, []);

  const saveEmailCredentials = () => {
    axios.post(`${API_BASE_URL}/set_email_credentials/`, {
      email_address: emailAddress,
      email_password: emailPassword,
    })
      .then((response) => {
        setSavedEmailAddress(response.data.email_address);
        setEmailAddress('');
        setEmailPassword('');
        notify('Email credentials saved', 'success');
      })
      .catch((error) => {
        console.error('Error saving email credentials:', error);
        notify('Error saving email credentials', 'error');
      });
  };

  return (
    <Box>
      <SectionHeader
        title="Email"
        description="SMTP account used to send email notifications."
      />
      <Box sx={{ maxWidth: 420 }}>
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
        <Box mt={2}>
          <CustomButton onClick={saveEmailCredentials}>Save credentials</CustomButton>
        </Box>
      </Box>
      <SavedPanel title="Saved email address">
        <SavedValue label="Email Address" value={savedEmailAddress} />
      </SavedPanel>
    </Box>
  );
};

export default EmailSection;
