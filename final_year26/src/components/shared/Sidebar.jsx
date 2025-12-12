import { LayoutDashboard, Calendar, Users, Settings, LogOut, ChevronDown, Zap, FileText, BarChart3, Shield, Plus } from 'lucide-react';
import { useState } from 'react';

export function Sidebar({ user, isOpen, onClose }) {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Role-based navigation
  const getNavItems = () => {
    const baseItems = [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' }
    ];

    if (user?.role === 'admin') {
      return [
        ...baseItems,
        {
          section: 'MANAGEMENT',
          items: [
            { icon: Shield, label: 'Organizations', href: '/admin/organizations' },
            { icon: Users, label: 'Users', href: '/admin/users' },
            { icon: Calendar, label: 'All Events', href: '/admin/events' }
          ]
        },
        {
          section: 'PLATFORM',
          items: [
            { icon: Zap, label: 'Skills & Categories', href: '/admin/skills' },
            { icon: BarChart3, label: 'Reports', href: '/admin/reports' },
            { icon: Settings, label: 'Settings', href: '/admin/settings' }
          ]
        }
      ];
    } else if (user?.role === 'organizer') {
      return [
        ...baseItems,
        {
          section: 'EVENTS',
          items: [
            { icon: Calendar, label: 'My Events', href: '/organizer/events' },
            { icon: Plus, label: 'Create Event', href: '/organizer/events/create' }
          ]
        },
        {
          section: 'MEMBERS',
          items: [
            { icon: Users, label: 'Member Requests', href: '/organizer/members/requests' },
            { icon: FileText, label: 'Documentation Review', href: '/organizer/members/docs' }
          ]
        },
        {
          section: 'SETTINGS',
          items: [
            { icon: Settings, label: 'Organization Settings', href: '/organizer/settings' }
          ]
        }
      ];
    } else {
      // User role
      return [
        ...baseItems,
        {
          section: 'EVENTS',
          items: [
            { icon: Zap, label: 'Recommended Events', href: '/user/recommended' },
            { icon: Calendar, label: 'All Events', href: '/user/events' },
            { icon: Calendar, label: 'My Events', href: '/user/my-events' }
          ]
        },
        {
          section: 'PROFILE',
          items: [
            { icon: Users, label: 'Organizations', href: '/user/organizations' },
            { icon: FileText, label: 'Resume & Skills', href: '/user/profile' }
          ]
        }
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 transform transition-transform lg:translate-x-0 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="overflow-y-auto h-full pt-4 pb-20">
          {navItems.map((item, idx) => {
            if (item.section) {
              // Section with grouped items
              return (
                <div key={idx} className="px-4 py-4">
                  <div
                    onClick={() => toggleSection(item.section)}
                    className="flex items-center justify-between cursor-pointer mb-2"
                  >
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {item.section}
                    </h3>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        expandedSections[item.section] ? 'rotate-180' : ''
                      }`}
                    />
                  </div>

                  {expandedSections[item.section] !== false && (
                    <div className="space-y-1">
                      {item.items?.map((subItem, subIdx) => {
                        const Icon = subItem.icon;
                        return (
                          <a
                            key={subIdx}
                            href={subItem.href}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <Icon className="w-4 h-4" />
                            <span>{subItem.label}</span>
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            } else {
              // Single item
              const Icon = item.icon;
              return (
                <a
                  key={idx}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors mx-2 rounded-lg"
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </a>
              );
            }
          })}
        </div>
      </aside>
    </>
  );
}
