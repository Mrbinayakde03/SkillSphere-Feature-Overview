
import { GraduationCap, LogOut } from 'lucide-react';

export function Header({ user, onLogout }) {
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'student':
        return 'bg-blue-100 text-blue-700';
      case 'organizer':
        return 'bg-purple-100 text-purple-700';
      case 'admin':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SkillSphere</h1>
              <p className="text-xs text-gray-500">Event Discovery Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">{user.name}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getRoleBadgeColor(user.role || '')}`}>
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <button
              onClick={onLogout}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
