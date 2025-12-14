import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/shared/Header';
import { Sidebar } from '../components/shared/Sidebar';
import { Footer } from '../components/shared/Footer';
import { useAuth } from '../contexts/AuthContext';

const layoutVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  }
};

export function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleMenuToggle = () => {
    setSidebarOpen(prev => !prev);
  };

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
      <Sidebar
        user={user}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="main-content">
        <Header
          user={user}
          onLogout={handleLogout}
          onMenuToggle={handleMenuToggle}
        />

        <motion.main
          className="content-area"
          variants={contentVariants}
        >
          {children}
        </motion.main>

        <Footer />
      </div>
    </motion.div>
  );
}
