import { useContext, useEffect, useState } from 'react'
import AuthContext from '../context/AuthContext'
import { axiosJwt } from '../api/axios'
import Layout from '../components/layout/Layout'
import toast from 'react-hot-toast'

const ProfilePage = () => {
  const { user, authorize } = useContext(AuthContext)
  const [profileData, setProfileData] = useState({
    username: '',
    email: ''
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [isProfileLoading, setIsProfileLoading] = useState(false)
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)
  const [profileErrors, setProfileErrors] = useState({})
  const [passwordErrors, setPasswordErrors] = useState({})

  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || '',
        email: user.email || ''
      })
    }
  }, [user])

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    })
    if (profileErrors[e.target.name]) {
      setProfileErrors({
        ...profileErrors,
        [e.target.name]: ''
      })
    }
  }

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    })
    if (passwordErrors[e.target.name]) {
      setPasswordErrors({
        ...passwordErrors,
        [e.target.name]: ''
      })
    }
  }

  const validateProfile = () => {
    const errors = {}
    if (!profileData.username.trim()) errors.username = 'Username is required'
    if (!profileData.email.trim()) errors.email = 'Email is required'
    return errors
  }

  const validatePassword = () => {
    const errors = {}
    if (!passwordData.currentPassword) errors.currentPassword = 'Current password is required'
    if (!passwordData.newPassword) errors.newPassword = 'New password is required'
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }
    return errors
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    const errors = validateProfile()
    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors)
      return
    }

    setIsProfileLoading(true)
    try {
      await axiosJwt.put('/auth/profile', profileData)
      await authorize() // Refresh user data
      toast.success('Profile updated successfully!')
    } catch (error) {
      console.error('Profile update error:', error)
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setIsProfileLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    const errors = validatePassword()
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors)
      return
    }

    setIsPasswordLoading(true)
    try {
      await axiosJwt.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      toast.success('Password changed successfully!')
    } catch (error) {
      console.error('Password change error:', error)
      toast.error(error.response?.data?.message || 'Failed to change password')
    } finally {
      setIsPasswordLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    )
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your account information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Profile Information</h2>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={profileData.username}
                  onChange={handleProfileChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
                {profileErrors.username && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{profileErrors.username}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
                {profileErrors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{profileErrors.email}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isProfileLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProfileLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  'Update Profile'
                )}
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Change Password</h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
                {passwordErrors.currentPassword && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{passwordErrors.currentPassword}</p>
                )}
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
                {passwordErrors.newPassword && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{passwordErrors.newPassword}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
                {passwordErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{passwordErrors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isPasswordLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPasswordLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  'Change Password'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ProfilePage
