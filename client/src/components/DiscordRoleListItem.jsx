import React from 'react';
import { ListItem, ListItemText, IconButton, Checkbox } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const DiscordRoleListItem = ({ role, onRemove, onToggleActive }) => {
  return (
    <ListItem
      secondaryAction={
        <>
          <Checkbox
            checked={role.is_active}
            onChange={() => onToggleActive(role.role_id)}
          />
          <IconButton edge="end" aria-label="delete" onClick={() => onRemove(role.role_id)}>
            <DeleteIcon />
          </IconButton>
        </>
      }
    >
      <ListItemText
        primary={role.role_name}
        secondary={`ID: ${role.role_id}`}
      />
    </ListItem>
  );
};

export default DiscordRoleListItem;