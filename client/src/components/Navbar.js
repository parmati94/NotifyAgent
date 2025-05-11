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
import { Link } from 'react-router-dom';

const pages = [
  { name: 'Templates', path: '/templates' },
  { name: 'History', path: '/history' },
  { name: 'Email', path: '/email' },
  { name: 'Discord', path: '/webhook' },
];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static">
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
              sx={{ my: 2, color: 'white', display: 'block' }}
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
              <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                <Typography
                  component={Link}
                  to={page.path}
                  sx={{ textAlign: 'center', textDecoration: 'none', color: 'inherit' }}
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
          sx={{ color: 'white', ml: 'auto' }}
          aria-label="Configuration"
        >
          <SettingsIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default ResponsiveAppBar;