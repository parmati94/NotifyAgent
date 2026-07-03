import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Box, Drawer, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CellTowerIcon from '@mui/icons-material/CellTower';
import Sidebar from './Sidebar';
import AppearancePopover from './AppearancePopover';
import SettingsDialog from '../settings/SettingsDialog';

const DRAWER_WIDTH = 240;
const DRAWER_WIDTH_COLLAPSED = 76;
const COLLAPSE_KEY = 'na-sidebar-collapsed';

// Layout route element for all authenticated pages: permanent (collapsible)
// sidebar on desktop, slim top strip + temporary drawer on mobile, and a
// centered main content column that owns page background and padding.
const AppShell = () => {
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem(COLLAPSE_KEY) === 'true'
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const openSettings = () => {
    setSettingsOpen(true);
    setMobileOpen(false);
  };

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      localStorage.setItem(COLLAPSE_KEY, String(!prev));
      return !prev;
    });
  };

  const drawerWidth = collapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Desktop: permanent, collapsible drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            overflowX: 'hidden',
            transition: (theme) =>
              theme.transitions.create('width', {
                duration: theme.transitions.duration.shorter,
              }),
          },
        }}
      >
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={toggleCollapsed}
          onOpenSettings={openSettings}
          settingsOpen={settingsOpen}
        />
      </Drawer>

      {/* Mobile: temporary drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH },
        }}
      >
        <Sidebar
          onNavigate={() => setMobileOpen(false)}
          onOpenSettings={openSettings}
          settingsOpen={settingsOpen}
        />
      </Drawer>

      <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        {/* Mobile top strip */}
        <Box
          sx={{
            display: { xs: 'flex', md: 'none' },
            alignItems: 'center',
            gap: 1,
            px: 1.5,
            py: 1,
            bgcolor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
            position: 'sticky',
            top: 0,
            zIndex: (theme) => theme.zIndex.appBar,
          }}
        >
          <IconButton onClick={() => setMobileOpen(true)} aria-label="Open navigation">
            <MenuIcon />
          </IconButton>
          <Box
            component={Link}
            to="/"
            sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', color: 'inherit' }}
          >
            <CellTowerIcon sx={{ color: 'signal.main' }} fontSize="small" />
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamilyDisplay,
                fontWeight: 700,
                fontSize: '1.05rem',
                color: 'text.primary',
              }}
            >
              NotifyAgent
            </Typography>
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <AppearancePopover iconOnly />
          </Box>
        </Box>

        {/* Page content */}
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            maxWidth: 1200,
            mx: 'auto',
            px: { xs: 2, md: 4 },
            py: { xs: 2.5, md: 4 },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AppShell;
