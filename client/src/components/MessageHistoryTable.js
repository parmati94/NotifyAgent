import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';

const MessageHistoryTable = ({ messages }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Sort messages by timestamp in descending order
  const sortedMessages = [...messages].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <TableContainer component={Paper} sx={{ width: '75%' }}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: 'black', color: 'white' }}>Subject</TableCell>
              <TableCell sx={{ backgroundColor: 'black', color: 'white' }} align="right">Body</TableCell>
              <TableCell sx={{ backgroundColor: 'black', color: 'white' }} align="right">Services Used</TableCell>
              <TableCell sx={{ backgroundColor: 'black', color: 'white' }} align="right">Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedMessages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No message history available.
                </TableCell>
              </TableRow>
            ) : (
              sortedMessages.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((message, index) => (
                <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' }, '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {message.subject}
                  </TableCell>
                  <TableCell align="right">{message.body}</TableCell>
                  <TableCell align="right">{message.services}</TableCell>
                  <TableCell align="right">
                    {new Date(message.timestamp.replace(' ', 'T') + 'Z').toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 20, 50]}
          component="div"
          count={sortedMessages.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            backgroundColor: 'black',
            color: 'white',
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows, & .MuiTablePagination-actions': {
              color: 'white',
            },
            '& .MuiSelect-icon': {
              color: 'white',
            },
          }}
        />
      </TableContainer>
    </div>
  );
};

export default MessageHistoryTable;