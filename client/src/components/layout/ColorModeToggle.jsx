import React from 'react';
import { useColorScheme } from '@mui/material/styles';
import { IconButton, ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

// Switches between the dark and light color schemes. Renders as a nav-style
// row inside the sidebar, or as a bare icon button (iconOnly) for the mobile
// top strip and the collapsed sidebar.
const ColorModeToggle = ({ iconOnly = false }) => {
  const { mode, systemMode, setMode } = useColorScheme();
  const resolvedMode = mode === 'system' ? systemMode : mode;
  const isDark = resolvedMode !== 'light';
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
  const icon = isDark ? <LightModeIcon /> : <DarkModeIcon />;
  const toggle = () => setMode(isDark ? 'light' : 'dark');

  if (iconOnly) {
    return (
      <Tooltip title={label} placement="right">
        <IconButton onClick={toggle} aria-label={label} sx={{ color: 'text.secondary' }}>
          {icon}
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <ListItemButton onClick={toggle} aria-label={label} sx={{ mx: 1, my: 0.25 }}>
      <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>{icon}</ListItemIcon>
      <ListItemText
        primary={isDark ? 'Light mode' : 'Dark mode'}
        primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }}
      />
    </ListItemButton>
  );
};

export default ColorModeToggle;
