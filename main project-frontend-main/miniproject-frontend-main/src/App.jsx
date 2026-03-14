import { Routes, Route, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

// Import pages
import ModernDashboard from './components/ModernDashboard';
import APIWiki from './components/APIWiki';
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import Dashboard from './pages/Dashboard'
import ProjectsPage from './pages/ProjectsPage'
import ProfilePage from './pages/ProfilePage'
import AdminPanel from './pages/AdminPanel'
import NotFound from './pages/NotFound'
import Home from './pages/Home' // Existing API testing page

function App() {
  const { user, isLoading } = useContext(AuthContext)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      <Route
        path="/signup"
        element={user ? <Navigate to="/dashboard" replace /> : <SignupPage />}
      />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <ProjectsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminPanel />
          </AdminRoute>
        }
      />
      <Route
        path="/pro"
        element={
          <ProtectedRoute>
            <ModernDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/learn"
        element={
          <ProtectedRoute>
            <APIWiki />
          </ProtectedRoute>
        }
      />

      {/* API Testing Tool (existing functionality) */}
      <Route
        path="/api-testing"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route
        path="/"
        element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
      />

      {/* 404 page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
