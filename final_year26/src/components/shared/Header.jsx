





import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Search, 
  Menu, 
  Home,
  Info,
  User,
  UserPlus,
  Bell,
  Settings,
  Calendar,
  Users,
  Building,
  LogOut,
  Eye
} from 'lucide-react';

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 }
};

const navLinkVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 }
};



const iconVariants = {
  initial: { rotate: 0, scale: 1 },
  hover: { 
    rotate: [0, -5, 5, -5, 0], 
    scale: 1.1,
    transition: { 
      rotate: { duration: 0.6, ease: "easeInOut" },
      scale: { duration: 0.2 }
    }
  },
  tap: { 
    rotate: 0, 
    scale: 0.9,
    transition: { duration: 0.1 }
  }
};

const toggleButtonVariants = {
  initial: { 
    rotateY: 0,
    boxShadow: "0 8px 30px var(--skyglow-color), inset 0 1px 0 rgba(255,255,255,0.6)"
  },
  hover: { 
    rotateY: 5,
    rotateX: 5,
    boxShadow: [
      "0 12px 40px var(--skyglow-color), inset 0 1px 0 rgba(255,255,255,0.8)",
      "0 8px 30px rgba(56,189,248,0.4), inset 0 1px 0 rgba(255,255,255,0.9)"
    ],
    transition: { 
      boxShadow: { duration: 0.6, repeat: Infinity, repeatType: "reverse" }
    }
  },
  tap: { 
    rotateY: 0,
    rotateX: 0,
    scale: 0.95,
    boxShadow: "0 4px 15px var(--skyglow-color), inset 0 1px 0 rgba(255,255,255,0.9)"
  }
};




export function Header({ user, onMenuToggle }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationCount] = useState(3); // Mock notification count
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardRoute = () => {
    if (!user?.role) return '/dashboard';
    
    switch (user.role.toUpperCase()) {
      case 'USER':
        return '/dashboard/user';
      case 'ORGANIZATION':
        return '/dashboard/organization';
      case 'ADMIN':
        return '/dashboard/admin';
      default:
        return '/dashboard';
    }
  };

  const renderRoleBasedNavigation = () => {
    if (!user?.role) return null;

    const navigationItems = [];

    // Common dashboard link
    navigationItems.push({
      icon: Home,
      label: 'Dashboard',
      path: getDashboardRoute(),
      key: 'dashboard'
    });

    // Role-specific navigation
    switch (user.role.toUpperCase()) {
      case 'USER':
        navigationItems.push(
          {
            icon: Eye,
            label: 'Inter Events',
            path: '/user/events',
            key: 'inter-events'
          },
          {
            icon: Users,
            label: 'Organizations',
            path: '/user/organizations',
            key: 'organizations'
          },
          {
            icon: Calendar,
            label: 'My Events',
            path: '/user/my-events',
            key: 'my-events'
          }
        );
        break;
        
      case 'ORGANIZATION':
        navigationItems.push(
          {
            icon: Calendar,
            label: 'Events',
            path: '/organizer/events',
            key: 'events'
          },
          {
            icon: Users,
            label: 'Members',
            path: '/organizer/members/requests',
            key: 'members'
          },
          {
            icon: Building,
            label: 'Organization',
            path: '/organizer/organization',
            key: 'organization'
          }
        );
        break;
        
      case 'ADMIN':
        navigationItems.push(
          {
            icon: Users,
            label: 'Users',
            path: '/admin/users',
            key: 'users'
          },
          {
            icon: Building,
            label: 'Organizations',
            path: '/admin/organizations',
            key: 'admin-organizations'
          }
        );
        break;
    }

    return navigationItems;
  };

  return (
    <motion.header 
      className="header-professional"
      initial="hidden"
      animate="visible"
      variants={headerVariants}
      transition={{ duration: 0.3 }}
    >
      <div className="header-professional-content">
        {/* Left Section */}
        <div className="header-left">
          {/* Sidebar Toggle Button */}
          <motion.button
            onClick={onMenuToggle}
            className="sidebar-toggle-btn user-requested-style"
            variants={toggleButtonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            aria-label="Toggle sidebar"
          >
            <motion.div variants={iconVariants} initial="initial" whileHover="hover" whileTap="tap">
              <Menu className="w-5 h-5" />
            </motion.div>
          </motion.button>

          {/* Logo */}
          <motion.div 
            className="logo-section"
            whileHover={{ scale: 1.05 }}
          >
            <div className="logo-icon">
              SS
            </div>
            <span className="logo-text">SkillSphere</span>
          </motion.div>
        </div>




        {/* Center Section - Navigation */}
        <div className="header-center">
          <nav className="header-nav">
            <motion.button 
              onClick={() => navigate('/')}
              className="nav-link"
              variants={navLinkVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <Home className="w-4 h-4" />
              Home
            </motion.button>
            <motion.button 
              onClick={() => navigate('/about')}
              className="nav-link"
              variants={navLinkVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
              whileHover="hover"
            >
              <Info className="w-4 h-4" />
              About
            </motion.button>
            
            {/* Role-based navigation items */}
            {renderRoleBasedNavigation()?.map((item, index) => (
              <motion.button 
                key={item.key}
                onClick={() => navigate(item.path)}
                className="nav-link"
                variants={navLinkVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1 + (index * 0.05) }}
                whileHover="hover"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </motion.button>
            ))}
          </nav>
        </div>

        {/* Right Section */}
        <div className="header-right">
          {/* Search Bar */}
          <div className="search-container">
            <Search className="search-icon w-4 h-4" />
            <input
              type="text"
              placeholder="Search events, organizations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Auth/Profile Controls */}
          {!user ? (

            <div className="auth-buttons">
              <motion.button 
                className="btn btn-outline"
                onClick={handleLogin}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <User className="w-4 h-4" />
                Login
              </motion.button>
              
              <motion.button 
                className="btn btn-primary"
                onClick={handleRegister}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <UserPlus className="w-4 h-4" />
                Register
              </motion.button>
            </div>
          ) : (
            <div className="profile-controls">
              {/* Notifications */}
              <motion.button 
                className="icon-button notification-btn"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="notification-badge">{notificationCount}</span>
                )}
              </motion.button>

              {/* Settings */}
              <motion.button 
                className="icon-button settings-btn"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" />
              </motion.button>


              {/* User Profile */}
              <div className="user-profile">
                <div className="user-avatar">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="user-info">
                  <span className="user-name">
                    {user?.name || 'User'}
                  </span>
                  <span className="user-role">
                    {user?.role === 'user' ? 'USER' : user?.role || 'USER'}
                  </span>
                </div>
                {/* Logout Button */}
                <motion.button 
                  onClick={handleLogout}
                  className="logout-btn"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Logout"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
