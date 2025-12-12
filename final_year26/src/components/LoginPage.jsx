import { useState } from 'react';
import { User } from '../App';
import { mockUsers } from '../data/mockData';
import { GraduationCap, Users, Shield } from 'lucide-react';

export function LoginPage({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState('student');

  const handleRoleLogin = (role) => {
    const user = mockUsers.find(u => u.role === role);
    if (user) {
      onLogin(user);
    }
  };

  const roles = [
    {
      role: 'student',
      icon: GraduationCap,
      title: 'Student',
      description: 'Discover events, get AI recommendations, and track your participation',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      role: 'organizer',
      icon: Users,
      title: 'Organizer',
      description: 'Create and manage events, track participation, and coordinate activities',
      color: 'from-purple-500 to-pink-600'
    },
    {
      role: 'admin',
      icon: Shield,
      title: 'Admin',
      description: 'Oversee platform operations, manage users, and view analytics',
      color: 'from-green-500 to-teal-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              SkillSphere
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            AI-Powered Event Discovery & Management Platform
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {roles.map(({ role, icon: Icon, title, description, color }) => (
            <button
              key={role}
              onClick={() => handleRoleLogin(role)}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-transparent hover:-translate-y-1"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity`}></div>
              
              <div className={`w-16 h-16 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold mb-3 text-gray-900">{title}</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                {description}
              </p>
              
              <div className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${color} text-white rounded-lg group-hover:shadow-lg transition-shadow`}>
                <span>Continue as {title}</span>
                <span className="text-lg">→</span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Demo mode - Select any role to explore the platform
          </p>
        </div>
      </div>
    </div>
  );
}
