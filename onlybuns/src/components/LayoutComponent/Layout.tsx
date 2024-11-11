// Layout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../NavbarComponent/Navbar';

const Layout: React.FC = () => {
  return (
    <div>
      {/* The Navbar is always displayed */}
      <Navbar />
      {/* This is where the rest of your routed components will be displayed */}
      <div style={{ padding: '20px' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
