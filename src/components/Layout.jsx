import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import BottomNav from './BottomNav';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 py-0">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};

export default Layout;
