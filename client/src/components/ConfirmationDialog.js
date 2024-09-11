import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

const ConfirmationDialog = ({ open, onClose, title, content }) => {
  return (
    <Dialog
      open={open}
      onClose={() => onClose(false)}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)} color="primary">
          No
        </Button>
        <Button onClick={() => onClose(true)} color="primary" autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;