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

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/pro" element={<ModernDashboard />} />
      {/* root */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/learn" element={<APIWiki />} />
      <Route path="/logs" element={<SystemLogs />} />
      <Route path="/test" element={<ApiTester />} />
      <Route path="/profile" element={
        <ProtectedRoute>
          <UserProfile />
        </ProtectedRoute>
      } />
      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

