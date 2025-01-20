import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { Typography, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import CustomButton from './Button';
import CustomTextField from './TextField';
import EmailTable from './EmailTable';
import CustomSnackbar from './CustomSnackbar';
import ConfirmationDialog from './ConfirmationDialog';

const REACT_APP_API_BASE_URL = window._env_.REACT_APP_API_BASE_URL || 'http://localhost:8000';

function EmailForm() {
  const [emails, setEmails] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newEmailDialogOpen, setNewEmailDialogOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');

  useEffect(() => {
    // Fetch stored emails from the backend when the component mounts
    axios.get('/get_emails/')
      .then(response => {
        setEmails(response.data);
      })
      .catch(error => {
        console.error('Error fetching stored emails:', error);
      });
  }, []);

  const importEmails = async () => {
    try {
      const response = await axios.post('/import_emails/');
      setEmails(response.data.emails);
      setSnackbarMessage('Emails imported successfully');
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
      const response = await axios.post('/add_email/', { email: newEmail });
      setEmails([...emails, newEmail]);
      setNewEmail('');
      setSnackbarMessage('Email added successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setNewEmailDialogOpen(false);
    } catch (error) {
      console.error('Error adding email:', error);
      if (error.response && error.response.data && error.response.data.detail) {
        // Display specific error message from the API
        setSnackbarMessage(error.response.data.detail);
      } else {
        // Display a generic error message
        setSnackbarMessage('Error adding email');
      }
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const deleteEmail = async (email) => {
    try {
      await axios.delete(`/delete_email/${email}`);
      setEmails(emails.filter(e => e !== email));
      setSnackbarMessage('Email deleted successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error deleting email:', error);
      setSnackbarMessage('Error deleting email');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = (confirmed) => {
    setDialogOpen(false);
    if (confirmed) {
      importEmails();
    }
  };

  const handleNewEmailDialogOpen = () => {
    setNewEmailDialogOpen(true);
  };

  const handleNewEmailDialogClose = () => {
    setNewEmailDialogOpen(false);
  };

  const filteredEmails = emails.filter(email =>
    email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Box sx={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px', textAlign: 'center', marginBottom: '20px' }}>
        <Typography variant="h4" color="primary" gutterBottom>
          Email List
        </Typography>
      </Box>
      <Box sx={{ width: '50%', margin: '0 auto' }}>
        <Box mt={4}>
          <CustomTextField
            label="Search Emails"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ mb: 2 }}
          />
          <EmailTable emails={filteredEmails} onDelete={deleteEmail} />
        </Box>
        <Box mt={4} sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
          <CustomButton variant="contained" onClick={handleDialogOpen} sx={{ width: '300px' }}>
            Import Emails from Tautulli
          </CustomButton>
          <CustomButton variant="contained" onClick={handleNewEmailDialogOpen} sx={{ width: '300px' }}>
            Add New Email
          </CustomButton>
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
          title="Confirm Import"
          content="Are you sure you want to import emails from Tautulli?"
        />
        <Dialog open={newEmailDialogOpen} onClose={handleNewEmailDialogClose} maxWidth="xs" fullWidth>
          <DialogTitle>Add New Email</DialogTitle>
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
            <CustomButton onClick={handleNewEmailDialogClose} color="primary">
              Cancel
            </CustomButton>
            <CustomButton onClick={addEmail} color="primary">
              Add Email
            </CustomButton>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}

export default EmailForm;