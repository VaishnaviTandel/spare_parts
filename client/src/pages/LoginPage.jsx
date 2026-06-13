import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { forgotPassword, resetPassword } from '../data/api'

export default function LoginPage() {
  const { login, register } = useAuth()
  const toast = useToast()
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const resetPasswordParam = params.get('resetPassword')
    const tokenParam = params.get('token')
    const emailParam = params.get('email')

    if (resetPasswordParam === 'true' && tokenParam) {
      setMode('reset')
      setToken(tokenParam)
      setEmail(emailParam || '')
    }
  }, [])

  const handleSubmit = async () => {
    setLoading(true)
    try {
      if (mode === 'login') {
        if (!identifier.trim() || !password.trim()) throw new Error('Enter your email/username and password')
        await login(identifier.trim(), password)
        toast('Logged in successfully')
      } else if (mode === 'register') {
        if (!username.trim() || !email.trim() || !password.trim()) {
          throw new Error('Fill in username, email and password')
        }
        await register(username.trim(), email.trim(), password)
        toast('Account created successfully')
      } else if (mode === 'forgot') {
        if (!email.trim()) throw new Error('Enter your email address')
        await forgotPassword(email.trim())
        toast('If your email is registered, a reset link was sent')
        setMode('login')
      } else if (mode === 'reset') {
        if (!email.trim() || !token || !password.trim()) {
          throw new Error('Email, token, and password are required')
        }
        await resetPassword(email.trim(), token, password)
        toast('Password reset successfully')
        setMode('login')
        setPassword('')
        setIdentifier('')
      }
    } catch (err) {
      toast(err.response?.data?.error || err.message || 'Authentication failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  const renderHeader = () => {
    if (mode === 'forgot') return 'Forgot Password'
    if (mode === 'reset') return 'Reset Your Password'
    return mode === 'login' ? 'Spare Parts Login' : 'Create Your Account'
  }

  const renderSubtitle = () => {
    if (mode === 'forgot') return 'Enter the email you used to create your account.'
    if (mode === 'reset') return 'Set a new password using the link we emailed you.'
    return mode === 'login'
      ? 'Access your inventory from any device.'
      : 'Create an account to keep your products private and synced.'
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md glass-strong p-8 rounded-3xl shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-white">{renderHeader()}</h1>
            <p className="text-sm text-slate-400">{renderSubtitle()}</p>
          </div>
          {mode === 'login' || mode === 'register' ? (
            <div className="inline-flex rounded-full bg-white/10 px-2 py-1 text-[11px] text-slate-300">
              {mode === 'login' ? 'Sign in' : 'Sign up'}
            </div>
          ) : null}
        </div>

        {(mode === 'login' || mode === 'register') && (
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 rounded-2xl py-2 text-sm font-medium transition ${
                mode === 'login'
                  ? 'bg-brand-green text-white shadow-lg shadow-brand-green/20'
                  : 'text-slate-300 bg-white/5 hover:bg-white/10'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 rounded-2xl py-2 text-sm font-medium transition ${
                mode === 'register'
                  ? 'bg-brand-green text-white shadow-lg shadow-brand-green/20'
                  : 'text-slate-300 bg-white/5 hover:bg-white/10'
              }`}
            >
              Register
            </button>
          </div>
        )}

        {mode === 'register' && (
          <div className="space-y-4 mb-4">
            <label className="block text-xs text-slate-400 uppercase tracking-[0.2em]">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-green"
              placeholder="Choose a username"
            />
          </div>
        )}

        <div className="space-y-4 mb-4">
          <label className="block text-xs text-slate-400 uppercase tracking-[0.2em]">
            {mode === 'login'
              ? 'Email or username'
              : mode === 'forgot'
              ? 'Email'
              : 'Email'}
          </label>
          <input
            value={mode === 'login' ? identifier : email}
            onChange={(e) => (mode === 'login' ? setIdentifier(e.target.value) : setEmail(e.target.value))}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-green"
            placeholder={mode === 'login' ? 'Email or username' : 'Email address'}
            type="email"
            disabled={mode === 'reset' && Boolean(email)}
          />
        </div>

        {mode !== 'forgot' && (
          <div className="space-y-4 mb-6">
            <label className="block text-xs text-slate-400 uppercase tracking-[0.2em]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-green"
              placeholder={mode === 'login' ? 'Your password' : 'Minimum 6 characters'}
            />
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full rounded-2xl bg-brand-green px-4 py-3 text-sm font-medium text-white hover:bg-brand-dark transition-all shadow-lg shadow-brand-green/20 disabled:opacity-60"
        >
          {loading
            ? 'Processing…'
            : mode === 'login'
            ? 'Login'
            : mode === 'register'
            ? 'Create account'
            : mode === 'forgot'
            ? 'Send reset email'
            : 'Reset password'}
        </button>

        <div className="mt-5 text-sm text-slate-500 space-y-3">
          {mode === 'login' && (
            <div className="flex items-center justify-between">
              <button onClick={() => setMode('forgot')} className="text-brand-green hover:underline">
                Forgot password?
              </button>
              <button onClick={() => setMode('register')} className="text-brand-green hover:underline">
                Create account
              </button>
            </div>
          )}
          {mode === 'register' && (
            <div className="flex justify-between">
              <span>Already have an account?</span>
              <button onClick={() => setMode('login')} className="text-brand-green hover:underline">
                Login
              </button>
            </div>
          )}
          {mode === 'forgot' && (
            <div className="flex justify-between">
              <span>Remembered your password?</span>
              <button onClick={() => setMode('login')} className="text-brand-green hover:underline">
                Login
              </button>
            </div>
          )}
          {mode === 'reset' && (
            <div className="flex justify-between">
              <span>Need a new link?</span>
              <button onClick={() => setMode('forgot')} className="text-brand-green hover:underline">
                Resend reset email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
