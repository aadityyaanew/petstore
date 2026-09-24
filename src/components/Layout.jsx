import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';
import BottomNav from './BottomNav';

const Layout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, py: 4, pb: { xs: 8, md: 4 } }}>
        <Outlet />
      </Box>
      <Footer />
      <BottomNav />
    </Box>
  );
};

export default Layout;
