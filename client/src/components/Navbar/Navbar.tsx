import { Link } from 'react-router-dom';
import { useState, MouseEvent } from 'react';

// Context
import { useAuth } from '../../context/useAuthContext';

// Component
import AuthMenu from './AuthMenu/AuthMenu';

// MUI
import { AppBar, Box, IconButton, Menu, MenuItem, Stack, Toolbar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

// Logo
import logo from '../../Images/logo.png';

export default function Navbar(): JSX.Element {
  // Context
  const { days, logout, premium } = useAuth();

  // State
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => setAnchorElNav(event.currentTarget);

  const handleCloseNavMenu = () => setAnchorElNav(null);

  const LinkStyle = {
    textDecoration: 'none!important',
    fontWeight: 700,
    fontSize: '0.9rem',
    color: 'secondary.main',
  };

  return (
    <AppBar
      sx={{
        boxShadow: days.length === 0 ? 'none' : '0 6px 20px 0 rgba(0, 0, 0, 0.19)',
        height: '5rem',
        backgroundColor: 'primary.light',
        px: { lg: '10rem' },
      }}
    >
      {/* Desktop View */}
      <Stack sx={{ display: { sm: 'block', xs: 'none' } }}>
        <Toolbar
          sx={{
            justifyContent: days.length === 0 ? 'center' : 'space-between',
            marginTop: '0.5rem',
          }}
        >
          <Box component="img" src={logo} alt="Logo" />
          <Stack
            sx={{ display: { sm: days.length === 0 ? 'none' : 'flex' } }}
            direction="row"
            spacing={{ md: 8, xs: 4 }}
            alignItems="center"
          >
            <Stack direction="row" spacing={{ md: 5, xs: 4 }}>
              <Box sx={{ ...LinkStyle }} component={Link} to="/">
                Home
              </Box>
              <Box sx={{ ...LinkStyle }} component={Link} to="/availability">
                Availability
              </Box>
              <Box
                sx={{ ...LinkStyle, color: 'primary.main', display: premium ? 'none' : 'flex' }}
                component={Link}
                to="/upgrade"
              >
                Upgrade Account
              </Box>
            </Stack>
            <AuthMenu />
          </Stack>
        </Toolbar>
      </Stack>

      {/* Mobile View */}
      <Stack sx={{ display: { sm: 'none' } }}>
        <Toolbar sx={{ marginTop: '1rem', justifyContent: days.length === 0 ? 'center' : 'space-between' }}>
          <Box sx={{ display: days.length === 0 ? 'none' : 'flex' }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="secondary"
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
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuItem onClick={handleCloseNavMenu}>
                <Box sx={{ ...LinkStyle }} component={Link} to="/">
                  Home
                </Box>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Box sx={{ ...LinkStyle }} component={Link} to="/availability">
                  Availability
                </Box>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Box sx={{ ...LinkStyle }} component={Link} to="/settings">
                  Settings
                </Box>
              </MenuItem>
              <MenuItem sx={{ display: premium ? 'none' : 'flex' }} onClick={handleCloseNavMenu}>
                <Box sx={{ ...LinkStyle, color: 'primary.main' }} component={Link} to="/upgrade">
                  Upgrade Account
                </Box>
              </MenuItem>
              <MenuItem sx={{ ...LinkStyle }} onClick={logout}>
                Logout
              </MenuItem>
            </Menu>
          </Box>
          <Box component="img" src={logo} alt="Logo" sx={{ display: { xs: 'flex', md: 'none' } }} />
          {/* Hacky way of centering the logo */}
          <Box sx={{ visibility: 'hidden', display: days.length === 0 ? 'none' : 'flex' }}>
            <IconButton size="large" color="secondary">
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Stack>
    </AppBar>
  );
}
