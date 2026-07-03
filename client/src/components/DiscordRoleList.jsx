import React from 'react';
import { List } from '@mui/material';
import DiscordRoleListItem from './DiscordRoleListItem';

const DiscordRoleList = ({ roles, onRemove, onToggleActive }) => {
  return (
    <List>
      {roles.map((role) => (
        <DiscordRoleListItem
          key={role.role_id}
          role={role}
          onRemove={onRemove}
          onToggleActive={onToggleActive}
        />
      ))}
    </List>
  );
};

export default DiscordRoleList;