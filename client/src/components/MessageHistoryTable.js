import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Tooltip } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';

const REACT_APP_API_BASE_URL = window._env_.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const MessageHistoryTable = ({ messages }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle dialog open
  const handleDialogOpen = (message) => {
    setSelectedMessage(message);
    setDialogOpen(true);
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setDialogOpen(false);
    setTemplateName('');
    setSelectedMessage(null);
  };

  // Handle save template
  const handleSaveTemplate = async () => {
    if (!templateName || !selectedMessage) return;

    try {
      await axios.post(`${REACT_APP_API_BASE_URL}/message_templates/`, {
        name: templateName,
        subject: selectedMessage.subject,
        body: selectedMessage.body
      });
      handleDialogClose();
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  // Sort messages by timestamp in descending order
  const sortedMessages = [...messages].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <TableContainer component={Paper} sx={{ width: '75%' }}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: 'black', color: 'white' }}>Subject</TableCell>
              <TableCell sx={{ backgroundColor: 'black', color: 'white' }} align="right">Body</TableCell>
              <TableCell sx={{ backgroundColor: 'black', color: 'white' }} align="right">Services Used</TableCell>
              <TableCell sx={{ backgroundColor: 'black', color: 'white' }} align="right">Time</TableCell>
              <TableCell sx={{ backgroundColor: 'black', color: 'white' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedMessages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No message history available.
                </TableCell>
              </TableRow>
            ) : (
              sortedMessages.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((message, index) => (
                <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' }, '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {message.subject}
                  </TableCell>
                  <TableCell align="right">{message.body}</TableCell>
                  <TableCell align="right">{message.services}</TableCell>
                  <TableCell align="right">
                    {new Date(message.timestamp.replace(' ', 'T') + 'Z').toLocaleString()}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Save as Template" placement="right" PopperProps={{ modifiers: [{ name: 'offset', options: { offset: [0, 10] } }] }}>
                      <IconButton onClick={() => handleDialogOpen(message)}>
                        <SaveIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 20, 50]}
          component="div"
          count={sortedMessages.length}
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
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Save Template</DialogTitle>
        <DialogContent>
          <TextField
            label="Template Name"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            fullWidth
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
    </div>
  );
};

export default MessageHistoryTable;