import React, { createContext, useContext, useMemo, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { makeTheme, ACCENTS, DEFAULT_ACCENT, ACCENT_STORAGE_KEY } from '../theme/theme';

const AppearanceContext = createContext({ accent: DEFAULT_ACCENT, setAccent: () => {} });

export const useAppearance = () => useContext(AppearanceContext);

// Owns the user-selected accent (persisted) and derives the MUI theme from
// it. Light/dark mode is handled separately by MUI's useColorScheme.
export const AppearanceProvider = ({ children }) => {
  const [accent, setAccentState] = useState(() => {
    const stored = localStorage.getItem(ACCENT_STORAGE_KEY);
    return ACCENTS[stored] ? stored : DEFAULT_ACCENT;
  });

  const setAccent = (key) => {
    if (!ACCENTS[key]) return;
    localStorage.setItem(ACCENT_STORAGE_KEY, key);
    setAccentState(key);
  };

  const theme = useMemo(() => makeTheme(accent), [accent]);

  return (
    <AppearanceContext.Provider value={{ accent, setAccent }}>
      <ThemeProvider theme={theme} defaultMode="dark">
        {children}
      </ThemeProvider>
    </AppearanceContext.Provider>
  );
};
