import { useState, useEffect, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'
import ProfileView from '../ProfileView.jsx'
import { axiosJwt } from '../../api/axios'
import { cls } from '../../utils/cls'
import { motion, AnimatePresence } from 'framer-motion'

const Sidebar = () => {
  const location = useLocation()
const { user, logout } = useContext(AuthContext)

  const [profileOpen, setProfileOpen] = useState(false)
  const [profileUser, setProfileUser] = useState(null)
  const [loadingProfile, setLoadingProfile] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
    { name: 'Projects', href: '/projects', icon: 'folder' },
    { name: 'API Testing', href: '/api-testing', icon: 'code' },
  ]

  // Add admin navigation if user is admin
  if (user?.role === 'admin' || user?.role === 'Admin') {
    navigation.push({ name: 'Admin Panel', href: '/admin', icon: 'admin_panel_settings' })
  }

  const loadProfile = async () => {
    if (profileUser) return
    setLoadingProfile(true)
    try {
      const res = await axiosJwt.get('/auth/me')
      setProfileUser(res.data)
    } catch (err) {
      console.error('Profile load error:', err)
    } finally {
      setLoadingProfile(false)
    }
  }

  const toggleProfile = () => {
    if (!profileOpen) loadProfile()
    setProfileOpen(!profileOpen)
  }

  return (
    <div className="fixed left-0 top-16 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-10">
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
{navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="material-symbols-outlined mr-3 text-lg">
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              </li>
            )
          })}
          {/* Profile Dropdown */}
          <li className="space-y-1">
            <button
              onClick={toggleProfile}
              className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              title="Profile"
            >
              <span className="material-symbols-outlined mr-3 text-lg">person</span>
              Profile
              <span className={`ml-auto transition-transform ${profileOpen ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </button>
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden ml-8 mt-1"
                >
                  {loadingProfile ? (
                    <div className="p-4 text-sm text-gray-500">Loading...</div>
                  ) : profileUser ? (
                    <ProfileView user={profileUser} logout={user.logout} />
                  ) : (
                    <div className="p-4 text-sm text-gray-500">Failed to load profile</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar
