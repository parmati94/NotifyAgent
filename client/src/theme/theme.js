import { createTheme } from '@mui/material/styles';

// ---------------------------------------------------------------------------
// Design tokens — single source of truth for colors used across the app.
// Import these instead of sprinkling raw hex values through components.
// ---------------------------------------------------------------------------
export const tokens = {
  brand: '#3b99ff',       // primary action blue (hover/active accent)
  brandLight: '#64b5f6',  // lighter blue
  brandDark: '#1f7fe6',   // pressed / hover-darken
  slate: '#2C3E50',       // app bar / dark chrome
  slateDark: '#22303d',
  surface: '#f5f8fb',     // page background / soft panels
  surfaceBorder: '#e3eaf2',
  ink: '#1a2733',         // primary text
  inkMuted: '#5b6b7a',    // secondary text
  success: '#2e9e6b',
  danger: '#e25563',
};

const theme = createTheme({
  palette: {
    primary: {
      main: tokens.brand,
      light: tokens.brandLight,
      dark: tokens.brandDark,
      contrastText: '#fff',
    },
    secondary: {
      main: tokens.slate,
      dark: tokens.slateDark,
      contrastText: '#fff',
    },
    success: { main: tokens.success },
    error: { main: tokens.danger },
    background: {
      default: tokens.surface,
      paper: '#ffffff',
    },
    text: {
      primary: tokens.ink,
      secondary: tokens.inkMuted,
    },
    divider: tokens.surfaceBorder,
  },

  shape: {
    borderRadius: 10,
  },

  typography: {
    fontFamily: 'Montserrat, Roboto, Arial, sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.5px' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },

  components: {
    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundColor: tokens.slate,
          backgroundImage: `linear-gradient(90deg, ${tokens.slateDark}, ${tokens.slate})`,
          borderBottom: `1px solid rgba(255,255,255,0.06)`,
        },
      },
    },

    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: `1px solid ${tokens.surfaceBorder}`,
          borderRadius: 16,
          boxShadow: '0 10px 30px rgba(26, 39, 51, 0.08)',
        },
      },
    },

    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 10,
          textTransform: 'none',
          transition: 'transform .15s ease, box-shadow .15s ease, background-color .15s ease',
        },
        containedPrimary: {
          boxShadow: '0 4px 14px rgba(59, 153, 255, 0.30)',
          '&:hover': {
            backgroundColor: tokens.brandDark,
            boxShadow: '0 8px 22px rgba(59, 153, 255, 0.38)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },

    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: `1px solid ${tokens.surfaceBorder}`,
          '&:before': { display: 'none' },
        },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 12, alignItems: 'center' },
      },
    },
  },
});

export default theme;
