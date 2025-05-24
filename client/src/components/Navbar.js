import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import AdUnitsIcon from '@mui/icons-material/AdUnits';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';

const pages = [
  { name: 'Templates', path: '/templates' },
  { name: 'History', path: '/history' },
  { name: 'Email', path: '/email' },
  { name: 'Discord', path: '/webhook' },
];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleCloseUserMenu();
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#2C3E50' }}>
      <Toolbar disableGutters sx={{ px: 2 }}>
        {/* Left-Aligned Logo */}
        <IconButton component={Link} to="/" sx={{ color: 'white', mr: 2 }}>
          <AdUnitsIcon />
        </IconButton>
        <Typography
          variant="h6"
          noWrap
          component={Link}
          to="/"
          sx={{
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.2rem',
            color: 'inherit',
            textDecoration: 'none',
            mr: 2,
          }}
        >
          NotifyAgent
        </Typography>

        {/* Desktop Menu */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          {pages.map((page) => (
            <Button
              key={page.name}
              component={Link}
              to={page.path}
              onClick={handleCloseNavMenu}
              sx={{
                my: 2,
                color: location.pathname === page.path ? "#3b99ff" : "white",
                fontWeight: location.pathname === page.path ? 700 : 500,
                display: 'block',
                transition: 'background 0.2s, color 0.2s, transform 0.2s',
                boxShadow: 'none',
                '&:hover': {
                  color: "#3b99ff",
                  boxShadow: 'none',
                  backgroundColor: 'transparent',
                  fontWeight: 700,
                  transform: 'scale(1.07)',
                },
              }}
            >
              {page.name}
            </Button>
          ))}
        </Box>

        {/* Mobile Menu */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
            sx={{
              transition: 'background 0.2s, color 0.2s, transform 0.2s',
              '&:hover': {
                color: "#3b99ff",
                transform: 'scale(1.1)',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
          >
            {pages.map((page) => (
              <MenuItem
                key={page.name}
                onClick={handleCloseNavMenu}
                sx={{
                  backgroundColor: location.pathname === page.path ? "#3b99ff" : undefined,
                  color: location.pathname === page.path ? "white" : undefined,
                  fontWeight: location.pathname === page.path ? 700 : undefined,
                  transition: 'background 0.2s, color 0.2s, transform 0.2s',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    fontWeight: 700,
                    transform: 'scale(1.03)',
                  },
                }}
              >
                <Typography
                  component={Link}
                  to={page.path}
                  sx={{
                    textAlign: 'center',
                    textDecoration: 'none',
                    color: 'inherit',
                    width: '100%',
                  }}
                >
                  {page.name}
                </Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>

        {/* Right-Aligned Gear Icon */}
        <IconButton
          component={Link}
          to="/configuration"
          sx={{
            color: location.pathname === "/configuration" ? "#3b99ff" : "white",
            fontWeight: location.pathname === "/configuration" ? 700 : 500,
            ml: 'auto',
            mr: 1,
            transition: 'background 0.2s, color 0.2s, transform 0.2s',
            '&:hover': {
              color: "#3b99ff",
              transform: 'rotate(20deg) scale(1.15)',
            },
          }}
          aria-label="Configuration"
        >
          <SettingsIcon />
        </IconButton>

        {/* User Menu */}
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Account settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 35, height: 35 }}>
                {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar-user"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            <MenuItem disabled>
              <Typography textAlign="center">
                {user?.username || 'User'}
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <Typography textAlign="center">Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default ResponsiveAppBar;