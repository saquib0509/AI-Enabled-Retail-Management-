import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Box, Typography, IconButton, Avatar, Menu, MenuItem,
  InputBase, Badge, useTheme, useMediaQuery, CircularProgress
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

interface BusinessSettings {
  companyName: string;
  ownerName: string;
  emailAddress: string;
}

const userNavigation = [
  { name: 'Your Profile', href: '/settings' },
  { name: 'Settings', href: '/settings' },
  { name: 'Sign out', href: '#' },
];

const Navbar = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const navigate = useNavigate();

  useEffect(() => {
    fetchSettings();
    const interval = setInterval(fetchSettings, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      setSettings(res.data);
    } catch (error) {
      console.log('Settings not loaded');
    } finally {
      setLoading(false);
    }
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (href: string) => {
    if (href === '#') {
      console.log('Logout clicked');
    } else {
      navigate(href);
    }
    handleClose();
  };

  return (
    <Toolbar sx={{ minHeight: 56, px: { xs: 2, sm: 3, md: 4 }, width: '100%' }} disableGutters>
      {/* Sidebar menu icon for mobile */}
      {!isDesktop && (
        <IconButton edge="start" color="inherit" onClick={onMenuClick} sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
      )}

      {/* Brand name - Show Company Name */}
      <Typography
        variant="h6"
        color="text.primary"
        sx={{ fontWeight: 700, letterSpacing: 1, mr: 3, minWidth: 150 }}
        noWrap
      >
        {!loading && settings ? settings.companyName : 'PetrolPump AI'}
      </Typography>

      {/* Search box */}
      <Box sx={{ flex: 1, mx: { xs: 2, sm: 3 }, maxWidth: 350 }}>
        <InputBase
          placeholder="Search transactions, products..."
          sx={{ ml: 1, flex: 1, fontSize: 15, color: 'inherit' }}
          inputProps={{ 'aria-label': 'search' }}
        />
      </Box>

      {/* Notification Icon & User Avatar with menu */}
      <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, gap: 1 }}>
        <IconButton color="inherit">
          <Badge badgeContent={1} color="error" overlap="circular">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        <IconButton color="inherit" size="small" sx={{ ml: 1 }} onClick={handleMenu}>
          {!loading && settings ? (
            <Avatar
              alt={settings.ownerName}
              sx={{
                width: 34,
                height: 34,
                bgcolor: '#667eea',
                fontWeight: 'bold',
              }}
            >
              {settings.ownerName?.charAt(0) || 'A'}
            </Avatar>
          ) : (
            <CircularProgress size={34} />
          )}
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{ sx: { minWidth: 200, borderRadius: 2, mt: 1 } }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Box sx={{ px: 2.2, pt: 2, pb: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography fontWeight={700} fontSize={15}>
              {!loading && settings ? settings.ownerName : 'Admin User'}
            </Typography>
            <Typography
              fontSize={13}
              color="text.secondary"
              sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {!loading && settings ? settings.emailAddress : 'admin@example.com'}
            </Typography>
          </Box>
          {userNavigation.map(({ name, href }, idx) => (
            <MenuItem
              key={name}
              onClick={() => handleMenuItemClick(href)}
              sx={{ color: idx === 2 ? 'error.main' : 'text.primary' }}
            >
              {name}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </Toolbar>
  );
};

export default Navbar;
