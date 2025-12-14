import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Bell, 
  User, 
  LogOut, 
  Menu, 
  Settings, 
  ChevronDown,
  Home,
  Calendar,
  Users,
  BarChart3,
  Building
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const motionVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const dropdownVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -10 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { duration: 0.2 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: -10,
    transition: { duration: 0.15 }
  }
};

const iconVariants = {
  initial: { rotate: 0 },
  hover: { rotate: 10, scale: 1.1 }
};

export function Header({ user, onLogout, onMenuToggle }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { logout } = useAuth();

  const getNavigationItems = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { icon: Home, label: 'Dashboard', href: '/dashboard' },
          { icon: Users, label: 'Users', href: '/admin/users' },
          { icon: Building, label: 'Organizations', href: '/admin/organizations' },
          { icon: BarChart3, label: 'Analytics', href: '/dashboard' }
        ];
      case 'organizer':
        return [
          { icon: Home, label: 'Dashboard', href: '/dashboard' },
          { icon: Calendar, label: 'Events', href: '/organizer/events' },
          { icon: Users, label: 'Members', href: '/organizer/members/requests' }
        ];
      case 'student':
      default:
        return [
          { icon: Home, label: 'Dashboard', href: '/dashboard' },
          { icon: Calendar, label: 'Events', href: '/user/events' },
          { icon: Users, label: 'Recommended', href: '/user/recommended' }
        ];
    }
  };

  const navigationItems = getNavigationItems();

  const handleLogout = () => {
    setShowProfileMenu(false);
    logout?.();
    onLogout?.();
  };

  return (
    <motion.header 
      className="header glass"
      initial="hidden"
      animate="visible"
      variants={motionVariants}
      transition={{ duration: 0.3 }}
    >
      <div className="header-content">
        {/* Left Section */}
        <div className="header-left">
          <motion.button
            onClick={onMenuToggle}
            className="header-button"
            whileHover="hover"
            initial="initial"
            variants={iconVariants}
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </motion.button>

          {/* Logo */}
          <motion.a 
            href="/dashboard" 
            className="header-logo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div 
              className="logo-icon"
              animate={{ 
                boxShadow: [
                  '0 0 20px rgba(0, 255, 255, 0.3)',
                  '0 0 30px rgba(139, 92, 246, 0.3)',
                  '0 0 20px rgba(0, 255, 255, 0.3)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              SS
            </motion.div>
            <span className="hidden sm:inline text-gradient">SkillSphere</span>
          </motion.a>

          {/* Navigation Links - Desktop */}
          <nav className="hidden lg:flex items-center space-x-1 ml-6">
            {navigationItems.map((item) => (
              <motion.a
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors"
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </motion.a>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="header-search">
            <Search className="search-icon w-4 h-4" />
            <input
              type="text"
              placeholder="Search events, organizations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="header-right">
          {/* Notifications */}
          <motion.button 
            className="header-button relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Bell className="w-5 h-5" />
            <motion.span 
              className="notification-badge"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button>

          {/* Profile Dropdown */}
          <div className="profile-dropdown">
            <motion.button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="profile-button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="profile-avatar">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="hidden sm:inline text-sm font-medium text-text-primary">
                {user?.name || 'User'}
              </span>
              <ChevronDown 
                className={`w-4 h-4 text-text-secondary transition-transform ${
                  showProfileMenu ? 'rotate-180' : ''
                }`} 
              />
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  className="dropdown-menu"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={dropdownVariants}
                >
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-border-primary">
                    <p className="text-sm font-medium text-text-primary">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs text-text-secondary capitalize">
                      {user?.role || 'user'}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <motion.a
                    href="/user/profile"
                    className="dropdown-item"
                    onClick={() => setShowProfileMenu(false)}
                    whileHover={{ x: 4 }}
                  >
                    <User className="w-4 h-4" />
                    Profile Settings
                  </motion.a>

                  <motion.a
                    href="/settings"
                    className="dropdown-item"
                    onClick={() => setShowProfileMenu(false)}
                    whileHover={{ x: 4 }}
                  >
                    <Settings className="w-4 h-4" />
                    Preferences
                  </motion.a>

                  <div className="dropdown-separator" />

                  <motion.button
                    onClick={handleLogout}
                    className="dropdown-item w-full text-left text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    whileHover={{ x: 4 }}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
