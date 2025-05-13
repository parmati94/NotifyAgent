import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#64b5f6', // Your blue for main app buttons
      contrastText: '#fff',
    },
    secondary: {
      main: '#262926', // Or another accent if you want
      contrastText: '#fff',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
          textTransform: 'none',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          '&:hover': {
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
            backgroundColor: '#3b99ff',
            transform: 'scale(1.03)',
          },
        },
      },
    },
  },
  typography: {
    fontFamily: 'Montserrat, Roboto, Arial, sans-serif', // or your preferred font
  },
});

export default theme;