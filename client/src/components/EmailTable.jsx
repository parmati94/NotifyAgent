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
      >
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '10%' }}>
                #
              </TableCell>
              <TableCell
                sx={{
                  width: '60%',
                  textAlign: 'center',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                <TableSortLabel active direction={order} onClick={handleSort}>
                  Email
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: '30%', textAlign: 'center' }}>
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
                <TableCell
                  align="center"
                  sx={{ fontFamily: (theme) => theme.typography.fontFamilyMono, fontSize: '0.82rem' }}
                >
                  {email}
                </TableCell>
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
            backgroundColor: 'tableChrome.main',
            color: 'text.primary',
            padding: '8px 16px',
            gap: 1,
          }}
        >
          {/* Search Icon or Search Bar */}
          {!isSearchOpen ? (
            <IconButton
              onClick={toggleSearch}
              aria-label="Search emails"
              sx={{
                color: 'text.primary',
                '&:hover': { color: 'primary.main' },
              }}
            >
              <SearchIcon />
            </IconButton>
          ) : (
            <CustomTextField
              placeholder="Search emails"
              value={searchQuery}
              onChange={handleSearchChange}
              size="small"
              autoFocus
              margin="none"
              sx={{ width: { xs: 170, sm: 220 }, my: 0, bgcolor: 'background.paper', borderRadius: 1 }}
              InputProps={{
                style: { fontSize: '14px' },
                endAdornment: (
                  <IconButton onClick={toggleSearch} size="small" aria-label="Close search">
                    <SearchIcon fontSize="small" />
                  </IconButton>
                ),
              }}
            />
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
          />
        </Box>
      </TableContainer>
    </div>
  );
}

export default EmailTable;