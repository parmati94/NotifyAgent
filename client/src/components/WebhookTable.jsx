import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Paper, Switch, Tooltip, Box, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

// Webhook URLs are secrets, so only the tail is shown; the copy button puts
// the full URL on the clipboard.
const maskUrl = (url) => `…${url.slice(-10)}`;

const WebhookTable = ({ webhooks, onDelete, onToggleActive }) => {
  const [copiedUrl, setCopiedUrl] = useState(null);

  const copyUrl = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 1500);
    } catch (error) {
      console.error('Error copying webhook URL:', error);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="Discord webhooks">
        <TableHead>
          <TableRow>
            <TableCell sx={{ textAlign: 'center', width: 90 }}>Active</TableCell>
            <TableCell>Channel</TableCell>
            <TableCell>Webhook URL</TableCell>
            <TableCell sx={{ textAlign: 'center', width: 90 }}>Actions</TableCell>
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
              <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>
                {webhook.channel_name}
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Typography
                    component="span"
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamilyMono,
                      fontSize: '0.78rem',
                      color: 'text.secondary',
                    }}
                  >
                    {maskUrl(webhook.webhook_url)}
                  </Typography>
                  <Tooltip title={copiedUrl === webhook.webhook_url ? 'Copied' : 'Copy full URL'}>
                    <IconButton size="small" onClick={() => copyUrl(webhook.webhook_url)} aria-label={`Copy webhook URL for ${webhook.channel_name}`}>
                      {copiedUrl === webhook.webhook_url ? (
                        <CheckIcon fontSize="inherit" color="success" />
                      ) : (
                        <ContentCopyIcon fontSize="inherit" />
                      )}
                    </IconButton>
                  </Tooltip>
                </Box>
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
  );
};

export default WebhookTable;
