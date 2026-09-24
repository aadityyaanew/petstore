import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { Dashboard, ShoppingCart, People, Inventory, Storefront, LocalOffer, ViewCarousel } from '@mui/icons-material';
import { Link, Outlet, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const AdminLayout = () => {
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/admin' },
    { text: 'Products', icon: <Inventory />, path: '/admin/products' },
    { text: 'Orders', icon: <ShoppingCart />, path: '/admin/orders' },
    { text: 'Users', icon: <People />, path: '/admin/users' },
    { text: 'Coupons', icon: <LocalOffer />, path: '/admin/coupons' },
    { text: 'Banners', icon: <ViewCarousel />, path: '/admin/banners' },
    { text: 'Back to Store', icon: <Storefront />, path: '/' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: 'background.paper',
            borderRight: '1px solid rgba(0,0,0,0.08)',
          },
        }}
      >
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Storefront color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>
            ADMIN
          </Typography>
        </Box>
        <List sx={{ px: 2 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path) && item.path !== '/');
            return (
              <ListItem
                button
                component={Link}
                to={item.path}
                key={item.text}
                sx={{
                  borderRadius: '8px',
                  mb: 1,
                  bgcolor: isActive ? 'primary.50' : 'transparent',
                  color: isActive ? 'primary.main' : 'text.secondary',
                  '&:hover': {
                    bgcolor: isActive ? 'primary.50' : 'action.hover',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.95rem'
                  }} 
                />
              </ListItem>
            );
          })}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 4, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
