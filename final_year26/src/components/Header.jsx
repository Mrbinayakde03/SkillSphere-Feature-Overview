


import { GraduationCap, LogOut, Menu } from 'lucide-react';
import '../styles/Header.css';

export function Header({ user, onLogout, onMenuToggle }) {
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'student':
        return 'header-role-badge student';
      case 'organizer':
        return 'header-role-badge organizer';
      case 'admin':
        return 'header-role-badge admin';
      default:
        return 'header-role-badge default';
    }
  };

  return (

    <header className="skillsphere-header">
      <div className="header-container">
        <div className="header-left-section">
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="header-menu-toggle"
              title="Toggle sidebar"
            >
              <Menu />
            </button>
          )}
          <div className="header-logo-section">
            <div className="header-logo">
              <GraduationCap />
            </div>
            <div className="header-title-section">
              <h1 className="header-title">SkillSphere</h1>
              <p className="header-subtitle">Event Discovery Platform</p>
            </div>
          </div>
        </div>

        <div className="header-user-section">
          <div className="header-user-info">
            <div className="header-user-details">

              <span className="header-user-name">{user?.name || 'User'}</span>
              <span className={getRoleBadgeClass(user?.role || '')}>
                {user?.role || 'user'}
              </span>
            </div>
            <p className="header-user-email">{user?.email || 'user@example.com'}</p>
          </div>
          <button
            onClick={onLogout}
            className="header-logout-button"
            title="Logout"
          >
            <LogOut />
          </button>
        </div>
      </div>
    </header>
  );
}
