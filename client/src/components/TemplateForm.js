import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomButton from './Button';
import CustomSnackbar from './CustomSnackbar';
import ConfirmationDialog from './ConfirmationDialog';

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function TemplateForm() {
  const [templates, setTemplates] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateSubject, setTemplateSubject] = useState('');
  const [templateBody, setTemplateBody] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);

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
      const response = await axios.post(`${REACT_APP_API_BASE_URL}/message_templates/`, {
        name: templateName,
        subject: templateSubject,
        body: templateBody
      });
      setTemplates([...templates, response.data]);
      handleDialogClose();
      setSnackbarMessage('Template saved successfully');
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
      await axios.delete(`${REACT_APP_API_BASE_URL}/message_templates/${templateToDelete.id}`);
      setTemplates(templates.filter(template => template.id !== templateToDelete.id));
      setSnackbarMessage('Template deleted successfully');
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <Box sx={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px', textAlign: 'center', marginBottom: '20px' }}>
        <Typography variant="h4" color="primary" gutterBottom>
          Manage Templates
        </Typography>
      </Box>
      <TableContainer component={Paper} sx={{ width: '75%', margin: '0 auto' }}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: 'black', color: 'white' }}>Name</TableCell>
              <TableCell sx={{ backgroundColor: 'black', color: 'white' }} align="right">Subject</TableCell>
              <TableCell sx={{ backgroundColor: 'black', color: 'white' }} align="right">Body</TableCell>
              <TableCell sx={{ backgroundColor: 'black', color: 'white' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {templates.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((template) => (
              <TableRow key={template.id} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' }, '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {template.name}
                </TableCell>
                <TableCell align="right">{template.subject}</TableCell>
                <TableCell align="right">{template.body}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleDeleteDialogOpen(template)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 20, 50]}
          component="div"
          count={templates.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            backgroundColor: 'black',
            color: 'white',
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows, & .MuiTablePagination-actions': {
              color: 'white',
            },
            '& .MuiSelect-icon': {
              color: 'white',
            },
          }}
        />
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <CustomButton onClick={handleDialogOpen}>Add Template</CustomButton>
      </Box>
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