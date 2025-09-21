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
    <AppBar 
      position="static" 
      sx={{ 
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Toolbar disableGutters sx={{ px: 2 }}>
        {/* Left-Aligned Logo */}
        <IconButton 
          component={Link} 
          to="/" 
          sx={{ 
            color: 'white', 
            mr: 2,
            borderRadius: 2,
            padding: 1.5,
            background: 'rgba(255, 255, 255, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.2)',
              transform: 'scale(1.05)',
            }
          }}
        >
          <AdUnitsIcon />
        </IconButton>
        <Typography
          variant="h6"
          noWrap
          component={Link}
          to="/"
          sx={{
            fontFamily: 'Inter, monospace',
            fontWeight: 700,
            letterSpacing: '.1rem',
            color: 'white',
            textDecoration: 'none',
            mr: 2,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.02)',
            }
          }}
        >
          NotifyAgent
        </Typography>

        {/* Desktop Menu */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 4 }}>
          {pages.map((page, index) => (
            <Button
              key={page.name}
              component={Link}
              to={page.path}
              onClick={handleCloseNavMenu}
              sx={{
                my: 1,
                mx: 1,
                px: 3,
                py: 1,
                color: location.pathname === page.path ? "white" : "rgba(255, 255, 255, 0.8)",
                fontWeight: location.pathname === page.path ? 600 : 500,
                display: 'block',
                borderRadius: 2,
                background: location.pathname === page.path 
                  ? 'rgba(255, 255, 255, 0.2)' 
                  : 'transparent',
                border: location.pathname === page.path 
                  ? '1px solid rgba(255, 255, 255, 0.3)' 
                  : '1px solid transparent',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                  transition: 'left 0.5s',
                },
                '&:hover': {
                  color: "white",
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                  '&::before': {
                    left: '100%',
                  },
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
            sx={{
              color: 'white',
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.2)',
                transform: 'scale(1.05)',
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
            sx={{
              '& .MuiPaper-root': {
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 3,
                mt: 1,
              }
            }}
          >
            {pages.map((page) => (
              <MenuItem
                key={page.name}
                onClick={handleCloseNavMenu}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  my: 0.5,
                  backgroundColor: location.pathname === page.path ? "primary.main" : undefined,
                  color: location.pathname === page.path ? "white" : "text.primary",
                  fontWeight: location.pathname === page.path ? 700 : undefined,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: location.pathname === page.path ? "primary.dark" : "primary.main",
                    color: 'white',
                    fontWeight: 700,
                    transform: 'translateX(4px) scale(1.03)',
                  },
                }}
              >
                <Typography
                  component={Link}
                  to={page.path}
                  sx={{
                    textDecoration: 'none',
                    color: 'inherit',
                    width: '100%',
                    fontWeight: 500,
                  }}
                >
                  {page.name}
                </Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>

        {/* Right-Aligned Settings Icon */}
        <IconButton
          component={Link}
          to="/configuration"
          sx={{
            color: location.pathname === "/configuration" ? "white" : "rgba(255, 255, 255, 0.8)",
            ml: 'auto',
            mr: 2,
            borderRadius: 2,
            background: location.pathname === "/configuration" 
              ? 'rgba(255, 255, 255, 0.2)' 
              : 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.3s ease',
            '&:hover': {
              color: "white",
              background: 'rgba(255, 255, 255, 0.25)',
              transform: 'rotate(90deg) scale(1.1)',
            },
          }}
          aria-label="Configuration"
        >
          <SettingsIcon />
        </IconButton>

        {/* User Menu */}
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Account settings" arrow>
            <IconButton 
              onClick={handleOpenUserMenu} 
              sx={{ 
                p: 0,
                border: '2px solid rgba(255, 255, 255, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  border: '2px solid rgba(255, 255, 255, 0.6)',
                  transform: 'scale(1.05)',
                }
              }}
            >
              <Avatar sx={{ 
                bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                width: 40, 
                height: 40,
                fontWeight: 600,
                fontSize: '1.1rem'
              }}>
                {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ 
              mt: '45px',
              '& .MuiPaper-root': {
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 3,
                minWidth: 200,
              }
            }}
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
            <MenuItem 
              disabled
              sx={{
                borderRadius: 2,
                mx: 1,
                my: 1,
                backgroundColor: 'primary.light',
                color: 'white',
              }}
            >
              <Typography 
                sx={{ 
                  fontWeight: 600,
                  fontSize: '1rem',
                  textAlign: 'center',
                  width: '100%'
                }}
              >
                {user?.username || 'User'}
              </Typography>
            </MenuItem>
            <Divider sx={{ mx: 1, backgroundColor: 'rgba(37, 99, 235, 0.2)' }} />
            <MenuItem 
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                mx: 1,
                my: 1,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'error.light',
                  color: 'white',
                  transform: 'translateX(4px)',
                },
              }}
            >
              <ListItemIcon>
                <LogoutIcon fontSize="small" sx={{ color: 'inherit' }} />
              </ListItemIcon>
              <Typography>Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default ResponsiveAppBar;