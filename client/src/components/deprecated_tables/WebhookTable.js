import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Paper, Checkbox, useTheme } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const WebhookTable = ({ webhooks, handleDelete, handleToggleActive }) => {
  const theme = useTheme();
  return (
    <div style={{ width: '100%' }}>
      <TableContainer>
        <Table stickyHeader aria-label="webhooks table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Active</TableCell>
              <TableCell align="center">Channel Name</TableCell>
              <TableCell align="center">Webhook URL</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {webhooks.map((webhook, index) => (
              <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' }, '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell sx={{ textAlign: 'center' }}>
                  <Checkbox
                    checked={webhook.is_active}
                    onChange={() => handleToggleActive(webhook.channel_name)}
                  />
                </TableCell>
                <TableCell component="th" scope="row" sx={{ textAlign: 'center' }}>
                  {webhook.channel_name}
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{webhook.webhook_url}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <IconButton onClick={() => handleDelete(webhook.channel_name)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default WebhookTable;