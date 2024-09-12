import React from 'react';
import { List } from '@mui/material';
import DiscordRoleListItem from './DiscordRoleListItem';

const DiscordRoleList = ({ roles, onRemove }) => {
  return (
    <List>
      {roles.map((role) => (
        <DiscordRoleListItem key={role.role_id} role={role} onRemove={onRemove} />
      ))}
    </List>
  );
};

export default DiscordRoleList;