import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import CellTowerIcon from '@mui/icons-material/CellTower';
import SendIcon from '@mui/icons-material/Send';
import DescriptionIcon from '@mui/icons-material/Description';
import HistoryIcon from '@mui/icons-material/History';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import TagIcon from '@mui/icons-material/Tag';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useAuth } from '../../context/AuthContext';
import AppearancePopover from './AppearancePopover';

const navItems = [
  { name: 'Compose', path: '/', icon: <SendIcon /> },
  { name: 'Templates', path: '/templates', icon: <DescriptionIcon /> },
  { name: 'History', path: '/history', icon: <HistoryIcon /> },
  { name: 'Recipients', path: '/email', icon: <AlternateEmailIcon /> },
  { name: 'Discord', path: '/webhook', icon: <TagIcon /> },
];

// Renders as a router Link when the item has a path, or a plain button when
// it has an onClick (e.g. Settings, which opens a dialog instead of routing).
const NavItem = ({ item, active, collapsed, onNavigate }) => {
  const linkProps = item.path
    ? { component: Link, to: item.path, onClick: onNavigate }
    : { onClick: item.onClick };
  const button = (
    <ListItemButton
      {...linkProps}
      selected={active}
      sx={{
        mx: 1,
        my: 0.25,
        minHeight: 44,
        justifyContent: collapsed ? 'center' : 'flex-start',
        px: collapsed ? 1.5 : 2,
      }}
    >
      <ListItemIcon
        sx={{ minWidth: collapsed ? 0 : 40, color: 'text.secondary', justifyContent: 'center' }}
      >
        {item.icon}
      </ListItemIcon>
      {!collapsed && (
        <ListItemText
          primary={item.name}
          primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: active ? 600 : 500 }}
        />
      )}
    </ListItemButton>
  );

  return (
    <ListItem disablePadding sx={{ display: 'block' }}>
      {collapsed ? (
        <Tooltip title={item.name} placement="right">
          {button}
        </Tooltip>
      ) : (
        button
      )}
    </ListItem>
  );
};

// Drawer contents: wordmark, primary navigation, and the bottom cluster
// (settings, color mode, current user). Used by both the permanent desktop
// drawer (which can collapse to icons) and the temporary mobile drawer.
const Sidebar = ({ collapsed = false, onToggleCollapse, onNavigate, onOpenSettings, settingsOpen = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflowX: 'hidden' }}>
      {/* Wordmark */}
      <Box
        component={Link}
        to="/"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
          px: collapsed ? 0 : 2.5,
          py: 2.5,
          justifyContent: collapsed ? 'center' : 'flex-start',
          textDecoration: 'none',
          color: 'inherit',
        }}
      >
        <CellTowerIcon sx={{ color: 'signal.main', fontSize: 28 }} />
        {!collapsed && (
          <Box sx={{ lineHeight: 1 }}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamilyDisplay,
                fontWeight: 700,
                fontSize: '1.15rem',
                letterSpacing: '0.01em',
                color: 'text.primary',
              }}
            >
              NotifyAgent
            </Typography>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamilyMono,
                fontSize: '0.62rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'text.secondary',
              }}
            >
              Broadcast console
            </Typography>
          </Box>
        )}
      </Box>

      {/* Primary navigation */}
      <List sx={{ pt: 0 }}>
        {navItems.map((item) => (
          <NavItem
            key={item.name}
            item={item}
            active={isActive(item.path)}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      {/* Bottom cluster */}
      <Divider sx={{ mx: 1.5 }} />
      <List>
        <NavItem
          item={{ name: 'Settings', icon: <SettingsIcon />, onClick: onOpenSettings }}
          active={settingsOpen}
          collapsed={collapsed}
        />
        {collapsed ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 0.25 }}>
            <AppearancePopover iconOnly />
          </Box>
        ) : (
          <AppearancePopover />
        )}
      </List>

      {/* Current user */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: collapsed ? 'column' : 'row',
          gap: 1,
          px: collapsed ? 0 : 2,
          py: 1.5,
          justifyContent: collapsed ? 'center' : 'flex-start',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Tooltip title={user?.username || 'User'} placement="right">
          <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', width: 32, height: 32, fontSize: '0.9rem' }}>
            {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
          </Avatar>
        </Tooltip>
        {!collapsed && (
          <Typography noWrap sx={{ fontSize: '0.85rem', fontWeight: 500, flexGrow: 1 }}>
            {user?.username || 'User'}
          </Typography>
        )}
        <Tooltip title="Log out" placement="right">
          <IconButton onClick={handleLogout} size="small" aria-label="Log out" sx={{ color: 'text.secondary' }}>
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Collapse toggle (desktop permanent drawer only) */}
      {onToggleCollapse && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: collapsed ? 'center' : 'flex-end',
            borderTop: '1px solid',
            borderColor: 'divider',
            px: 1,
            py: 0.5,
          }}
        >
          <Tooltip title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} placement="right">
            <IconButton
              onClick={onToggleCollapse}
              size="small"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              sx={{ color: 'text.secondary' }}
            >
              {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
};

export default Sidebar;
