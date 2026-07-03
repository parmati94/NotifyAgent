import { createTheme } from '@mui/material/styles';

// ---------------------------------------------------------------------------
// Design tokens — single source of truth for the "broadcast console" look.
// Dark is the default scheme; light mirrors it. Components should consume
// these through the theme (theme.vars.palette.*) rather than importing raw
// values, so both color schemes stay in sync.
// ---------------------------------------------------------------------------
export const tokens = {
  dark: {
    bg: '#0e141b',            // page background
    surface: '#151d26',       // cards, drawer, dialogs
    surfaceRaised: '#1a2430', // table chrome, hover panels
    border: '#24303d',
    text: '#e8edf2',
    muted: '#8b98a5',
    accent: '#f5a524',        // "on-air" amber
    accentSoft: '#ffbe4d',
    accentDeep: '#d18a10',
    success: '#3ddc97',
    danger: '#ef4e6a',
  },
  light: {
    bg: '#eef1f5',
    surface: '#ffffff',
    surfaceRaised: '#f4f7fa',
    border: '#dbe2ea',
    text: '#16202a',
    muted: '#5b6b7a',
    accent: '#b26a00',        // amber darkened for contrast on white
    accentSoft: '#f5a524',    // true amber, for LED fills and rails
    accentDeep: '#8f5500',
    success: '#1e8e63',
    danger: '#c73950',
  },
};

const fontFamilyMono = '"IBM Plex Mono", ui-monospace, "Cascadia Mono", Menlo, monospace';
const fontFamilyDisplay = '"Space Grotesk", "Inter", sans-serif';

const makePalette = (t, mode) => ({
  mode,
  primary: {
    main: t.accent,
    light: t.accentSoft,
    dark: t.accentDeep,
    contrastText: mode === 'dark' ? '#10151b' : '#ffffff',
  },
  secondary: {
    main: t.muted,
    contrastText: mode === 'dark' ? '#10151b' : '#ffffff',
  },
  success: { main: t.success, contrastText: mode === 'dark' ? '#0c1310' : '#ffffff' },
  error: { main: t.danger, contrastText: '#ffffff' },
  background: { default: t.bg, paper: t.surface },
  text: { primary: t.text, secondary: t.muted },
  divider: t.border,
  // Custom slot: table head / pagination chrome. Exposed as a CSS variable
  // (--mui-palette-tableChrome-main) so it tracks the active scheme.
  tableChrome: { main: t.surfaceRaised },
  // Custom slot: LED/accent fills that stay true amber in both schemes.
  signal: { main: tokens.dark.accent },
});

const theme = createTheme({
  cssVariables: { colorSchemeSelector: 'class' },
  defaultColorScheme: 'dark',
  colorSchemes: {
    dark: { palette: makePalette(tokens.dark, 'dark') },
    light: { palette: makePalette(tokens.light, 'light') },
  },

  shape: {
    borderRadius: 10,
  },

  typography: {
    fontFamily: 'Inter, Roboto, "Helvetica Neue", Arial, sans-serif',
    fontFamilyMono,
    fontFamilyDisplay,
    h1: { fontFamily: fontFamilyDisplay, fontWeight: 700 },
    h2: { fontFamily: fontFamilyDisplay, fontWeight: 700 },
    h3: { fontFamily: fontFamilyDisplay, fontWeight: 700 },
    h4: { fontFamily: fontFamilyDisplay, fontWeight: 700, letterSpacing: '-0.5px' },
    h5: { fontFamily: fontFamilyDisplay, fontWeight: 600 },
    h6: { fontFamily: fontFamilyDisplay, fontWeight: 600 },
    overline: { fontFamily: fontFamilyMono, letterSpacing: '0.14em' },
    button: { fontWeight: 600, textTransform: 'none' },
  },

  components: {
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: ({ theme }) => ({
          border: `1px solid ${theme.vars.palette.divider}`,
          borderRadius: 16,
          backgroundImage: 'none',
          boxShadow: '0 10px 30px rgba(15, 23, 31, 0.06)',
          ...theme.applyStyles('dark', {
            boxShadow: '0 14px 40px rgba(0, 0, 0, 0.35)',
          }),
        }),
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // kill MUI's dark-mode elevation tint
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
        containedPrimary: ({ theme }) => ({
          boxShadow: `0 4px 14px rgba(${theme.vars.palette.primary.mainChannel} / 0.30)`,
          '&:hover': {
            boxShadow: `0 8px 22px rgba(${theme.vars.palette.primary.mainChannel} / 0.38)`,
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        }),
      },
    },

    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        head: ({ theme }) => ({
          backgroundColor: theme.vars.palette.tableChrome.main,
          color: theme.vars.palette.text.secondary,
          fontFamily: fontFamilyMono,
          fontSize: '0.72rem',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }),
      },
    },

    MuiTableContainer: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 14,
          border: `1px solid ${theme.vars.palette.divider}`,
          backgroundColor: theme.vars.palette.background.paper,
        }),
      },
    },

    MuiTablePagination: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.vars.palette.tableChrome.main,
        }),
      },
    },

    MuiAccordion: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 12,
          border: `1px solid ${theme.vars.palette.divider}`,
          backgroundImage: 'none',
          '&:before': { display: 'none' },
        }),
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 12, alignItems: 'center' },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: ({ theme }) => ({
          border: `1px solid ${theme.vars.palette.divider}`,
          backgroundImage: 'none',
        }),
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: ({ theme }) => ({
          backgroundColor: theme.vars.palette.background.paper,
          borderRight: `1px solid ${theme.vars.palette.divider}`,
          backgroundImage: 'none',
        }),
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 10,
          '&.Mui-selected': {
            backgroundColor: `rgba(${theme.vars.palette.primary.mainChannel} / 0.12)`,
            '&:hover': {
              backgroundColor: `rgba(${theme.vars.palette.primary.mainChannel} / 0.18)`,
            },
            '& .MuiListItemIcon-root': {
              color: theme.vars.palette.primary.main,
            },
          },
        }),
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '0.75rem',
        },
      },
    },
  },
});

export default theme;
