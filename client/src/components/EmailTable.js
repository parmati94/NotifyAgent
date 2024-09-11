import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

function EmailTable({ emails, onDelete }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <TableContainer component={Paper} sx={{ width: '75%' }}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: 'black', color: 'white' }}>#</TableCell>
              <TableCell sx={{ backgroundColor: 'black', color: 'white' }} align="right">Email</TableCell>
              <TableCell sx={{ backgroundColor: 'black', color: 'white' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {emails.map((email, index) => (
              <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' }, '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell align="right">{email}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => onDelete(email)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default EmailTable;