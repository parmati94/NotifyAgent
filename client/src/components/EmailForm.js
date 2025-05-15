import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PageHeader from './PageHeader';
import { 
  Box, Dialog, DialogTitle, DialogContent, DialogActions, Typography,
  Card, CardContent, Grid, Divider, Paper, useTheme, alpha,
  IconButton, Chip
} from '@mui/material';
import CustomButton from './Button';
import CustomTextField from './TextField';
import DataTable from './DataTable';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomSnackbar from './CustomSnackbar';
import ConfirmationDialog from './ConfirmationDialog';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function EmailForm() {
  const [emails, setEmails] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newEmailDialogOpen, setNewEmailDialogOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const theme = useTheme();

  useEffect(() => {
    // Fetch stored emails from the backend when the component mounts
    axios
      .get(`${REACT_APP_API_BASE_URL}/get_emails/`)
      .then((response) => {
        setEmails(response.data);
      })
      .catch((error) => {
        console.error('Error fetching stored emails:', error);
      });
  }, []);

  const importEmails = async () => {
    try {
      const response = await axios.post(`${REACT_APP_API_BASE_URL}/import_emails/`);
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
      await axios.post(`${REACT_APP_API_BASE_URL}/add_email/`, { email: newEmail });
      setEmails([...emails, newEmail]);
      setNewEmail('');
      setSnackbarMessage('Email added successfully');
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
      await axios.delete(`${REACT_APP_API_BASE_URL}/delete_email/${email}`);
      setEmails(emails.filter((e) => e !== email));
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

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 2 }}>
      <PageHeader title="Email Recipients" subtitle="Manage email recipients for notifications" />
      
      <Box sx={{ mb: 4 }}>
        <Card elevation={2} sx={{ 
          borderRadius: theme.shape.borderRadius
        }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{
              p: 3,
              backgroundColor: alpha(theme.palette.primary.light, 0.1),
              borderBottom: `1px solid ${theme.palette.divider}`
            }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
                    Recipient Management
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    You have {emails.length} recipient{emails.length !== 1 ? 's' : ''} configured
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap',
                  gap: 2, 
                  justifyContent: { xs: 'flex-start', sm: 'flex-end' }
                }}>
                  <CustomButton 
                    onClick={() => setNewEmailDialogOpen(true)}
                    color="primary"
                    startIcon={<PersonAddIcon />}
                    variant="outlined"
                    size="medium"
                  >
                    Add Recipient
                  </CustomButton>
                  <CustomButton 
                    onClick={importEmails}
                    color="secondary"
                    startIcon={<CloudUploadIcon />}
                    variant="outlined"
                    size="medium"
                  >
                    Import from Tautulli
                  </CustomButton>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ width: '100%' }}>
              <DataTable
                columns={[
                  {
                    id: 'email',
                    header: 'Email Address',
                    accessor: (row) => row,
                    align: 'left',
                    searchable: true
                  },
                  {
                    id: 'actions',
                    header: 'Actions',
                    accessor: () => null,
                    align: 'right',
                    sortable: false,
                    width: '100px',
                    render: (row) => (
                      <IconButton onClick={() => deleteEmail(row)}>
                        <DeleteIcon />
                      </IconButton>
                    ),
                  },
                ]}
                data={emails}
                enableSearch={true}
                enableSort={true}
                defaultRowsPerPage={10}
                emptyMessage="No email recipients configured"
              />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Add Email Dialog */}
      <Dialog 
        open={newEmailDialogOpen} 
        onClose={() => setNewEmailDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: theme.shape.borderRadius,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          backgroundColor: theme.palette.primary.light,
          color: theme.palette.primary.dark,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonAddIcon />
            <Typography variant="h6">Add New Recipient</Typography>
          </Box>
          <IconButton 
            onClick={() => setNewEmailDialogOpen(false)}
            size="small"
            sx={{ color: theme.palette.primary.dark }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, mt: 2 }}>
          <CustomTextField
            autoFocus
            label="Email Address"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            fullWidth
            variant="outlined"
            placeholder="Enter email address"
          />
        </DialogContent>
        <DialogActions sx={{ 
          p: 3, 
          pt: 2,
          borderTop: `1px solid ${theme.palette.grey[200]}` 
        }}>
          <CustomButton 
            onClick={() => setNewEmailDialogOpen(false)} 
            color="secondary"
            variant="outlined"
          >
            Cancel
          </CustomButton>
          <CustomButton 
            onClick={addEmail} 
            color="primary"
            disabled={!newEmail || !/\S+@\S+\.\S+/.test(newEmail)}
          >
            Add
          </CustomButton>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={dialogOpen}
        title="Delete Email"
        content="Are you sure you want to delete this email recipient?"
        onConfirm={handleDialogClose}
        onCancel={() => setDialogOpen(false)}
      />

      {/* Snackbar for notifications */}
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={handleSnackbarClose}
      />
    </Box>
  );
}

export default EmailForm;