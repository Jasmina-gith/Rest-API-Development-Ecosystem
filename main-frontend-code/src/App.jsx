import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import ModernDashboard from './components/ModernDashboard';
import LoginPage from './pages/LoginPage';
import NotFound from './pages/NotFound';
import APIWiki from './components/APIWiki';
import SystemLogs from './pages/SystemLogs';
import ApiTester from "./components/ApiTester";
import UserProfile from './pages/UserProfile';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import ProjectsPage from './pages/ProjectsPage';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/pro" element={<ProtectedRoute><ModernDashboard /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
      <Route path="/profile" element={
        <ProtectedRoute>
          <UserProfile />
        </ProtectedRoute>
      } />
      <Route path="/learn" element={<ProtectedRoute><APIWiki /></ProtectedRoute>} />
      <Route path="/logs" element={<ProtectedRoute><SystemLogs /></ProtectedRoute>} />
      {/* root */}
      <Route path="/" element={<LoginPage />} />
      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

