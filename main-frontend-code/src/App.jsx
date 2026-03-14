import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Pages
import ModernDashboard from './components/ModernDashboard'
import LoginPage from './pages/LoginPage'
import NotFound from './pages/NotFound'
import APIWiki from './components/APIWiki'
import SystemLogs from './pages/SystemLogs'


function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/pro" element={<ModernDashboard />} />

      {/* root -> login for demo */}
<Route path="/" element={<LoginPage />} />

      <Route path="/learn" element={<APIWiki />} />
      <Route path="/logs" element={<SystemLogs />} />

      {/* 404 */}

      <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
