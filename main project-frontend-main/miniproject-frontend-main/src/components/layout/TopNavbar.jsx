import { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'
import ThemeSelector from '../ThemeSelector'

const TopNavbar = () => {
  const { user, logout } = useContext(AuthContext)

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-20">
      <div className="flex items-center justify-between px-6 h-full">
        <div className="flex items-center">
          <Link to="/dashboard" className="text-xl font-bold text-gray-900 dark:text-white">
            API Tester
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeSelector />

          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Welcome, {user.username || user.email}
              </span>

              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default TopNavbar
