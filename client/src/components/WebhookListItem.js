import React from 'react';
import { ListItem, ListItemText } from '@mui/material';

function WebhookListItem({ webhook }) {
  return (
    <ListItem>
      <ListItemText
        primary={`Channel: ${webhook.channel_name}`}
        secondary={`URL: ${webhook.webhook_url}`}
      />
    </ListItem>
  );
}

export default WebhookListItem;