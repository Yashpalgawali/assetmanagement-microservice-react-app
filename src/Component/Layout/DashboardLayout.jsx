import { useState } from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItemText,
  CssBaseline,
  ListItemButton,
  ListItemIcon,
  Avatar,
  Tooltip,
  useTheme,
  alpha,
  Divider,
  Badge
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import DevicesIcon from "@mui/icons-material/Devices";
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import Groups3Icon from '@mui/icons-material/Groups3';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CategoryIcon from '@mui/icons-material/Category';
import LocalPostOfficeIcon from '@mui/icons-material/LocalPostOffice';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';

import { useAuth } from "../Security/authContext";

const drawerWidth = 260; // Increased for better readability

function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const authContext = useAuth();

  function logout() {
    authContext.logout();
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { text: "Company", icon: <BusinessIcon />, path: "/viewcompanies" },
    { text: "Department", icon: <CorporateFareIcon />, path: "/viewdepartments" },
    { text: "Asset Type", icon: <CategoryIcon />, path: "/viewassettypes" },
    { text: "Assets", icon: <DevicesIcon />, path: "/viewassets" },
    { text: "Designation", icon: <LocalPostOfficeIcon />, path: "/viewdesignations" },
    { text: "Employees", icon: <Groups3Icon />, path: "/viewemployees" },
    { text: "Assigned Assets", icon: <AssignmentTurnedInIcon />, path: "/viewassignedassets" },
  ];

  const drawer = (
    <Box sx={{
      height: '100%',
      background: 'linear-gradient(180deg, #111827 0%, #1f2937 100%)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar
          sx={{
            bgcolor: theme.palette.primary.main,
            width: 40,
            height: 40,
            boxShadow: '0 0 20px rgba(37, 99, 235, 0.4)'
          }}
        >
          AMS
        </Avatar>
        <Typography variant="h6" fontWeight="bold" sx={{ letterSpacing: 1 }}>
          AMS Pro
        </Typography>
      </Box>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 2 }} />

      <List sx={{ px: 2, flexGrow: 1 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path.split('/')[1]));

          return (
            <ListItemButton
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: '12px',
                mb: 1,
                py: 1.2,
                transition: 'all 0.3s',
                backgroundColor: isActive ? alpha(theme.palette.primary.main, 0.15) : 'transparent',
                color: isActive ? theme.palette.primary.light : 'rgba(255,255,255,0.7)',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: 'white',
                  transform: 'translateX(4px)'
                },
                '&::after': isActive ? {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: '20%',
                  height: '60%',
                  width: '4px',
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: '0 4px 4px 0',
                  boxShadow: '0 0 10px rgba(37, 99, 235, 0.8)'
                } : {}
              }}
            >
              <ListItemIcon sx={{
                color: isActive ? theme.palette.primary.light : 'inherit',
                minWidth: 40
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                slotProps={{
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 'bold' : 'medium'
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ p: 2, mt: 'auto' }}>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 2 }} />
        <ListItemButton
          onClick={() => { navigate('/change/password'); setMobileOpen(false); }}
          sx={{
            borderRadius: '16px', py: 1.5, mb: 1, color: '#9ca3af',
            '&:hover': { bgcolor: alpha('#ffffff', 0.05), color: '#ffffff' }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}><SettingsIcon /></ListItemIcon>
          <ListItemText primary="Change Password" primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 600 }} />
        </ListItemButton>
        <ListItemButton
          onClick={logout}
          sx={{
            borderRadius: '12px',
            color: '#ef4444',
            '&:hover': { bgcolor: alpha('#ef4444', 0.1) }
          }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 'bold' }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <CssBaseline />

      {/* Glassmorphism Top Navbar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: alpha('#ffffff', 0.8),
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid',
          borderColor: alpha(theme.palette.divider, 0.1),
          color: theme.palette.text.primary
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="subtitle1" fontWeight="600" color="text.secondary">
              Welcome back, Administrator
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Notifications">
              <IconButton size="small">
                <Badge variant="dot" color="error">
                  <NotificationsIcon sx={{ color: 'text.secondary' }} />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Settings">
              <IconButton size="small">
                <SettingsIcon sx={{ color: 'text.secondary' }} />
              </IconButton>
            </Tooltip>
            <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 1.5 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
              <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
                <Typography variant="body2" fontWeight="bold">Admin User</Typography>
                <Typography variant="caption" color="text.secondary">Super Admin</Typography>
              </Box>
              <Avatar
                sx={{
                  width: 35,
                  height: 35,
                  bgcolor: theme.palette.primary.main,
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                AD
              </Avatar>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Navigation */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              border: 'none'
            }
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              border: 'none',
              boxShadow: '4px 0 24px rgba(0,0,0,0.05)'
            }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Toolbar /> {/* Spacer for fixed header */}
        <Box sx={{ flexGrow: 1 }}>
          {children}
        </Box>

        <Box sx={{ p: 2, textAlign: 'center', mt: 'auto' }}>
          <Typography variant="caption" color="text.secondary">
            © 2026 Asset Management System Pro • All rights reserved
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default DashboardLayout;
