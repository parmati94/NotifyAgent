import React from 'react';
import { List } from '@mui/material';
import ExclusionListItem from './ExclusionListItem';

const ExclusionList = ({ exclusions, onRemove }) => {
  return (
    <List>
      {exclusions.map((exclusion) => (
        <ExclusionListItem key={exclusion.id} exclusion={exclusion} onRemove={onRemove} />
      ))}
    </List>
  );
};

export default ExclusionList;