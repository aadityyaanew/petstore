import { BottomNavigation, BottomNavigationAction, Paper, Badge } from '@mui/material';
import { Home, Storefront, ShoppingCart, Person } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useCart();
  const { user } = useAuth();
  const [value, setValue] = useState(0);

  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setValue(0);
    else if (path.startsWith('/products') || path.startsWith('/product/')) setValue(1);
    else if (path === '/cart' || path === '/checkout') setValue(2);
    else if (path === '/profile' || path === '/login' || path === '/orders') setValue(3);
    else setValue(-1);
  }, [location.pathname]);

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1000, 
        display: { xs: 'block', md: 'none' } 
      }} 
      elevation={4}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          if (newValue === 0) navigate('/');
          if (newValue === 1) navigate('/products');
          if (newValue === 2) navigate('/cart');
          if (newValue === 3) navigate(user ? '/profile' : '/login');
        }}
        sx={{
          pb: 'env(safe-area-inset-bottom)',
          height: 'calc(56px + env(safe-area-inset-bottom))',
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            padding: '6px 0',
          },
          '& .Mui-selected': {
            color: 'primary.main',
          }
        }}
      >
        <BottomNavigationAction label="Home" icon={<Home />} />
        <BottomNavigationAction label="Shop" icon={<Storefront />} />
        <BottomNavigationAction 
          label="Cart" 
          icon={
            <Badge badgeContent={cart?.items?.length || 0} color="secondary" sx={{ '& .MuiBadge-badge': { fontWeight: 600 } }}>
              <ShoppingCart />
            </Badge>
          } 
        />
        <BottomNavigationAction label="Profile" icon={<Person />} />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNav;
