import React from 'react';
import { keyframes } from '@emotion/react';
import { Box, ButtonBase, Typography } from '@mui/material';
import { tokens } from '../theme/theme';

// The signal amber is identical in both color schemes (tokens.dark.accent),
// so the LED pulse can safely reference it directly.
const signal = tokens.dark.accent;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 ${signal}73; }
  70% { box-shadow: 0 0 0 8px ${signal}00; }
  100% { box-shadow: 0 0 0 0 ${signal}00; }
`;

// A selectable delivery channel on the compose page. Behaves as a checkbox;
// the LED reports readiness: amber pulse = selected and ready, red = selected
// but not ready to deliver, grey = deselected or not configured.
const ChannelCard = ({ icon, name, statusLine, ready, selected, onToggle }) => {
  const ledColor = !selected
    ? 'action.disabled'
    : ready
      ? 'signal.main'
      : 'error.main';

  return (
    <ButtonBase
      onClick={onToggle}
      role="checkbox"
      aria-checked={selected}
      aria-label={`Send via ${name}`}
      focusRipple
      sx={{
        flex: 1,
        minWidth: 220,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        p: 2,
        borderRadius: 3,
        textAlign: 'left',
        justifyContent: 'flex-start',
        border: '1px solid',
        borderColor: selected ? 'primary.main' : 'divider',
        backgroundColor: (theme) =>
          selected ? `rgba(${theme.vars.palette.primary.mainChannel} / 0.07)` : 'transparent',
        opacity: selected ? 1 : 0.6,
        transition: 'border-color .2s ease, opacity .2s ease, background-color .2s ease',
        '&:hover': { borderColor: 'primary.main', opacity: 1 },
      }}
    >
      <Box sx={{ display: 'flex', color: selected ? 'primary.main' : 'text.secondary' }}>
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', lineHeight: 1.3 }}>
          {name}
        </Typography>
        <Typography
          noWrap
          sx={{
            fontFamily: (theme) => theme.typography.fontFamilyMono,
            fontSize: '0.72rem',
            color: 'text.secondary',
          }}
        >
          {statusLine}
        </Typography>
      </Box>
      <Box
        aria-hidden
        sx={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          ml: 'auto',
          flexShrink: 0,
          bgcolor: ledColor,
          ...(selected && ready && {
            '@media (prefers-reduced-motion: no-preference)': {
              animation: `${pulse} 2.4s ease-out infinite`,
            },
          }),
        }}
      />
    </ButtonBase>
  );
};

export default ChannelCard;
