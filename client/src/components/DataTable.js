import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  useTheme,
  alpha
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

/**
 * A standardized data table component that can be used across all pages
 * 
 * @param {Object} props - Component props
 * @param {Array} props.columns - Array of column definitions
 * @param {Array} props.data - Array of data objects
 * @param {string} props.idField - Field to use as unique ID (default: 'id')
 * @param {boolean} props.enableSearch - Enable search functionality (default: false)
 * @param {boolean} props.enableSort - Enable sorting functionality (default: true)
 * @param {boolean} props.enablePagination - Enable pagination (default: true)
 * @param {number} props.defaultRowsPerPage - Default rows per page (default: 5)
 * @param {Array} props.rowsPerPageOptions - Options for rows per page (default: [5, 10, 25])
 * @param {Function} props.onRowClick - Function to call when a row is clicked
 * @param {string} props.emptyMessage - Message to display when there's no data
 * @returns {React.Component} DataTable component
 */
const DataTable = ({
  columns = [],
  data = [],
  idField = 'id',
  enableSearch = false,
  enableSort = true,
  enablePagination = true,
  defaultRowsPerPage = 5,
  rowsPerPageOptions = [5, 10, 25],
  onRowClick,
  emptyMessage = "No data available"
}) => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Handle search by checking if any field in the data includes the search query
  const handleSearch = (data) => {
    if (!searchQuery) return data;
    
    return data.filter(row => {
      return columns.some(column => {
        if (!column.searchable) return false;
        
        const fieldValue = column.accessor(row);
        if (fieldValue == null) return false;
        
        return String(fieldValue).toLowerCase().includes(searchQuery.toLowerCase());
      });
    });
  };
  
  // Handle sorting
  const handleSort = (column) => {
    const isAsc = orderBy === column && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(column);
  };
  
  const sortData = (data) => {
    if (!orderBy) return data;
    
    const columnDef = columns.find(col => col.id === orderBy);
    if (!columnDef) return data;
    
    return [...data].sort((a, b) => {
      const valueA = columnDef.accessor(a);
      const valueB = columnDef.accessor(b);
      
      if (valueA === valueB) return 0;
      
      // Handling null, undefined values
      if (valueA == null) return order === 'asc' ? -1 : 1;
      if (valueB == null) return order === 'asc' ? 1 : -1;
      
      if (typeof valueA === 'string') {
        return order === 'asc' 
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      
      return order === 'asc' 
        ? valueA - valueB 
        : valueB - valueA;
    });
  };
  
  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Process the data: search, sort, paginate
  let processedData = [...data];
  
  if (enableSearch) {
    processedData = handleSearch(processedData);
  }
  
  if (enableSort && orderBy) {
    processedData = sortData(processedData);
  }
  
  const paginatedData = enablePagination
    ? processedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : processedData;

  return (
    <Box sx={{ width: '100%' }}>
      {enableSearch && (
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setSearchQuery('')}
                    edge="end"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{ 
              maxWidth: 300,
              '.MuiOutlinedInput-root': { 
                borderRadius: theme.shape.borderRadius,
              }
            }}
          />
        </Box>
      )}

      <TableContainer>
        <Table stickyHeader aria-label="data table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  sx={{ 
                    backgroundColor: theme.palette.grey[100],
                    fontWeight: 600,
                    ...column.headerStyle
                  }}
                  style={{ width: column.width }}
                  sortDirection={orderBy === column.id ? order : false}
                >
                  {enableSort && column.sortable !== false ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleSort(column.id)}
                    >
                      {column.header}
                    </TableSortLabel>
                  ) : (
                    column.header
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <TableRow
                  key={row[idField] || rowIndex}
                  hover={!!onRowClick}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  sx={{
                    cursor: onRowClick ? 'pointer' : 'default',
                    '&:nth-of-type(odd)': {
                      backgroundColor: alpha(theme.palette.primary.light, 0.03),
                    },
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={`${row[idField] || rowIndex}-${column.id}`}
                      align={column.align || 'left'}
                      sx={column.cellStyle}
                    >
                      {column.render 
                        ? column.render(row) 
                        : column.accessor(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {enablePagination && (
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={processedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        />
      )}
    </Box>
  );
};

export default DataTable;
