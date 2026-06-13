import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function LoginPage() {
  const { login, register } = useAuth()
  const toast = useToast()
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      if (mode === 'login') {
        if (!identifier.trim() || !password.trim()) throw new Error('Enter your email/username and password')
        await login(identifier.trim(), password)
        toast('Logged in successfully')
      } else {
        if (!username.trim() || !email.trim() || !password.trim()) {
          throw new Error('Fill in username, email and password')
        }
        await register(username.trim(), email.trim(), password)
        toast('Account created successfully')
      }
    } catch (err) {
      toast(err.response?.data?.error || err.message || 'Authentication failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md glass-strong p-8 rounded-3xl shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-white">Spare Parts Login</h1>
            <p className="text-sm text-slate-400">Access your inventory from any device.</p>
          </div>
          <div className="inline-flex rounded-full bg-white/10 px-2 py-1 text-[11px] text-slate-300">
            {mode === 'login' ? 'Sign in' : 'Sign up'}
          </div>
        </div>

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
            {mode === 'login' ? 'Email or username' : 'Email'}
          </label>
          <input
            value={mode === 'login' ? identifier : email}
            onChange={(e) => mode === 'login' ? setIdentifier(e.target.value) : setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-green"
            placeholder={mode === 'login' ? 'Email or username' : 'Email address'}
          />
        </div>

        {mode === 'login' ? (
          <div className="space-y-4 mb-6">
            <label className="block text-xs text-slate-400 uppercase tracking-[0.2em]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-green"
              placeholder="Your password"
            />
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            <label className="block text-xs text-slate-400 uppercase tracking-[0.2em]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-green"
              placeholder="Minimum 6 characters"
            />
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full rounded-2xl bg-brand-green px-4 py-3 text-sm font-medium text-white hover:bg-brand-dark transition-all shadow-lg shadow-brand-green/20 disabled:opacity-60"
        >
          {loading ? 'Processing…' : mode === 'login' ? 'Login' : 'Create account'}
        </button>

        <p className="mt-5 text-sm text-slate-500">
          {mode === 'login'
            ? 'New here? Create an account to keep your products private and available across devices.'
            : 'Already have an account? Login using your email or username.'}
        </p>
      </div>
    </div>
  )
}
