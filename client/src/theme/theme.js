import { createTheme } from '@mui/material/styles';

// ---------------------------------------------------------------------------
// Design tokens — single source of truth for the "broadcast console" look.
// Neutrals are fixed per scheme; the accent is user-selectable from ACCENTS
// (appearance popover in the sidebar) and flows through makeTheme(). Each
// accent ships as a tuned pair: bright fills for dark mode, darkened
// text-safe variants for light mode. `soft` is the light/fill variant and
// `deep` the pressed/hover variant within each scheme.
// ---------------------------------------------------------------------------
export const tokens = {
  dark: {
    bg: '#0e141b',            // page background
    surface: '#151d26',       // cards, drawer, dialogs
    surfaceRaised: '#1a2430', // table chrome, hover panels
    border: '#24303d',
    text: '#e8edf2',
    muted: '#8b98a5',
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
    success: '#1e8e63',
    danger: '#c73950',
  },
};

export const ACCENTS = {
  amber: {
    label: 'Signal Amber',
    dark: { main: '#f5a524', soft: '#ffbe4d', deep: '#d18a10' },
    light: { main: '#b26a00', soft: '#f5a524', deep: '#8f5500' },
  },
  plex: {
    label: 'Plex Gold',
    dark: { main: '#e5a00d', soft: '#f7c34a', deep: '#c4880a' },
    light: { main: '#9a6c00', soft: '#e5a00d', deep: '#7a5500' },
  },
  blue: {
    label: 'Sky Blue',
    dark: { main: '#3b99ff', soft: '#7ab8ff', deep: '#1f7fe6' },
    light: { main: '#1a6fd4', soft: '#3b99ff', deep: '#12508f' },
  },
  green: {
    label: 'Signal Green',
    dark: { main: '#3ddc97', soft: '#7ceab8', deep: '#22b878' },
    light: { main: '#1e8e63', soft: '#3ddc97', deep: '#136f4b' },
  },
  violet: {
    label: 'Violet',
    dark: { main: '#a78bfa', soft: '#c4b5fd', deep: '#8b5cf6' },
    light: { main: '#7c3aed', soft: '#a78bfa', deep: '#5b21b6' },
  },
  rose: {
    label: 'Rose',
    dark: { main: '#fb7185', soft: '#fda4af', deep: '#f43f5e' },
    light: { main: '#be123c', soft: '#fb7185', deep: '#9f1239' },
  },
};

export const DEFAULT_ACCENT = 'amber';
export const ACCENT_STORAGE_KEY = 'na-accent';

const fontFamilyMono = '"IBM Plex Mono", ui-monospace, "Cascadia Mono", Menlo, monospace';
const fontFamilyDisplay = '"Space Grotesk", "Inter", sans-serif';

const makePalette = (t, accent, mode) => ({
  mode,
  primary: {
    main: accent.main,
    light: accent.soft,
    dark: accent.deep,
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
  // Custom slot: LED/accent fills that stay bright in both schemes.
  signal: { main: accent.main },
});

export const makeTheme = (accentKey) => {
  const accent = ACCENTS[accentKey] || ACCENTS[DEFAULT_ACCENT];

  return createTheme({
    cssVariables: { colorSchemeSelector: 'class' },
    defaultColorScheme: 'dark',
    colorSchemes: {
      dark: { palette: makePalette(tokens.dark, accent.dark, 'dark') },
      light: { palette: makePalette(tokens.light, accent.light, 'light') },
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
};

export default makeTheme(DEFAULT_ACCENT);
