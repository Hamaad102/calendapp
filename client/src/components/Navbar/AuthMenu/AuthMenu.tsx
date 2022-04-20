import { Link } from 'react-router-dom';
import { useState, MouseEvent } from 'react';

// Context
import { useAuth } from '../../../context/useAuthContext';

// MUI
import { Box, Button, Menu, MenuItem } from '@mui/material';

export default function AuthMenu(): JSX.Element {
  // Context
  const { loggedInUser, logout, picture } = useAuth();

  // State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const LinkStyle = {
    textDecoration: 'none!important',
    color: 'secondary.main',
  };

  return (
    <>
      <Button
        disableRipple
        onClick={handleClick}
        sx={{
          fontWeight: 700,
          fontSize: '0.9rem',
          color: 'black',
          '&:hover': {
            background: 'none',
          },
        }}
      >
        <Box
          component="img"
          src={picture}
          alt="Avatar"
          sx={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '100%',
            marginRight: '1rem',
          }}
        ></Box>
        {loggedInUser?.username}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose}>
          <Box sx={{ ...LinkStyle }} component={Link} to="/settings">
            Settings
          </Box>
        </MenuItem>
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
    </>
  );
}
