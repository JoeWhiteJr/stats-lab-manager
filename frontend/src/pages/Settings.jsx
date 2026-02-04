import { useState, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { usersApi } from '../services/api'
import Button from '../components/Button'
import Input from '../components/Input'
import Modal from '../components/Modal'
import { User, Shield, Users, Trash2 } from 'lucide-react'

export default function Settings() {
  const { user, updateUser } = useAuthStore()
  const [activeSection, setActiveSection] = useState('profile')

  // Profile state
  const [profileData, setProfileData] = useState({ name: '', email: '' })
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' })

  // Password state
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' })

  // Team state (admin only)
  const [teamMembers, setTeamMembers] = useState([])
  const [isLoadingTeam, setIsLoadingTeam] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)

  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    if (user) {
      setProfileData({ name: user.name, email: user.email })
    }
  }, [user])

  useEffect(() => {
    if (isAdmin && activeSection === 'team') {
      loadTeam()
    }
  }, [isAdmin, activeSection])

  const loadTeam = async () => {
    setIsLoadingTeam(true)
    try {
      const { data } = await usersApi.list()
      setTeamMembers(data.users)
    } catch (error) {
      console.error('Failed to load team:', error)
    }
    setIsLoadingTeam(false)
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setIsSavingProfile(true)
    setProfileMessage({ type: '', text: '' })

    try {
      const { data } = await usersApi.updateProfile(profileData)
      updateUser(data.user)
      setProfileMessage({ type: 'success', text: 'Profile updated successfully' })
    } catch (error) {
      setProfileMessage({
        type: 'error',
        text: error.response?.data?.error?.message || 'Failed to update profile'
      })
    }
    setIsSavingProfile(false)
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPasswordMessage({ type: '', text: '' })

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Passwords do not match' })
      return
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 8 characters' })
      return
    }

    setIsSavingPassword(true)

    try {
      await usersApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      setPasswordMessage({ type: 'success', text: 'Password changed successfully' })
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      setPasswordMessage({
        type: 'error',
        text: error.response?.data?.error?.message || 'Failed to change password'
      })
    }
    setIsSavingPassword(false)
  }

  const handleRoleChange = async (userId, newRole) => {
    try {
      await usersApi.updateRole(userId, newRole)
      setTeamMembers((members) =>
        members.map((m) => (m.id === userId ? { ...m, role: newRole } : m))
      )
    } catch (error) {
      console.error('Failed to update role:', error)
    }
  }

  const handleDeleteMember = async (userId) => {
    try {
      await usersApi.delete(userId)
      setTeamMembers((members) => members.filter((m) => m.id !== userId))
      setShowDeleteConfirm(null)
    } catch (error) {
      console.error('Failed to delete member:', error)
    }
  }

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    ...(isAdmin ? [{ id: 'team', label: 'Team', icon: Users }] : [])
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-text-primary">Settings</h1>
        <p className="mt-1 text-text-secondary">Manage your account and preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <nav className="md:w-48 flex md:flex-col gap-1">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-organic text-sm font-medium transition-colors ${
                activeSection === id
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-text-secondary hover:bg-gray-100 hover:text-text-primary'
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="flex-1">
          {/* Profile */}
          {activeSection === 'profile' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-display font-semibold text-lg mb-6">Profile Information</h2>
              <form onSubmit={handleSaveProfile} className="space-y-5">
                <Input
                  label="Full name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Role</label>
                  <p className="px-4 py-2.5 rounded-organic border border-gray-200 bg-gray-50 text-text-secondary capitalize">
                    {user?.role?.replace('_', ' ')}
                  </p>
                </div>

                {profileMessage.text && (
                  <div className={`p-3 rounded-lg text-sm ${
                    profileMessage.type === 'success'
                      ? 'bg-green-50 border border-green-200 text-green-700'
                      : 'bg-red-50 border border-red-200 text-red-600'
                  }`}>
                    {profileMessage.text}
                  </div>
                )}

                <Button type="submit" loading={isSavingProfile}>
                  Save Changes
                </Button>
              </form>
            </div>
          )}

          {/* Security */}
          {activeSection === 'security' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-display font-semibold text-lg mb-6">Change Password</h2>
              <form onSubmit={handleChangePassword} className="space-y-5">
                <Input
                  label="Current password"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  required
                />
                <Input
                  label="New password"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="At least 8 characters"
                  required
                />
                <Input
                  label="Confirm new password"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                />

                {passwordMessage.text && (
                  <div className={`p-3 rounded-lg text-sm ${
                    passwordMessage.type === 'success'
                      ? 'bg-green-50 border border-green-200 text-green-700'
                      : 'bg-red-50 border border-red-200 text-red-600'
                  }`}>
                    {passwordMessage.text}
                  </div>
                )}

                <Button type="submit" loading={isSavingPassword}>
                  Change Password
                </Button>
              </form>
            </div>
          )}

          {/* Team (Admin only) */}
          {activeSection === 'team' && isAdmin && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-display font-semibold text-lg mb-6">Team Members</h2>
              {isLoadingTeam ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-gray-300"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-primary-700 font-medium">
                            {member.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-text-primary">{member.name}</p>
                          <p className="text-sm text-text-secondary">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <select
                          value={member.role}
                          onChange={(e) => handleRoleChange(member.id, e.target.value)}
                          disabled={member.id === user.id}
                          className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="admin">Admin</option>
                          <option value="project_lead">Project Lead</option>
                          <option value="researcher">Researcher</option>
                          <option value="viewer">Viewer</option>
                        </select>
                        {member.id !== user.id && (
                          <button
                            onClick={() => setShowDeleteConfirm(member)}
                            className="p-2 rounded-lg text-text-secondary hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Member Confirmation */}
      <Modal
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        title="Remove Team Member"
        size="sm"
      >
        <p className="text-text-secondary">
          Are you sure you want to remove <strong>{showDeleteConfirm?.name}</strong> from the team?
          This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => handleDeleteMember(showDeleteConfirm.id)}>
            Remove
          </Button>
        </div>
      </Modal>
    </div>
  )
}
