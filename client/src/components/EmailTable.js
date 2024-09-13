import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TablePagination, TableSortLabel } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function EmailTable({ emails, onDelete }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState('asc');

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle sorting
  const handleSort = () => {
    setOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  // Sort emails
  const sortedEmails = [...emails].sort((a, b) => {
    if (order === 'asc') {
      return a.localeCompare(b);
    } else {
      return b.localeCompare(a);
    }
  });

  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <TableContainer component={Paper} sx={{ width: '75%', maxWidth: 800 }}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: 'black', color: 'white', width: '10%' }}>#</TableCell>
              <TableCell sx={{ backgroundColor: 'black', color: 'white', width: '60%', textAlign: 'center' }}>
                <TableSortLabel
                  active
                  direction={order}
                  onClick={handleSort}
                  sx={{
                    color: 'white',
                    '& .MuiTableSortLabel-icon': {
                      color: 'white !important',
                    },
                  }}
                >
                  <span style={{ color: 'white' }}>Email</span>
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ backgroundColor: 'black', color: 'white', width: '30%', textAlign: 'center' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedEmails.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((email, index) => (
              <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' }, '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row" sx={{ textAlign: 'center' }}>
                  {page * rowsPerPage + index + 1}
                </TableCell>
                <TableCell align="center">{email}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => onDelete(email)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 20, 50]}
          component="div"
          count={emails.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ backgroundColor: 'black', color: 'white' }}
        />
      </TableContainer>
    </div>
  );
}

export default EmailTable;