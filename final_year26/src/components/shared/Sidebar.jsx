import React from 'react';
import { motion } from 'framer-motion';
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
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  closed: {
    x: "-100%",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
};

const navItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3 }
  }
};

const navItemHover = {
  hover: {
    x: 8,
    scale: 1.02,
    transition: { duration: 0.2 }
  }
};

const iconVariants = {
  initial: { rotate: 0 },
  hover: { 
    rotate: 10, 
    scale: 1.1,
    transition: { duration: 0.2 }
  }
};

export function Sidebar({ user, isOpen, onClose }) {
  const { logout } = useAuth();

  const getNavigationItems = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { 
            icon: Home, 
            label: 'Dashboard', 
            href: '/dashboard',
            description: 'Overview & analytics'
          },
          { 
            icon: Users, 
            label: 'Users', 
            href: '/admin/users',
            description: 'Manage user accounts'
          },
          { 
            icon: Building, 
            label: 'Organizations', 
            href: '/admin/organizations',
            description: 'Organization management'
          },
          { 
            icon: BarChart3, 
            label: 'Analytics', 
            href: '/dashboard',
            description: 'System insights'
          }
        ];
      case 'organizer':
        return [
          { 
            icon: Home, 
            label: 'Dashboard', 
            href: '/dashboard',
            description: 'Your overview'
          },
          { 
            icon: Calendar, 
            label: 'Events', 
            href: '/organizer/events',
            description: 'Manage your events'
          },
          { 
            icon: Users, 
            label: 'Members', 
            href: '/organizer/members/requests',
            description: 'Member requests'
          },
          { 
            icon: Target, 
            label: 'Analytics', 
            href: '/dashboard',
            description: 'Event performance'
          }
        ];
      case 'student':
      default:
        return [
          { 
            icon: Home, 
            label: 'Dashboard', 
            href: '/dashboard',
            description: 'Your personalized feed'
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
            description: 'AI-powered suggestions'
          },
          { 
            icon: Heart, 
            label: 'My Events', 
            href: '/user/my-events',
            description: 'Your registrations'
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

  const getRoleColor = () => {
    switch (user?.role) {
      case 'admin':
        return 'from-red-500 to-pink-500';
      case 'organizer':
        return 'from-blue-500 to-cyan-500';
      case 'student':
      default:
        return 'from-green-500 to-emerald-500';
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
          className="fixed inset-0 bg-white/10 backdrop-blur-sm z-40 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        className={`sidebar glass fixed lg:relative z-50 lg:z-30`}
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
      >
        <div className="sidebar-content">
          {/* Header */}
          <div className="px-6 py-4 border-b border-border-primary">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${getRoleColor()} rounded-xl flex items-center justify-center text-text-primary font-bold text-lg shadow-lg`}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-text-secondary capitalize">
                  {user?.role || 'user'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="sidebar-nav">
            <div className="space-y-2 mt-6">
              {navigationItems.map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  className="nav-item group"
                  variants={navItemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                  whileHover="hover"
                  onClick={() => onClose?.()}
                >
                  <motion.div
                    className="nav-icon"
                    variants={iconVariants}
                    initial="initial"
                  >
                    <item.icon className="w-5 h-5" />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-text-primary">
                      {item.label}
                    </div>
                    <div className="text-xs text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.description}
                    </div>
                  </div>
                  <motion.div
                    className="w-2 h-2 bg-neon-cyan rounded-full opacity-0 group-hover:opacity-100"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.a>
              ))}
            </div>

            {/* Special Features for Students */}
            {user?.role === 'student' && (
              <motion.div
                className="mt-8 p-4 bg-gradient-to-br from-neon-cyan/10 to-neon-purple/10 border border-neon-cyan/20 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-neon-cyan" />
                  <span className="text-sm font-semibold text-text-primary">AI Powered</span>
                </div>
                <p className="text-xs text-text-secondary">
                  Get personalized event recommendations based on your skills and interests.
                </p>
              </motion.div>
            )}
          </nav>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border-primary">
            <motion.button
              onClick={handleLogout}
              className="nav-item w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
              whileHover="hover"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </motion.button>
          </div>
        </div>

        {/* Close Button for Mobile */}
        <motion.button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-text-secondary hover:text-text-primary lg:hidden"
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
      </motion.aside>
    </>
  );
}
