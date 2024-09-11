import React from 'react';
import { List } from '@mui/material';
import WebhookListItem from './WebhookListItem';

function WebhookList({ webhooks }) {
  return (
    <List>
      {webhooks.map((webhook, index) => (
        <WebhookListItem key={index} webhook={webhook} />
      ))}
    </List>
  );
}

export default WebhookList;