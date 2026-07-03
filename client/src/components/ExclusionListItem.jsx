import React from 'react';
import { ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const ExclusionListItem = ({ exclusion, onRemove }) => {
  return (
    <ListItem secondaryAction={
      <IconButton edge="end" aria-label="delete" onClick={() => onRemove(exclusion.email)}>
        <DeleteIcon />
      </IconButton>
    }>
      <ListItemText primary={exclusion.email} />
    </ListItem>
  );
};

export default ExclusionListItem;