import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Paper, Switch, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const WebhookTable = ({ webhooks, onDelete, onToggleActive }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <TableContainer component={Paper} sx={{ width: { xs: '100%', md: '90%' } }}>
        <Table sx={{ minWidth: 700 }} aria-label="Discord webhooks">
          <TableHead>
            <TableRow>
              <TableCell sx={{ textAlign: 'center' }}>Active</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>Channel</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>Webhook URL</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {webhooks.map((webhook, index) => (
              <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' }, '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell sx={{ textAlign: 'center' }}>
                  <Switch
                    checked={webhook.is_active}
                    onChange={() => onToggleActive(webhook.channel_name)}
                    inputProps={{ 'aria-label': `Webhook for ${webhook.channel_name} active` }}
                  />
                </TableCell>
                <TableCell component="th" scope="row" sx={{ textAlign: 'center', fontWeight: 600 }}>
                  {webhook.channel_name}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: 'center',
                    wordBreak: 'break-all',
                    fontFamily: (theme) => theme.typography.fontFamilyMono,
                    fontSize: '0.78rem',
                    color: 'text.secondary',
                  }}
                >
                  {webhook.webhook_url}
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <Tooltip title="Delete webhook">
                    <IconButton onClick={() => onDelete(webhook.channel_name)} aria-label={`Delete webhook for ${webhook.channel_name}`}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
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
