import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import PageHeader from './PageHeader';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  TextField,
  Typography,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import CustomButton from './Button';
import CustomTextField from './TextField';
import CustomSnackbar from './CustomSnackbar';
import ConfirmationDialog from './ConfirmationDialog';
import EmptyState from './EmptyState';

import { API_BASE_URL } from '../config';

function EmailForm() {
  const [emails, setEmails] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newEmailDialogOpen, setNewEmailDialogOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const { openSettings } = useOutletContext() || {};

  useEffect(() => {
    // Fetch stored emails from the backend when the component mounts
    axios
      .get(`${API_BASE_URL}/get_emails/`)
      .then((response) => {
        setEmails(response.data);
      })
      .catch((error) => {
        console.error('Error fetching stored emails:', error);
      });
  }, []);

  const importEmails = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/import_emails/`);
      setEmails(response.data.emails);
      setSnackbarMessage('Emails imported from Tautulli');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error importing emails:', error);
      setSnackbarMessage('Error importing emails');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const addEmail = async () => {
    try {
      await axios.post(`${API_BASE_URL}/add_email/`, { email: newEmail });
      setEmails([...emails, newEmail]);
      setNewEmail('');
      setSnackbarMessage('Email added');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setNewEmailDialogOpen(false);
    } catch (error) {
      console.error('Error adding email:', error);
      setSnackbarMessage('Error adding email');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const deleteEmail = async (email) => {
    try {
      await axios.delete(`${API_BASE_URL}/delete_email/${email}`);
      setEmails(emails.filter((e) => e !== email));
      setSnackbarMessage('Email removed');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error deleting email:', error);
      setSnackbarMessage('Error removing email');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleDialogClose = (confirmed) => {
    setDialogOpen(false);
    if (confirmed) {
      importEmails();
    }
  };

  const filteredEmails = emails
    .filter((email) => email.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.localeCompare(b));

  return (
    <div>
      <PageHeader
        eyebrow="Channel · Email"
        title="Recipients"
        action={
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Button variant="outlined" onClick={() => setDialogOpen(true)}>
              Import from Tautulli
            </Button>
            <CustomButton onClick={() => setNewEmailDialogOpen(true)}>Add email</CustomButton>
          </Box>
        }
      />

      {emails.length === 0 ? (
        <EmptyState
          icon={<AlternateEmailIcon />}
          title="No recipients yet"
          description="Import your Plex users' addresses from Tautulli, or add one manually."
          action={
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button variant="outlined" onClick={() => setDialogOpen(true)}>
                Import from Tautulli
              </Button>
              <CustomButton onClick={() => setNewEmailDialogOpen(true)}>Add email</CustomButton>
            </Box>
          }
        />
      ) : (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamilyMono,
                fontSize: '0.74rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'text.secondary',
              }}
            >
              {emails.length} recipient{emails.length === 1 ? '' : 's'}
              {searchQuery && ` · ${filteredEmails.length} shown`}
            </Typography>
            <TextField
              size="small"
              placeholder="Search emails"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ width: { xs: '100%', sm: 240 }, ml: { sm: 'auto' } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            {openSettings && (
              <Button size="small" onClick={openSettings} sx={{ color: 'text.secondary' }}>
                Manage exclusions
              </Button>
            )}
          </Box>

          <Paper sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 2 }}>
            {filteredEmails.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ p: 1 }}>
                No recipients match “{searchQuery}”.
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {filteredEmails.map((email) => (
                  <Chip
                    key={email}
                    label={email}
                    onDelete={() => deleteEmail(email)}
                    variant="outlined"
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamilyMono,
                      fontSize: '0.76rem',
                      fontWeight: 400,
                    }}
                  />
                ))}
              </Box>
            )}
          </Paper>
        </>
      )}

      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={handleSnackbarClose}
      />
      <ConfirmationDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        title="Import from Tautulli?"
        content="This fetches your Plex users' email addresses from Tautulli and adds them to the recipient list."
      />
      <Dialog open={newEmailDialogOpen} onClose={() => setNewEmailDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Add email</DialogTitle>
        <DialogContent>
          <CustomTextField
            type="email"
            label="Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <CustomButton onClick={() => setNewEmailDialogOpen(false)} color="primary">
            Cancel
          </CustomButton>
          <CustomButton onClick={addEmail} color="primary">
            Add email
          </CustomButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default EmailForm;
