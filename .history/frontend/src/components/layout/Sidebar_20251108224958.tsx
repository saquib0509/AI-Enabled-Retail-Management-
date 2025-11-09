import { useState, useEffect } from 'react';
import {
  Drawer, Toolbar, Box, Typography, List, ListItemButton, ListItemIcon, ListItemText,
  Avatar, Divider, Paper, Stack, CircularProgress
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ArticleIcon from '@mui/icons-material/Article';
import InventoryIcon from '@mui/icons-material/Inventory2';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { Link, useLocation } from 'react-router-dom';
import type { DrawerProps } from '@mui/material';
import api from '../../services/api';

interface BusinessSettings {
  companyName: string;
  ownerName: string;
  businessAddress: string;
  gstNumber: string;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: <HomeIcon /> },
  { name: 'Daily Entries', href: '/entries', icon: <ArticleIcon /> },
  { name: 'Products', href: '/products', icon: <InventoryIcon /> },
  { name: 'Employees', href: '/employees', icon: <PeopleIcon /> },
  { name: 'Reports', href: '/reports', icon: <BarChartIcon /> },
  { name: 'Challans', href: '/challans', icon: <LocalShippingIcon /> },
  { name: 'Settings', href: '/settings', icon: <SettingsIcon /> },
];

type SidebarProps = {
  variant: DrawerProps['variant'];
  open: boolean;
  onClose: () => void;
  drawerWidth?: number;
};

const Sidebar = ({ variant, open, onClose, drawerWidth }: SidebarProps) => {
  const location = useLocation();
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);

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

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Brand/Logo */}
      <Toolbar sx={{ px: 3, py: 3 }}>
        <Typography variant="h6" fontWeight={800} color="primary" sx={{ letterSpacing: 1 }}>
          PetrolPump AI
        </Typography>
      </Toolbar>
      <Divider />

     

      {/* Navigation */}
      <List sx={{ flex: 1, py: 0 }}>
        {navigation.map((item) => (
          <ListItemButton
            key={item.name}
            component={Link}
            to={item.href}
            selected={location.pathname === item.href}
            sx={{ borderRadius: 2, mx: 1, mb: 1 }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.name} sx={{ '& .MuiTypography-root': { fontWeight: 500 } }} />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ mb: 1, mt: 1, px: 2 }}>
        <Divider />
      </Box>

      {/* User Info */}
      {!loading && settings && (
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, pb: 3 }}>
          <Avatar
            alt={settings.ownerName}
            sx={{
              width: 40,
              height: 40,
              mr: 1.5,
              bgcolor: '#667eea',
              fontWeight: 'bold',
            }}
          >
            {settings.ownerName?.charAt(0) || 'A'}
          </Avatar>
          <Box>
            <Typography fontWeight={600} fontSize={15}>
              {settings.ownerName || 'Admin'}
            </Typography>
            <Typography color="text.secondary" fontSize={13} noWrap width={130}>
              {settings.businessAddress?.slice(0, 20) || 'Business'}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          borderRight: 0,
          pb: 0,
          pt: 0,
        },
      }}
      ModalProps={{ keepMounted: true }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
