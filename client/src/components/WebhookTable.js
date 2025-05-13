import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Paper, Checkbox } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const WebhookTable = ({ webhooks, onDelete, onToggleActive }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <TableContainer component={Paper} sx={{ width: '75%', maxWidth: 1920 }}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: '#d3d3d3', color: 'black', textAlign: 'center' }}>Active</TableCell>
              <TableCell sx={{ backgroundColor: '#d3d3d3', color: 'black', textAlign: 'center' }}>Channel Name</TableCell>
              <TableCell sx={{ backgroundColor: '#d3d3d3', color: 'black', textAlign: 'center' }}>Webhook URL</TableCell>
              <TableCell sx={{ backgroundColor: '#d3d3d3', color: 'black', textAlign: 'center' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {webhooks.map((webhook, index) => (
              <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' }, '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell sx={{ textAlign: 'center' }}>
                  <Checkbox
                    checked={webhook.is_active}
                    onChange={() => onToggleActive(webhook.channel_name)}
                  />
                </TableCell>
                <TableCell component="th" scope="row" sx={{ textAlign: 'center' }}>
                  {webhook.channel_name}
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{webhook.webhook_url}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <IconButton onClick={() => onDelete(webhook.channel_name)}>
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