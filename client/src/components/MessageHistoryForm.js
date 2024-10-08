import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Box } from '@mui/material';
import MessageHistoryTable from './MessageHistoryTable';
import CustomButton from './Button';
import ConfirmationDialog from './ConfirmationDialog';

const REACT_APP_API_BASE_URL = window._env_.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const MessageHistory = () => {
  const [messages, setMessages] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch message history when the component mounts
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        console.log('Fetching message history...');
        const response = await axios.get(`${REACT_APP_API_BASE_URL}/get_sent_messages/`);
        console.log('Message history fetched:', response.data);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching message history:', error);
      }
    };

    fetchMessages();
  }, []);

  // Function to clear all messages
  const clearMessages = async () => {
    try {
      console.log('Clearing all messages...');
      await axios.delete(`${REACT_APP_API_BASE_URL}/clear_sent_messages/`);
      setMessages([]); // Clear the messages in the state
      console.log('All messages cleared.');
    } catch (error) {
      console.error('Error clearing messages:', error);
    }
  };

  // Handle dialog close
  const handleDialogClose = (confirmed) => {
    setDialogOpen(false);
    if (confirmed) {
      clearMessages();
    }
  };

  return (
    <div>
      <Box sx={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px', textAlign: 'center', marginBottom: '20px' }}>
        <Typography variant="h4" color="primary" gutterBottom>
          Message History
        </Typography>
      </Box>
      <MessageHistoryTable messages={messages} />
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <CustomButton onClick={() => setDialogOpen(true)}>Clear All Messages</CustomButton>
      </Box>
      <ConfirmationDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        title="Confirm Deletion"
        content="Are you sure you want to delete all message history?"
      />
    </div>
  );
};

export default MessageHistory;