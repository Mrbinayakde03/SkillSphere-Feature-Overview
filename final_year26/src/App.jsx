import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import './App.css';
import './styles/UserRequested.css';

// Auth Context
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Authentication
import { LoginPage } from './components/Auth/LoginPage';
import { RegisterPage } from './components/Auth/RegisterPage';

// Public Pages
import HomePage from './pages/HomePage';
import AboutPage from './components/About';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { OrganizerLayout } from './layouts/OrganizerLayout';
import { UserLayout } from './layouts/UserLayout';

// Admin Pages
import { AdminDashboardPage } from './pages/Admin/Dashboard';
import { AdminOrganizationsPage } from './pages/Admin/Organizations';
import { AdminUsersPage } from './pages/Admin/Users';

// Organizer Pages
import { OrganizerDashboardPage } from './pages/Organizer/Dashboard';
import { OrganizerEventsPage } from './pages/Organizer/Events';
import { OrganizerMembersPage } from './pages/Organizer/Members';

// User Pages
import { UserDashboardPage } from './pages/User/Dashboard';
import { UserRecommendedPage } from './pages/User/Recommended';
import { UserEventsPage } from './pages/User/Events';
import { UserProfilePage } from './pages/User/Profile';

// Legacy
import { StudentDashboard } from './components/StudentDashboard';

/* =========================
   PROTECTED ROUTE
========================= */
function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (
    requiredRole &&
    !(user?.role === requiredRole ||
      (requiredRole === 'student' && user?.role === 'user'))
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

/* =========================
   APP ROUTES
========================= */
function AppRoutes() {
  const { user, isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>

        {/* ========= PUBLIC ROUTES (WITH HEADER) ========= */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route>

        {/* ========= AUTH ROUTES ========= */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ========= ADMIN ROUTES ========= */}
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


        {/* ========= ORGANIZATION ROUTES ========= */}
        {user?.role === 'ORGANIZATION' && (
          <>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredRole="ORGANIZATION">
                  <OrganizerLayout>
                    <OrganizerDashboardPage />
                  </OrganizerLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/organization"
              element={
                <ProtectedRoute requiredRole="ORGANIZATION">
                  <OrganizerLayout>
                    <OrganizerDashboardPage />
                  </OrganizerLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/events"
              element={
                <ProtectedRoute requiredRole="ORGANIZATION">
                  <OrganizerLayout>
                    <OrganizerEventsPage />
                  </OrganizerLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/members/requests"
              element={
                <ProtectedRoute requiredRole="ORGANIZATION">
                  <OrganizerLayout>
                    <OrganizerMembersPage />
                  </OrganizerLayout>
                </ProtectedRoute>
              }
            />
          </>
        )}


        {/* ========= USER ROUTES ========= */}
        {user?.role === 'USER' && (
          <>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredRole="USER">
                  <UserLayout>
                    <UserDashboardPage />
                  </UserLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/user"
              element={
                <ProtectedRoute requiredRole="USER">
                  <UserLayout>
                    <UserDashboardPage />
                  </UserLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/recommended"
              element={
                <ProtectedRoute requiredRole="USER">
                  <UserLayout>
                    <UserRecommendedPage />
                  </UserLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/events"
              element={
                <ProtectedRoute requiredRole="USER">
                  <UserLayout>
                    <UserEventsPage />
                  </UserLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/my-events"
              element={
                <ProtectedRoute requiredRole="USER">
                  <UserLayout>
                    <StudentDashboard />
                  </UserLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/profile"
              element={
                <ProtectedRoute requiredRole="USER">
                  <UserLayout>
                    <UserProfilePage />
                  </UserLayout>
                </ProtectedRoute>
              }
            />
          </>
        )}

        {/* ========= FALLBACK ========= */}
        <Route
          path="*"
          element={
            isAuthenticated
              ? <Navigate to="/dashboard" replace />
              : <Navigate to="/login" replace />
          }
        />

      </Routes>
    </Router>
  );
}

/* =========================
   MAIN APP
========================= */
function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
