import { Link, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from '../../context/AuthContext'

const Sidebar = () => {
  const location = useLocation()
  const { user } = useContext(AuthContext)

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
    { name: 'Projects', href: '/projects', icon: 'folder' },
    { name: 'API Testing', href: '/api-testing', icon: 'code' },
    { name: 'Profile', href: '/profile', icon: 'person' },
  ]

  // Add admin navigation if user is admin
  if (user?.role === 'admin' || user?.role === 'Admin') {
    navigation.push({ name: 'Admin Panel', href: '/admin', icon: 'admin_panel_settings' })
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
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar
