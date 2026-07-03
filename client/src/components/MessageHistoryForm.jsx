import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import PageHeader from './PageHeader';
import MessageLog from './MessageLog';
import EmptyState from './EmptyState';
import ConfirmationDialog from './ConfirmationDialog';

import { API_BASE_URL } from '../config';

const MessageHistory = () => {
  const [messages, setMessages] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch message history when the component mounts
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/get_sent_messages/`);
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
      await axios.delete(`${API_BASE_URL}/clear_sent_messages/`);
      setMessages([]); // Clear the messages in the state
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
      <PageHeader
        eyebrow="Messages · Sent"
        title="History"
        action={
          messages.length > 0 && (
            <Button variant="outlined" color="error" onClick={() => setDialogOpen(true)}>
              Clear history
            </Button>
          )
        }
      />
      {messages.length === 0 ? (
        <EmptyState
          icon={<HistoryIcon />}
          title="Nothing sent yet"
          description="Messages you broadcast show up here, with the channels they went to."
        />
      ) : (
        <MessageLog messages={messages} />
      )}
      <ConfirmationDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        title="Clear history?"
        content="This deletes every entry in the sent-message history. It cannot be undone."
      />
    </div>
  );
};

export default MessageHistory;
