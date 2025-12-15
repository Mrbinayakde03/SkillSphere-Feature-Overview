
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Users, 
  BarChart3, 
  Building, 
  Settings, 
  User,
  LogOut,
  ChevronLeft,
  Heart,
  Star,
  Target,
  Zap
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';



const sidebarVariants = {
  open: {
    opacity: 1,
    x: 0,
    rotateY: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
      duration: 0.6
    }
  },
  closed: {
    opacity: 0,
    x: "-100%",
    rotateY: -15,
    scale: 0.8,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
      duration: 0.6
    }
  }
};


const navItemVariants = {
  hidden: { opacity: 0, x: -20, rotateY: -10 },
  visible: { 
    opacity: 1, 
    x: 0,
    rotateY: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

const navItemHover = {
  hover: {
    x: 8,
    rotateY: 5,
    rotateX: 2,
    scale: 1.02,
    boxShadow: "0 10px 25px rgba(56,189,248,0.15)",
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

const iconVariants = {
  initial: { rotate: 0, scale: 1 },
  hover: { 
    rotate: [0, -10, 10, -5, 0], 
    scale: 1.15,
    transition: { duration: 0.5, ease: "easeInOut" }
  }
};


export function Sidebar({ user, isOpen, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const getNavigationItems = () => {
    // Navigation based on user role

    if (user?.role && user.role.toLowerCase() === 'user') {
      return [
        { 
          icon: Home, 
          label: 'Dashboard', 
          href: '/dashboard',
          description: 'Your dashboard'
        },
        { 
          icon: Calendar, 
          label: 'Events', 
          href: '/user/events',
          description: 'Browse all events'
        },
        { 
          icon: Star, 
          label: 'Recommended', 
          href: '/user/recommended',
          description: 'AI-powered recommendations'
        },
        { 
          icon: User, 
          label: 'Profile', 
          href: '/user/profile',
          description: 'Manage your profile'
        }
      ];

    } else if (user?.role && user.role.toLowerCase() === 'organization') {
      return [
        { 
          icon: Home, 
          label: 'Dashboard', 
          href: '/dashboard',
          description: 'Organization dashboard'
        },
        { 
          icon: Calendar, 
          label: 'Events', 
          href: '/organizer/events',
          description: 'Manage events'
        },
        { 
          icon: Users, 
          label: 'Members', 
          href: '/organizer/members/requests',
          description: 'Membership requests'
        },


        { 
          icon: Calendar, 
          label: 'Create Event', 
          href: '/organizer/events?action=create',
          description: 'Organize new events'
        }
      ];
    } else {
      // Default navigation for other roles
      return [
        { 
          icon: Home, 
          label: 'Dashboard', 
          href: '/dashboard',
          description: 'Main dashboard'
        },
        { 
          icon: User, 
          label: 'Profile', 
          href: '/user/profile',
          description: 'Manage your profile'
        }
      ];
    }
  };




  const navigationItems = getNavigationItems();

  const handleLogout = () => {
    logout?.();
    onClose?.();
  };

  return (
    <>

      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          className="sidebar-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        style={{ 
          transformStyle: 'preserve-3d',
          perspective: '1000px',
          transformOrigin: 'left center'
        }}
      >
        <div className="sidebar-content">

          {/* Header */}
          <div className="sidebar-header">
            <div className="sidebar-user-info">
              <div className="sidebar-avatar">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="sidebar-user-details">
                <p className="sidebar-user-name">
                  {user?.name || 'User'}
                </p>
                <p className="sidebar-user-role">
                  {user?.role || 'user'}
                </p>
              </div>
            </div>
          </div>


          {/* Navigation */}
          <nav className="sidebar-nav">
            <div className="sidebar-nav-items">

              {navigationItems.map((item, index) => (

                <motion.button
                  key={item.href}
                  className="sidebar-nav-item"
                  variants={navItemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                  whileHover="hover"
                  onClick={() => {
                    navigate(item.href);
                    onClose?.();
                  }}
                  style={{ 
                    transformStyle: 'preserve-3d',
                    perspective: '1000px'
                  }}
                >
                  <motion.div
                    className="sidebar-nav-icon"
                    variants={iconVariants}
                    initial="initial"
                    whileHover="hover"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <item.icon className="sidebar-icon" />
                  </motion.div>
                  <div className="sidebar-nav-content">
                    <div className="sidebar-nav-label">
                      {item.label}
                    </div>
                    <div className="sidebar-nav-description">
                      {item.description}
                    </div>
                  </div>

                  <motion.div
                    className="sidebar-nav-indicator"
                    initial={{ scale: 0, rotateZ: 0 }}
                    whileHover={{ 
                      scale: [1, 1.5, 1],
                      rotateZ: [0, 180, 360],
                      transition: { duration: 0.6 }
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              ))}
            </div>

            {/* Special Features for Students */}
            {user?.role === 'student' && (
              <motion.div
                className="sidebar-features-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="sidebar-features-header">
                  <Zap className="sidebar-features-icon" />
                  <span className="sidebar-features-title">AI Powered</span>
                </div>
                <p className="sidebar-features-description">
                  Get personalized event recommendations based on your skills and interests.
                </p>
              </motion.div>
            )}
          </nav>


          {/* Footer */}
          <div className="sidebar-footer">
            <motion.button
              onClick={handleLogout}
              className="sidebar-logout-btn"
              whileHover="hover"
            >
              <LogOut className="sidebar-logout-icon" />
              <span className="sidebar-logout-text">Logout</span>
            </motion.button>
          </div>
        </div>

        {/* Close Button for Mobile */}
        <motion.button
          onClick={onClose}
          className="sidebar-close-btn"
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="sidebar-close-icon" />
        </motion.button>
      </motion.aside>
    </>
  );
}
