import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Auth Context
import { AuthProvider, useAuth } from './contexts/AuthContext'

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

// Protected Route Component
function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// Main App Routes Component
function AppRoutes() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        {user?.role === 'admin' && (
          <>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout>
                    <AdminDashboardPage />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/organizations"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout>
                    <AdminOrganizationsPage />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout>
                    <AdminUsersPage />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
          </>
        )}

        {/* Organizer Routes */}
        {user?.role === 'organizer' && (
          <>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredRole="organizer">
                  <OrganizerLayout>
                    <OrganizerDashboardPage />
                  </OrganizerLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/events"
              element={
                <ProtectedRoute requiredRole="organizer">
                  <OrganizerLayout>
                    <OrganizerEventsPage />
                  </OrganizerLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/members/requests"
              element={
                <ProtectedRoute requiredRole="organizer">
                  <OrganizerLayout>
                    <OrganizerMembersPage />
                  </OrganizerLayout>
                </ProtectedRoute>
              }
            />
          </>
        )}

        {/* User/Student Routes */}
        {user?.role === 'student' && (
          <>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredRole="student">
                  <UserLayout>
                    <UserDashboardPage />
                  </UserLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/recommended"
              element={
                <ProtectedRoute requiredRole="student">
                  <UserLayout>
                    <UserRecommendedPage />
                  </UserLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/events"
              element={
                <ProtectedRoute requiredRole="student">
                  <UserLayout>
                    <UserEventsPage />
                  </UserLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/my-events"
              element={
                <ProtectedRoute requiredRole="student">
                  <UserLayout>
                    <StudentDashboard />
                  </UserLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/profile"
              element={
                <ProtectedRoute requiredRole="student">
                  <UserLayout>
                    <UserProfilePage />
                  </UserLayout>
                </ProtectedRoute>
              }
            />
          </>
        )}

        {/* Default redirect based on role */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

// Main App Component
function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
