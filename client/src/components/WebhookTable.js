import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const WebhookTable = ({ webhooks, onDelete }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <TableContainer component={Paper} sx={{ width: '75%' }}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: 'black', color: 'white' }}>Channel Name</TableCell>
              <TableCell sx={{ backgroundColor: 'black', color: 'white' }} align="right">Webhook URL</TableCell>
              <TableCell sx={{ backgroundColor: 'black', color: 'white' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {webhooks.map((webhook, index) => (
              <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' }, '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {webhook.channel_name}
                </TableCell>
                <TableCell align="right">{webhook.webhook_url}</TableCell>
                <TableCell align="center">
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