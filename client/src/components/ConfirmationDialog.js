import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

const ConfirmationDialog = ({ open, onClose, onConfirm, onCancel, title, content }) => {
  // Handle legacy usage with just onClose
  const handleNo = () => {
    if (onCancel) {
      onCancel();
    } else if (onClose) {
      onClose(false);
    }
  };

  const handleYes = () => {
    if (onConfirm) {
      onConfirm();
    } else if (onClose) {
      onClose(true);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleNo}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleNo} color="primary">
          No
        </Button>
        <Button onClick={handleYes} color="primary" autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;