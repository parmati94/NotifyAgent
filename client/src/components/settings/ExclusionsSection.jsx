import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box } from '@mui/material';
import CustomTextField from '../TextField';
import CustomButton from '../Button';
import ExclusionList from '../ExclusionList';
import SectionHeader from './SectionHeader';
import { API_BASE_URL } from '../../config';

const ExclusionsSection = ({ notify }) => {
  const [exclusionList, setExclusionList] = useState([]);
  const [newExclusionEmail, setNewExclusionEmail] = useState('');

  useEffect(() => {
    axios.get(`${API_BASE_URL}/get_exclusion_list/`)
      .then((response) => setExclusionList(response.data))
      .catch((error) => console.error('Error fetching exclusion list:', error));
  }, []);

  const addExclusion = () => {
    axios.post(`${API_BASE_URL}/set_exclusion/`, { email: newExclusionEmail })
      .then((response) => {
        setExclusionList([...exclusionList, response.data]);
        setNewExclusionEmail('');
        notify('Email added to exclusion list', 'success');
      })
      .catch((error) => {
        console.error('Error adding email to exclusion list:', error);
        notify('Error adding email to exclusion list', 'error');
      });
  };

  const removeExclusion = (email) => {
    axios.delete(`${API_BASE_URL}/delete_exclusion/${email}`)
      .then((response) => {
        if (response.data) {
          setExclusionList(exclusionList.filter((exclusion) => exclusion.email !== email));
          notify('Email removed from exclusion list', 'success');
        }
      })
      .catch((error) => {
        console.error('Error removing email from exclusion list:', error);
        notify('Error removing email from exclusion list', 'error');
      });
  };

  return (
    <Box>
      <SectionHeader
        title="Exclusions"
        description="Addresses skipped when importing recipients from Tautulli."
      />
      <Box sx={{ maxWidth: 420 }}>
        <CustomTextField
          type="email"
          label="Email to Exclude"
          value={newExclusionEmail}
          onChange={(e) => setNewExclusionEmail(e.target.value)}
        />
        <Box mt={2}>
          <CustomButton onClick={addExclusion}>Add to exclusions</CustomButton>
        </Box>
      </Box>
      <Box sx={{ mt: 3 }}>
        <ExclusionList exclusions={exclusionList} onRemove={removeExclusion} />
      </Box>
    </Box>
  );
};

export default ExclusionsSection;
