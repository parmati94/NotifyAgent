import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PageHeader from './PageHeader';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import DescriptionIcon from '@mui/icons-material/Description';
import CustomButton from './Button';
import CustomSnackbar from './CustomSnackbar';
import ConfirmationDialog from './ConfirmationDialog';
import EmptyState from './EmptyState';

import { API_BASE_URL } from '../config';

function TemplateForm() {
  const [templates, setTemplates] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateSubject, setTemplateSubject] = useState('');
  const [templateBody, setTemplateBody] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/message_templates/`);
        setTemplates(response.data);
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };

    fetchTemplates();
  }, []);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setTemplateName('');
    setTemplateSubject('');
    setTemplateBody('');
  };

  const handleSaveTemplate = async () => {
    if (!templateName || !templateSubject || !templateBody) {
      setSnackbarMessage('All fields are required');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/message_templates/`, {
        name: templateName,
        subject: templateSubject,
        body: templateBody
      });
      setTemplates([...templates, response.data]);
      handleDialogClose();
      setSnackbarMessage('Template saved');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error saving template:', error);
      setSnackbarMessage('Error saving template');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleDeleteTemplate = async () => {
    if (!templateToDelete) return;

    try {
      await axios.delete(`${API_BASE_URL}/message_templates/${templateToDelete.id}`);
      setTemplates(templates.filter(template => template.id !== templateToDelete.id));
      setSnackbarMessage('Template deleted');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setDeleteDialogOpen(false);
      setTemplateToDelete(null);
    } catch (error) {
      console.error('Error deleting template:', error);
      setSnackbarMessage('Error deleting template');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleDeleteDialogOpen = (template) => {
    setTemplateToDelete(template);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = (confirmed) => {
    if (confirmed) {
      handleDeleteTemplate();
    } else {
      setDeleteDialogOpen(false);
      setTemplateToDelete(null);
    }
  };

  const useInCompose = (template) => {
    navigate('/', { state: { templateId: template.id } });
  };

  return (
    <div>
      <PageHeader
        eyebrow="Messages · Saved"
        title="Templates"
        action={<CustomButton onClick={handleDialogOpen}>Add template</CustomButton>}
      />

      {templates.length === 0 ? (
        <EmptyState
          icon={<DescriptionIcon />}
          title="No templates yet"
          description="Save a message you send often, then reuse it from Compose with one click."
          action={<CustomButton onClick={handleDialogOpen}>Add template</CustomButton>}
        />
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 2,
          }}
        >
          {templates.map((template) => (
            <Card key={template.id} sx={{ display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, pb: 0 }}>
                <Typography variant="h6" sx={{ fontSize: '1rem' }} gutterBottom>
                  {template.name}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75 }} noWrap>
                  {template.subject}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {template.body}
                </Typography>
              </CardContent>
              <CardActions sx={{ px: 2, pb: 1.5, justifyContent: 'space-between' }}>
                <Button size="small" startIcon={<SendIcon />} onClick={() => useInCompose(template)}>
                  Use in Compose
                </Button>
                <Tooltip title="Delete template">
                  <IconButton size="small" onClick={() => handleDeleteDialogOpen(template)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Add New Template</DialogTitle>
        <DialogContent>
          <TextField
            label="Template Name"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Subject"
            value={templateSubject}
            onChange={(e) => setTemplateSubject(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Body"
            value={templateBody}
            onChange={(e) => setTemplateBody(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            minRows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveTemplate} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        title="Confirm Delete"
        content={`Are you sure you want to delete the template "${templateToDelete?.name}"?`}
      />
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
      />
    </div>
  );
}

export default TemplateForm;
