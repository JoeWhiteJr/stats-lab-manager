import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { authApi } from '../services/api'
import Button from '../components/Button'
import Input from '../components/Input'
import { CheckCircle } from 'lucide-react'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'Reset Password - Stats Lab'
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsSubmitting(true)
    try {
      await authApi.resetPassword(token, password)
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to reset password')
    }
    setIsSubmitting(false)
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-gray-900 p-4">
        <div className="text-center">
          <h2 className="font-display font-semibold text-xl text-text-primary dark:text-gray-100 mb-2">Invalid Reset Link</h2>
          <p className="text-text-secondary dark:text-gray-400 mb-4">This password reset link is missing a token.</p>
          <Link to="/login" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium">Back to login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-3xl text-primary-600">Stats Lab</h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8">
          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle size={28} className="text-green-600 dark:text-green-400" />
              </div>
              <h2 className="font-display font-semibold text-xl text-text-primary dark:text-gray-100 mb-2">Password Reset!</h2>
              <p className="text-text-secondary dark:text-gray-400 text-sm mb-6">Your password has been reset successfully.</p>
              <Link to="/login" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
                Go to login
              </Link>
            </div>
          ) : (
            <>
              <h2 className="font-display font-semibold text-xl text-text-primary dark:text-gray-100 mb-6">Set new password</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="New password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                />
                <Input
                  label="Confirm password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {error && (
                  <div className="p-3 rounded-lg text-sm bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400">{error}</div>
                )}
                <Button type="submit" loading={isSubmitting} className="w-full">
                  Reset Password
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
