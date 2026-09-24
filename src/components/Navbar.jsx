import { AppBar, Toolbar, Typography, Button, IconButton, Badge, Box, Container, Menu, MenuItem, Avatar, Drawer, List, ListItem, ListItemText, Divider, InputBase, alpha } from '@mui/material';
import { ShoppingCart, Storefront, Person, Menu as MenuIcon, Search, GetApp } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isInstallable, installPWA } = usePWAInstall();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2, fontWeight: 800, color: 'primary.main', textDecoration: 'none' }} component={Link} to="/" onClick={handleDrawerToggle}>
        LUXE
      </Typography>
      <Divider />
      <Box sx={{ px: 2, py: 2 }}>
        <form onSubmit={(e) => { handleSearchSubmit(e); handleDrawerToggle(); }}>
          <Box sx={{ 
            display: 'flex', alignItems: 'center', bgcolor: alpha('#000', 0.05),
            borderRadius: '8px', px: 2, py: 1
          }}>
            <Search sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
            <InputBase 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ ml: 1, flex: 1, fontSize: '0.9rem' }} 
            />
          </Box>
        </form>
      </Box>
      <List>
        <ListItem button component={Link} to="/" sx={{ color: 'text.primary', textDecoration: 'none' }}>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={Link} to="/products" sx={{ color: 'text.primary', textDecoration: 'none' }}>
          <ListItemText primary="Shop" />
        </ListItem>
        <ListItem button component={Link} to="/about" sx={{ color: 'text.primary', textDecoration: 'none' }}>
          <ListItemText primary="About" />
        </ListItem>
        <ListItem button component={Link} to="/contact" sx={{ color: 'text.primary', textDecoration: 'none' }}>
          <ListItemText primary="Contact" />
        </ListItem>
        {!user && (
          <ListItem button component={Link} to="/login" sx={{ color: 'primary.main', textDecoration: 'none' }}>
            <ListItemText primary="Sign In" />
          </ListItem>
        )}
      </List>
    </Box>
  );

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'white', color: 'text.primary', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {/* Mobile Menu Icon */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo Section */}
          <Box 
            component={Link} 
            to="/" 
            sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit', gap: 1 }}
          >
            <Storefront color="primary" sx={{ fontSize: 32 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.03em', color: 'primary.main' }}>
              LUXE
            </Typography>
          </Box>

          {/* Navigation Links (Desktop) */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4 }}>
            <Button component={Link} to="/" color="inherit" sx={{ fontWeight: 600 }}>Home</Button>
            <Button component={Link} to="/products" color="inherit" sx={{ fontWeight: 600 }}>Shop</Button>
            <Button component={Link} to="/about" color="inherit" sx={{ fontWeight: 600 }}>About</Button>
            <Button component={Link} to="/contact" color="inherit" sx={{ fontWeight: 600 }}>Contact</Button>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
            {isInstallable && (
              <>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  startIcon={<GetApp />} 
                  onClick={installPWA}
                  size="small"
                  sx={{ 
                    display: { xs: 'none', sm: 'flex' }, 
                    borderRadius: '20px', 
                    textTransform: 'none', 
                    fontWeight: 700,
                    borderWidth: 2,
                    whiteSpace: 'nowrap'
                  }}
                >
                  Install App
                </Button>
                <IconButton 
                  color="primary" 
                  onClick={installPWA} 
                  sx={{ display: { xs: 'flex', sm: 'none' }, bgcolor: alpha('#1976d2', 0.1) }}
                >
                  <GetApp />
                </IconButton>
              </>
            )}

            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <form onSubmit={handleSearchSubmit}>
                <Box sx={{ 
                  display: 'flex', alignItems: 'center', bgcolor: alpha('#000', 0.05),
                  borderRadius: '8px', px: 2, py: 0.5
                }}>
                  <Search sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                  <InputBase 
                    placeholder="Search products..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ ml: 1, flex: 1, fontSize: '0.9rem', width: 'auto' }} 
                  />
                </Box>
              </form>
            </Box>
            
            <IconButton color="inherit" onClick={() => navigate('/cart')}>
              <Badge badgeContent={cart?.items?.length || 0} color="secondary" sx={{ '& .MuiBadge-badge': { fontWeight: 700 } }}>
                <ShoppingCart />
              </Badge>
            </IconButton>
            
            {user ? (
              <>
                <IconButton onClick={handleMenu} color="primary" sx={{ display: { xs: 'none', sm: 'flex' } }}>
                  <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32, fontSize: '1rem' }}>
                    {user.name ? user.name.charAt(0).toUpperCase() : <Person />}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  PaperProps={{ sx: { mt: 1, minWidth: 150, borderRadius: '12px' } }}
                >
                  <MenuItem onClick={() => { handleClose(); navigate('/profile'); }} sx={{ fontWeight: 600 }}>Profile</MenuItem>
                  <MenuItem onClick={() => { handleClose(); navigate('/orders'); }} sx={{ fontWeight: 600 }}>My Orders</MenuItem>
                  {user.role === 'admin' && (
                    <MenuItem onClick={() => { handleClose(); navigate('/admin'); }} sx={{ fontWeight: 600, color: 'primary.main' }}>Admin Dashboard</MenuItem>
                  )}
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main', fontWeight: 600 }}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Button component={Link} to="/login" variant="contained" color="primary" sx={{ display: { xs: 'none', sm: 'block' }, borderRadius: '8px' }}>
                Sign In
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
      
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
