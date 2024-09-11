import React, { useState } from 'react';
import axios from 'axios';
import CustomButton from './Button';
import CustomTextField from './TextField';
import { Typography, Box, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import CustomSnackbar from './CustomSnackbar';

const REACT_APP_API_BASE_URL = window._env_.REACT_APP_API_BASE_URL || 'http://localhost:8000';

function MessageForm() {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sendEmail, setSendEmail] = useState(true);
  const [sendDiscord, setSendDiscord] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const sendMessage = async () => {
    try {
      if (sendEmail) {
        const emailResponse = await axios.post(`${REACT_APP_API_BASE_URL}/send_email/`, {
          subject,
          body
        });
        console.log('Email sent:', emailResponse.data);
      }

      if (sendDiscord) {
        const discordResponse = await axios.post(`${REACT_APP_API_BASE_URL}/send_discord/`, {
          subject,
          body
        });
        console.log('Discord message sent:', discordResponse.data);
      }

      setSnackbarMessage('Message sent successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error sending message:', error);
      setSnackbarMessage('Error sending message');
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
          Send Message
        </Typography>
      </Box>
      <Box sx={{ width: '75%', margin: '0 auto' }}>
        <CustomTextField
          type="text"
          label="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <CustomTextField
          type="text"
          label="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <Box mt={2} display="flex" justifyContent="center">
          <CustomButton onClick={sendMessage}>Send Message</CustomButton>
        </Box>
        <Box mt={2} display="flex" justifyContent="center">
          <FormGroup>
            <FormControlLabel
              control={<Checkbox checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} />}
              label="Send via Email"
            />
            <FormControlLabel
              control={<Checkbox checked={sendDiscord} onChange={(e) => setSendDiscord(e.target.checked)} />}
              label="Send via Discord"
            />
          </FormGroup>
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

export default MessageForm;