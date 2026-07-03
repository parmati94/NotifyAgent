import React, { useState } from 'react';
import { useColorScheme } from '@mui/material/styles';
import {
  Box,
  ButtonBase,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import CheckIcon from '@mui/icons-material/Check';
import { ACCENTS } from '../../theme/theme';
import { useAppearance } from '../../context/AppearanceContext';

const SectionLabel = ({ children }) => (
  <Typography
    sx={{
      fontFamily: (theme) => theme.typography.fontFamilyMono,
      fontSize: '0.62rem',
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'text.secondary',
      mb: 1,
    }}
  >
    {children}
  </Typography>
);

// Mode + accent picker. Renders as a nav-style row in the sidebar, or as a
// bare icon button (iconOnly) for the mobile top strip and collapsed sidebar.
const AppearancePopover = ({ iconOnly = false }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { mode, systemMode, setMode } = useColorScheme();
  const { accent, setAccent } = useAppearance();
  const resolvedMode = (mode === 'system' ? systemMode : mode) || 'dark';

  const open = (event) => setAnchorEl(event.currentTarget);
  const close = () => setAnchorEl(null);

  const trigger = iconOnly ? (
    <Tooltip title="Appearance" placement="right">
      <IconButton onClick={open} aria-label="Appearance" sx={{ color: 'text.secondary' }}>
        <PaletteOutlinedIcon />
      </IconButton>
    </Tooltip>
  ) : (
    <ListItemButton onClick={open} aria-label="Appearance" sx={{ mx: 1, my: 0.25 }}>
      <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
        <PaletteOutlinedIcon />
      </ListItemIcon>
      <ListItemText
        primary="Appearance"
        primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }}
      />
      <Box
        sx={{
          width: 14,
          height: 14,
          borderRadius: '50%',
          bgcolor: ACCENTS[accent].dark.main,
          border: '2px solid',
          borderColor: 'divider',
        }}
      />
    </ListItemButton>
  );

  return (
    <>
      {trigger}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={close}
        anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
        transformOrigin={{ vertical: 'center', horizontal: 'left' }}
        slotProps={{ paper: { sx: { p: 2, width: 232, ml: 1 } } }}
      >
        <SectionLabel>Mode</SectionLabel>
        <ToggleButtonGroup
          value={resolvedMode}
          exclusive
          fullWidth
          size="small"
          onChange={(e, value) => value && setMode(value)}
          sx={{ mb: 2 }}
        >
          <ToggleButton value="dark" aria-label="Dark mode">
            <DarkModeIcon fontSize="small" sx={{ mr: 0.75 }} /> Dark
          </ToggleButton>
          <ToggleButton value="light" aria-label="Light mode">
            <LightModeIcon fontSize="small" sx={{ mr: 0.75 }} /> Light
          </ToggleButton>
        </ToggleButtonGroup>

        <SectionLabel>Accent</SectionLabel>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {Object.entries(ACCENTS).map(([key, value]) => (
            <Tooltip key={key} title={value.label}>
              <ButtonBase
                onClick={() => setAccent(key)}
                aria-label={`${value.label} accent`}
                aria-pressed={accent === key}
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  bgcolor: value.dark.main,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid',
                  borderColor: accent === key ? 'text.primary' : 'transparent',
                  transition: 'border-color .15s ease, transform .15s ease',
                  '&:hover': { transform: 'scale(1.12)' },
                }}
              >
                {accent === key && <CheckIcon sx={{ fontSize: 16, color: '#10151b' }} />}
              </ButtonBase>
            </Tooltip>
          ))}
        </Box>
      </Popover>
    </>
  );
};

export default AppearancePopover;
