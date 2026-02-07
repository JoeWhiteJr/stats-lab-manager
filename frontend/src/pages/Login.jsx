import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import Input from '../components/Input'
import Button from '../components/Button'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login, error, clearError, pendingApproval, token } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Sign In - Stats Lab'
  }, [])

  useEffect(() => {
    if (token) {
      navigate('/dashboard')
    }
  }, [token, navigate])

  useEffect(() => {
    clearError()
  }, [email, password, clearError])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    const result = await login(email, password)
    setIsSubmitting(false)
    if (result.success) {
      navigate('/dashboard')
    } else if (result.code === 'ACCOUNT_DELETED') {
      navigate('/access-revoked')
    }
  }

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-3xl text-primary-600">Stats Lab</h1>
          <p className="mt-2 text-text-secondary dark:text-gray-400">Welcome back! Sign in to continue.</p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />

            {pendingApproval && (
              <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 text-sm text-amber-800 dark:text-amber-300">
                <p className="font-medium mb-1">Application Under Review</p>
                <p>Your application is currently under review by the admins. Thank you for your patience.</p>
              </div>
            )}
            {error && !pendingApproval && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              loading={isSubmitting}
            >
              Sign in
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-text-secondary dark:text-gray-400">
            Want to join the team?{' '}
            <Link to="/apply" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
              Apply here
            </Link>
          </p>
        </div>

        {/* Home Link */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-text-secondary dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
