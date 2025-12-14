import { GraduationCap, LogOut, Menu, LogIn, UserPlus } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
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

        {/* LEFT */}
        <div className="header-left-section">

          {/* ✅ SIDEBAR TOGGLE – ALWAYS PRESENT */}
          <button
            className="header-menu-toggle"
            onClick={onMenuToggle}
            aria-label="Toggle Sidebar"
          >
            <Menu size={20} />
          </button>

          <Link to="/" className="header-brand">
            <div className="header-logo">
              <GraduationCap />
            </div>
            <span className="header-title">SkillSphere</span>
          </Link>
        </div>

        {/* CENTER */}
        <nav className="header-nav">
          <NavLink to="/" className="nav-link">Home</NavLink>
          <NavLink to="/about" className="nav-link">About</NavLink>
        </nav>

        {/* RIGHT */}
        <div className="header-right-section">
          {user ? (
            <>
              <div className="header-user-info">
                <span className="header-user-name">{user.name}</span>
                <span className={getRoleBadgeClass(user.role)}>
                  {user.role}
                </span>
              </div>

              <button className="header-logout-button" onClick={onLogout}>
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <div className="header-auth-buttons">
              <Link to="/login" className="auth-btn login">
                <LogIn size={16} />
                Login
              </Link>
              <Link to="/register" className="auth-btn register">
                <UserPlus size={16} />
                Register
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
