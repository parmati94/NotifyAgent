import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import CustomTextField from '../TextField';
import CustomButton from '../Button';
import ConfirmationDialog from '../ConfirmationDialog';
import SectionHeader from './SectionHeader';
import { API_BASE_URL } from '../../config';

const UsersSection = ({ notify }) => {
  const [users, setUsers] = useState([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/users/`)
      .then((response) => setUsers(response.data))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  const addUser = () => {
    if (newPassword !== confirmPassword) {
      notify('Passwords do not match', 'error');
      return;
    }

    axios.post(`${API_BASE_URL}/users/`, { username: newUsername, password: newPassword, is_admin: isAdmin })
      .then((response) => {
        setUsers([...users, response.data]);
        setNewUsername('');
        setNewPassword('');
        setConfirmPassword('');
        setIsAdmin(false);
        notify('User added', 'success');
      })
      .catch((error) => {
        console.error('Error adding user:', error);
        notify(error.response?.data?.detail || 'Error adding user', 'error');
      });
  };

  const openDeleteDialog = (user) => {
    if (user.is_admin && users.filter((u) => u.is_admin).length <= 1) {
      notify('Cannot delete the only admin user. Create another admin user first.', 'warning');
      return;
    }
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const confirmDeleteUser = () => {
    if (!userToDelete) return;
    axios.delete(`${API_BASE_URL}/users/${userToDelete.id}`)
      .then(() => {
        setUsers(users.filter((user) => user.id !== userToDelete.id));
        notify('User deleted', 'success');
        closeDeleteDialog();
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
        notify(error.response?.data?.detail || 'Error deleting user', 'error');
        closeDeleteDialog();
      });
  };

  const lastAdmin = (user) => user.is_admin && users.filter((u) => u.is_admin).length <= 1;

  return (
    <Box>
      <SectionHeader title="Users" description="Accounts that can sign in to this console." />

      <Box sx={{ maxWidth: 420 }}>
        <CustomTextField
          label="Username"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          required
        />
        <CustomTextField
          type="password"
          label="Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <CustomTextField
          type="password"
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          error={confirmPassword !== '' && newPassword !== confirmPassword}
          helperText={confirmPassword !== '' && newPassword !== confirmPassword ? "Passwords don't match" : ''}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Tooltip title="Grant admin privileges to this user">
            <IconButton onClick={() => setIsAdmin(!isAdmin)} color={isAdmin ? 'primary' : 'default'}>
              <AdminPanelSettingsIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="body2" color={isAdmin ? 'primary' : 'text.secondary'}>
            {isAdmin ? 'Admin user' : 'Regular user'}
          </Typography>
        </Box>
        <Box mt={2}>
          <CustomButton
            onClick={addUser}
            disabled={!newUsername || !newPassword || !confirmPassword || newPassword !== confirmPassword}
          >
            Add user
          </CustomButton>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table aria-label="user table" size="small">
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell align="center">Role</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell component="th" scope="row">
                  {user.username}
                </TableCell>
                <TableCell align="center">
                  {user.is_admin ? (
                    <Tooltip title="Admin user">
                      <AdminPanelSettingsIcon color="primary" fontSize="small" />
                    </Tooltip>
                  ) : (
                    <Tooltip title="Regular user">
                      <PersonIcon color="action" fontSize="small" />
                    </Tooltip>
                  )}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title={lastAdmin(user) ? 'This is the only admin user and cannot be deleted' : 'Delete user'}>
                    <span>
                      <IconButton
                        onClick={() => openDeleteDialog(user)}
                        color="error"
                        size="small"
                        disabled={lastAdmin(user)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {users.length === 0 && (
        <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
          No users yet. Add one above.
        </Typography>
      )}

      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Delete user"
        content={
          userToDelete?.is_admin
            ? `Warning: you are about to delete the admin user "${userToDelete?.username}". This cannot be undone.`
            : `Delete the user "${userToDelete?.username}"? This cannot be undone.`
        }
        onConfirm={confirmDeleteUser}
        onCancel={closeDeleteDialog}
      />
    </Box>
  );
};

export default UsersSection;
