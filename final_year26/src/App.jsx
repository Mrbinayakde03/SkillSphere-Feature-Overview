import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Placeholder exports for backward compatibility
export const User = {}
export const UserRole = {}

// Authentication
import { LoginPage } from './components/LoginPage'

// Layouts
import { AdminLayout } from './layouts/AdminLayout'
import { OrganizerLayout } from './layouts/OrganizerLayout'
import { UserLayout } from './layouts/UserLayout'

// Pages - Admin
import { AdminDashboardPage } from './pages/Admin/Dashboard'
import { AdminOrganizationsPage } from './pages/Admin/Organizations'
import { AdminUsersPage } from './pages/Admin/Users'

// Pages - Organizer
import { OrganizerDashboardPage } from './pages/Organizer/Dashboard'
import { OrganizerEventsPage } from './pages/Organizer/Events'
import { OrganizerMembersPage } from './pages/Organizer/Members'

// Pages - User
import { UserDashboardPage } from './pages/User/Dashboard'
import { UserRecommendedPage } from './pages/User/Recommended'
import { UserEventsPage } from './pages/User/Events'
import { UserProfilePage } from './pages/User/Profile'

// Legacy components (for backward compatibility)
import { StudentDashboard } from './components/StudentDashboard'

function App() {
  const [user, setUser] = useState(null)

  const handleLogin = (u) => setUser(u)
  const handleLogout = () => setUser(null)

  // Not logged in
  if (!user) {
    return <LoginPage onLogin={handleLogin} />
  }

  // Role-based routing with layouts
  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        {user.role === 'admin' && (
          <>
            <Route
              path="/dashboard"
              element={
                <AdminLayout user={user} onLogout={handleLogout}>
                  <AdminDashboardPage />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/organizations"
              element={
                <AdminLayout user={user} onLogout={handleLogout}>
                  <AdminOrganizationsPage />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminLayout user={user} onLogout={handleLogout}>
                  <AdminUsersPage />
                </AdminLayout>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        )}

        {/* Organizer Routes */}
        {user.role === 'organizer' && (
          <>
            <Route
              path="/dashboard"
              element={
                <OrganizerLayout user={user} onLogout={handleLogout}>
                  <OrganizerDashboardPage />
                </OrganizerLayout>
              }
            />
            <Route
              path="/organizer/events"
              element={
                <OrganizerLayout user={user} onLogout={handleLogout}>
                  <OrganizerEventsPage />
                </OrganizerLayout>
              }
            />
            <Route
              path="/organizer/members/requests"
              element={
                <OrganizerLayout user={user} onLogout={handleLogout}>
                  <OrganizerMembersPage />
                </OrganizerLayout>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        )}

        {/* User/Student Routes */}
        {user.role === 'student' && (
          <>
            <Route
              path="/dashboard"
              element={
                <UserLayout user={user} onLogout={handleLogout}>
                  <UserDashboardPage />
                </UserLayout>
              }
            />
            <Route
              path="/user/recommended"
              element={
                <UserLayout user={user} onLogout={handleLogout}>
                  <UserRecommendedPage />
                </UserLayout>
              }
            />
            <Route
              path="/user/events"
              element={
                <UserLayout user={user} onLogout={handleLogout}>
                  <UserEventsPage />
                </UserLayout>
              }
            />
            <Route
              path="/user/my-events"
              element={
                <UserLayout user={user} onLogout={handleLogout}>
                  <StudentDashboard user={user} onLogout={handleLogout} />
                </UserLayout>
              }
            />
            <Route
              path="/user/profile"
              element={
                <UserLayout user={user} onLogout={handleLogout}>
                  <UserProfilePage />
                </UserLayout>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        )}

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  )
}

export default App
