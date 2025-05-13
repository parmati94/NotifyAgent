import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
  TableSortLabel,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import CustomTextField from './TextField';

function EmailTable({ emails, onDelete }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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

  // Handle search query change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Toggle search bar visibility
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  // Filter emails based on the search query
  const filteredEmails = emails.filter((email) =>
    email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort emails
  const sortedEmails = [...filteredEmails].sort((a, b) => {
    if (order === 'asc') {
      return a.localeCompare(b);
    } else {
      return b.localeCompare(a);
    }
  });

  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <TableContainer
        component={Paper}
        sx={{
          width: '100%',
          maxWidth: { xs: '100%', sm: 800 },
          overflowX: 'auto',
          position: 'relative',
        }}
        elevation={8}
      >
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  backgroundColor: '#d3d3d3',
                  color: 'black',
                  width: '10%',
                  whiteSpace: 'nowrap',
                }}
              >
                #
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: '#d3d3d3',
                  color: 'black',
                  width: '60%',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                <TableSortLabel
                  active
                  direction={order}
                  onClick={handleSort}
                  sx={{
                    color: 'black',
                    '& .MuiTableSortLabel-icon': {
                      color: 'black !important',
                    },
                  }}
                >
                  <span style={{ color: 'black' }}>Email</span>
                </TableSortLabel>
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: '#d3d3d3',
                  color: 'black',
                  width: '30%',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedEmails.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((email, index) => (
              <TableRow
                key={index}
                sx={{
                  '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
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

        {/* Pagination and Search Bar */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#d3d3d3',
            color: 'white',
            padding: '8px 16px',
            gap: 1,
          }}
        >
          {/* Search Icon or Search Bar */}
          {!isSearchOpen ? (
            <IconButton
              onClick={toggleSearch}
              sx={{
                color: 'black',
                '&:hover': { color: '#3b99ff' },
              }}
            >
              <SearchIcon />
            </IconButton>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'white',
                color: 'black',
                borderRadius: '4px',
                padding: '4px 8px',
                height: '32px',
                width: { xs: '150px', sm: '200px' },
              }}
            >
              <CustomTextField
                placeholder="Search Emails"
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{ width: '100%', height: '32px', margin: 0 }}
                InputProps={{
                  disableUnderline: true,
                  style: { color: 'black', fontSize: '14px' },
                  endAdornment: (
                    <IconButton onClick={toggleSearch} sx={{ color: 'black' }}>
                      <SearchIcon />
                    </IconButton>
                  ),
                }}
              />
            </Box>
          )}

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 20, 50]}
            component="div"
            count={filteredEmails.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              backgroundColor: '#d3d3d3',
              color: 'black',
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows, & .MuiTablePagination-actions': {
                color: 'black',
              },
              '& .MuiSelect-icon': {
                color: 'black',
              },
            }}
          />
        </Box>
      </TableContainer>
    </div>
  );
}

export default EmailTable;