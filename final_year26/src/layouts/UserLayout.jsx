
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/Header';
import { Sidebar } from '../components/shared/Sidebar';
import { Footer } from '../components/shared/Footer';

import { useAuth } from '../contexts/AuthContext';
import '../styles/UserRequested.css';
import '../styles/Layout.css';

const layoutVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

export function UserLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Open sidebar by default on desktop screens
  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setSidebarOpen(true);
    }
  }, []);
  const { user, logout } = useAuth();

  const handleMenuToggle = () => setSidebarOpen(!sidebarOpen);
  const handleLogout = () => {
    logout?.();
    setSidebarOpen(false);
  };





  return (
    <motion.div 
      className="app-layout"
      variants={layoutVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header at the top - full width */}
      <Header 
        user={user} 
        onLogout={handleLogout} 
        onMenuToggle={handleMenuToggle} 
      />
      

      {/* Main layout container */}
      <div className="app-layout-container">
        {/* Sidebar - full height on left side */}
        <Sidebar 
          user={user} 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
        
        {/* Main Content Area - adjusts based on sidebar */}
        <div className={`main-content-area ${sidebarOpen ? 'main-content-with-sidebar' : 'main-content-without-sidebar'}`}>
          <motion.main 
            className="content-area"
            variants={contentVariants}
          >
            {children}
          </motion.main>

          <Footer />
        </div>
      </div>
    </motion.div>
  );
}
