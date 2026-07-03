import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box } from '@mui/material';
import CustomTextField from '../TextField';
import CustomButton from '../Button';
import DiscordRoleList from '../DiscordRoleList';
import SectionHeader from './SectionHeader';
import { API_BASE_URL } from '../../config';

const RolesSection = ({ notify }) => {
  const [discordRoles, setDiscordRoles] = useState([]);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleId, setNewRoleId] = useState('');

  useEffect(() => {
    axios.get(`${API_BASE_URL}/get_discord_roles/`)
      .then((response) => setDiscordRoles(response.data))
      .catch((error) => console.error('Error fetching Discord roles:', error));
  }, []);

  const addDiscordRole = () => {
    axios.post(`${API_BASE_URL}/set_discord_role/`, {
      role_name: newRoleName,
      role_id: newRoleId,
      is_active: true,
    })
      .then((response) => {
        setDiscordRoles([...discordRoles, response.data]);
        setNewRoleName('');
        setNewRoleId('');
        notify('Discord role added', 'success');
      })
      .catch((error) => {
        console.error('Error adding Discord role:', error);
        notify('Error adding Discord role', 'error');
      });
  };

  const removeDiscordRole = (roleId) => {
    axios.delete(`${API_BASE_URL}/delete_discord_role/${roleId}`)
      .then((response) => {
        if (response.data) {
          setDiscordRoles(discordRoles.filter((role) => role.role_id !== roleId));
          notify('Discord role removed', 'success');
        }
      })
      .catch((error) => {
        console.error('Error removing Discord role:', error);
        notify('Error removing Discord role', 'error');
      });
  };

  const toggleDiscordRoleActive = async (roleId) => {
    const role = discordRoles.find((r) => r.role_id === roleId);
    if (!role) return;

    try {
      const updatedRole = { ...role, is_active: !role.is_active };
      await axios.put(`${API_BASE_URL}/update_discord_role/`, updatedRole);
      setDiscordRoles(discordRoles.map((r) => (r.role_id === roleId ? updatedRole : r)));
      notify('Discord role updated', 'success');
    } catch (error) {
      console.error('Error updating Discord role:', error);
      notify('Error updating Discord role', 'error');
    }
  };

  return (
    <Box>
      <SectionHeader
        title="Discord roles"
        description="Roles mentioned when a message is sent to Discord."
      />
      <Box sx={{ maxWidth: 420 }}>
        <CustomTextField
          type="text"
          label="Role Name"
          value={newRoleName}
          onChange={(e) => setNewRoleName(e.target.value)}
        />
        <CustomTextField
          type="text"
          label="Role ID"
          value={newRoleId}
          onChange={(e) => setNewRoleId(e.target.value)}
        />
        <Box mt={2}>
          <CustomButton onClick={addDiscordRole}>Add role</CustomButton>
        </Box>
      </Box>
      <Box sx={{ mt: 3 }}>
        <DiscordRoleList roles={discordRoles} onRemove={removeDiscordRole} onToggleActive={toggleDiscordRoleActive} />
      </Box>
    </Box>
  );
};

export default RolesSection;
