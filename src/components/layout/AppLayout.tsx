 
import { Outlet, useLocation } from 'react-router-dom';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Typography,
  Divider,
  Avatar,
  Stack
} from '@mui/material';
import {
  Home as HomeIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const drawerWidth = 280;

export default function AppLayout() {
  const location = useLocation();

  // navigation handled inline in render

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#FAFAFA',
          borderRight: '1px solid #E5E7EB'
        }
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Logo */}
        <Box sx={{ p: 3, borderBottom: '1px solid #E5E7EB' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1F2937' }}>
            Mini Task Manager
          </Typography>
        </Box>

        {/* Navigation */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <List sx={{ px: 1 }}>
            {[
              { text: 'Tasks', icon: <HomeIcon />, path: '/tasks', active: location.pathname.startsWith('/tasks') },
            ].map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={RouterLink}
                  to={item.path}
                  sx={{
                    borderRadius: '8px',
                    backgroundColor: item.active ? '#F3F4F6' : 'transparent',
                    borderLeft: item.active ? '3px solid #3B82F6' : '3px solid transparent',
                    '&:hover': { backgroundColor: item.active ? '#F3F4F6' : '#F9FAFB' }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: item.active ? '#3B82F6' : '#6B7280' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontWeight: item.active ? 600 : 400,
                        color: item.active ? '#1F2937' : '#6B7280',
                        fontSize: '0.875rem'
                      }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ mx: 2, my: 2 }} />

          {/* User Profile */}
          <Box sx={{ p: 2, borderTop: '1px solid #E5E7EB' }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ width: 32, height: 32, backgroundColor: '#3B82F6' }}>AT</Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#1F2937' }}>
                  Abhaya Trivedi
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  abhayatrivedi2005@gmail.com
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Drawer>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: '#F8FAFC',
          minHeight: '100vh'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}