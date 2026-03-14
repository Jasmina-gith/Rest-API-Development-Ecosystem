import { useContext, useEffect, useState } from 'react'
import AuthContext from '../context/AuthContext'
import { getMyProjects } from '../api/projects'
import Layout from '../components/layout/Layout'
import { Link } from 'react-router-dom'

const StatCard = ({ title, value, icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${colorClasses[color]} text-white`}>
          <span className="material-symbols-outlined text-2xl">{icon}</span>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  )
}

const Dashboard = () => {
  const { user } = useContext(AuthContext)
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const data = await getMyProjects()
      setProjects(data)
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          </div>

          {/* Skeleton loaders */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  <div className="ml-4 space-y-2">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
                    <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-48 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  const recentProjects = projects.slice(0, 3)

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {user?.username || user?.email || 'User'}!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Projects"
            value={projects.length}
            icon="folder"
            color="blue"
          />
          <StatCard
            title="Active Projects"
            value={projects.filter(p => p.isActive !== false).length}
            icon="check_circle"
            color="green"
          />
          <StatCard
            title="API Tests"
            value="0" // You can implement this based on your backend
            icon="api"
            color="yellow"
          />
          <StatCard
            title="Team Members"
            value="1" // You can implement this based on your backend
            icon="group"
            color="red"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/projects"
              className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="material-symbols-outlined text-2xl text-blue-600 mr-3">add</span>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Create Project</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Start a new API testing project</p>
              </div>
            </Link>
            <Link
              to="/api-testing"
              className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="material-symbols-outlined text-2xl text-green-600 mr-3">code</span>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">API Testing</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Test your APIs</p>
              </div>
            </Link>
            <Link
              to="/profile"
              className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="material-symbols-outlined text-2xl text-purple-600 mr-3">person</span>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Profile Settings</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage your account</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Projects</h2>
            <Link
              to="/projects"
              className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 text-sm font-medium"
            >
              View all
            </Link>
          </div>

          {recentProjects.length === 0 ? (
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-6xl text-gray-400 mb-4">folder_off</span>
              <p className="text-gray-600 dark:text-gray-400 mb-4">No projects yet</p>
              <Link
                to="/projects"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Create your first project
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div key={project.projectId} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <span className="material-symbols-outlined text-2xl text-blue-600 mr-3">folder</span>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{project.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Created {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/api-testing?project=${project.projectId}`}
                    className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 text-sm font-medium"
                  >
                    Open
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard
