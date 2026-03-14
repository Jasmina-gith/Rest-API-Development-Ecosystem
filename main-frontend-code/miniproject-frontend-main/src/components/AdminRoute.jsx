import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const AdminRoute = ({ children }) => {
  const { user, isLoading } = useContext(AuthContext)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Assuming user has a role property (adjust based on your backend)
  if (user.role !== 'admin' && user.role !== 'Admin') {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default AdminRoute
