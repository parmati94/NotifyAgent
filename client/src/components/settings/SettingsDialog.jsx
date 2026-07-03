import React, { useState } from 'react';
import {
  Box,
  Dialog,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import TagOutlinedIcon from '@mui/icons-material/TagOutlined';
import CustomSnackbar from '../CustomSnackbar';
import UsersSection from './UsersSection';
import EmailSection from './EmailSection';
import TautulliSection from './TautulliSection';
import ExclusionsSection from './ExclusionsSection';
import RolesSection from './RolesSection';

const sections = [
  { key: 'users', label: 'Users', icon: <PeopleAltOutlinedIcon />, component: UsersSection },
  { key: 'email', label: 'Email', icon: <EmailOutlinedIcon />, component: EmailSection },
  { key: 'tautulli', label: 'Tautulli', icon: <StorageOutlinedIcon />, component: TautulliSection },
  { key: 'exclusions', label: 'Exclusions', icon: <BlockOutlinedIcon />, component: ExclusionsSection },
  { key: 'roles', label: 'Discord roles', icon: <TagOutlinedIcon />, component: RolesSection },
];

// App settings as a two-pane dialog over a blurred backdrop: section list on
// the left, the active section's pane on the right. On small screens the
// dialog goes full-screen and the section list becomes scrollable tabs.
const SettingsDialog = ({ open, onClose }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [activeKey, setActiveKey] = useState(sections[0].key);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const notify = (message, severity = 'success') =>
    setSnackbar({ open: true, message, severity });

  const active = sections.find((section) => section.key === activeKey) || sections[0];
  const ActivePane = active.component;

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullScreen={fullScreen}
        fullWidth
        maxWidth="md"
        slotProps={{
          backdrop: {
            sx: {
              backdropFilter: 'blur(6px)',
              backgroundColor: 'rgba(8, 12, 17, 0.55)',
            },
          },
        }}
        PaperProps={{
          sx: fullScreen ? {} : { height: 'min(640px, calc(100vh - 64px))' },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 2.5,
            py: 1.75,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography
            sx={{
              fontFamily: (t) => t.typography.fontFamilyMono,
              fontSize: '0.72rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'text.secondary',
            }}
          >
            Settings
          </Typography>
          <IconButton onClick={onClose} aria-label="Close settings" sx={{ ml: 'auto' }} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Mobile: horizontal section tabs */}
        {fullScreen && (
          <Tabs
            value={activeKey}
            onChange={(e, value) => setActiveKey(value)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: '1px solid', borderColor: 'divider', minHeight: 44 }}
          >
            {sections.map((section) => (
              <Tab key={section.key} value={section.key} label={section.label} sx={{ minHeight: 44 }} />
            ))}
          </Tabs>
        )}

        <Box sx={{ display: 'flex', flexGrow: 1, minHeight: 0 }}>
          {/* Desktop: vertical section nav */}
          {!fullScreen && (
            <List
              sx={{
                width: 200,
                flexShrink: 0,
                borderRight: '1px solid',
                borderColor: 'divider',
                py: 1,
                overflowY: 'auto',
              }}
            >
              {sections.map((section) => (
                <ListItem key={section.key} disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    selected={section.key === activeKey}
                    onClick={() => setActiveKey(section.key)}
                    sx={{ mx: 1, my: 0.25, minHeight: 42 }}
                  >
                    <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary' }}>
                      {section.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={section.label}
                      primaryTypographyProps={{
                        fontSize: '0.88rem',
                        fontWeight: section.key === activeKey ? 600 : 500,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}

          {/* Active pane */}
          <Box sx={{ flexGrow: 1, overflowY: 'auto', p: { xs: 2.5, md: 3.5 } }}>
            <ActivePane notify={notify} />
          </Box>
        </Box>
      </Dialog>

      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </>
  );
};

export default SettingsDialog;
