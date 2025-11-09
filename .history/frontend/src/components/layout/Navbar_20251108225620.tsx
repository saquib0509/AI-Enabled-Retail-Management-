import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  InputBase,
  Badge,
  useTheme,
  useMediaQuery,
  CircularProgress,
  alpha,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

interface BusinessSettings {
  companyName: string;
  ownerName: string;
  emailAddress: string;
}

const userNavigation = [
  { name: "Your Profile", href: "/settings" },
  { name: "Settings", href: "/settings" },
  { name: "Sign out", href: "#" },
];

const Navbar = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const navigate = useNavigate();

  useEffect(() => {
    fetchSettings();
    const interval = setInterval(fetchSettings, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get("/settings");
      setSettings(res.data);
    } catch {
      console.log("Settings not loaded");
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
    if (href === "#") {
      console.log("Logout clicked");
    } else {
      navigate(href);
    }
    handleClose();
  };

  return (
    <AppBar
      position="sticky"
      elevation={1}
      sx={{
        background: "linear-gradient(to right, #ffffff, #f8f9fb)",
        color: "text.primary",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar
        sx={{
          minHeight: 64,
          px: { xs: 2, sm: 3, md: 4 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Sidebar toggle (mobile only) */}
        {!isDesktop && (
          <IconButton edge="start" onClick={onMenuClick} sx={{ mr: 1 }}>
            <MenuIcon />
          </IconButton>
        )}

        Brand / Company Name
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            letterSpacing: 0.5,
            color: "#1a237e",
            minWidth: { xs: 120, md: 200 },
          }}
          noWrap
        >
          {!loading && settings ? settings.companyName : "PetrolPump AI"}
        </Typography>

        {/* Search Bar */}
        <Box
          sx={{
            flex: 1,
            mx: { xs: 2, sm: 4 },
            maxWidth: 400,
            position: "relative",
            borderRadius: 3,
            backgroundColor: alpha("#e0e0e0", 0.4),
            "&:hover": {
              backgroundColor: alpha("#cfd8dc", 0.6),
            },
            display: "flex",
            alignItems: "center",
            px: 2,
            height: 40,
          }}
        >
          <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
          <InputBase
            placeholder="Search transactions, products..."
            sx={{
              flex: 1,
              fontSize: 15,
              color: "text.primary",
            }}
            inputProps={{ "aria-label": "search" }}
          />
        </Box>

        {/* Notifications + Profile */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton color="inherit">
            <Badge badgeContent={1} color="error" overlap="circular">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <IconButton color="inherit" size="small" onClick={handleMenu}>
            {!loading && settings ? (
              <Avatar
                alt={settings.ownerName}
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: "#5c6bc0",
                  fontWeight: "bold",
                  fontSize: 15,
                }}
              >
                {settings.ownerName?.charAt(0) || "A"}
              </Avatar>
            ) : (
              <CircularProgress size={28} />
            )}
          </IconButton>

          {/* User Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              sx: {
                minWidth: 220,
                mt: 1.5,
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              },
            }}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Box sx={{ px: 2.5, pt: 2, pb: 1.2, borderBottom: "1px solid #eee" }}>
              <Typography fontWeight={700} fontSize={15}>
                {!loading && settings ? settings.ownerName : "Admin User"}
              </Typography>
              <Typography
                fontSize={13}
                color="text.secondary"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: 180,
                }}
              >
                {!loading && settings ? settings.emailAddress : "admin@example.com"}
              </Typography>
            </Box>
            {userNavigation.map(({ name, href }, idx) => (
              <MenuItem
                key={name}
                onClick={() => handleMenuItemClick(href)}
                sx={{
                  fontSize: 15,
                  color: idx === 2 ? "error.main" : "text.primary",
                  "&:hover": { backgroundColor: alpha("#5c6bc0", 0.1) },
                }}
              >
                {name}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
