import { useEffect, useState } from 'react'
import { Settings, ArrowLeft, Sun, Moon } from 'lucide-react'

export default function Topbar({ page, detailHP, onBack, onNav, user, onLogout }) {
  const [isLight, setIsLight] = useState(() => {
    try {
      return localStorage.getItem('theme') === 'light'
    } catch {
      return false
    }
  })

  useEffect(() => {
    const root = document.documentElement
    if (isLight) {
      root.classList.add('light-theme')
      try { localStorage.setItem('theme', 'light') } catch {}
    } else {
      root.classList.remove('light-theme')
      try { localStorage.setItem('theme', 'dark') } catch {}
    }
  }, [isLight])
  const isDetail = page === 'detail'
  const navItems = [
    { key: 'home',  label: 'Home'  },
    { key: 'notes', label: 'Notes' },
    { key: 'log',   label: 'Log'   },
  ]

  return (
    <header className="glass-strong rounded-2xl px-5 py-3 mb-6 flex items-center justify-between sticky top-4 z-30">
      <div className="flex items-center gap-3">
        {isDetail && (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white px-3 py-1.5 rounded-xl border border-white/10 hover:bg-white/5 transition-all"
          >
            <ArrowLeft size={14} /> Back
          </button>
        )}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-green/20 flex items-center justify-center">
            <Settings size={14} className="text-brand-green" />
          </div>
          <span className="font-semibold text-white text-[15px]">
            {isDetail ? `${detailHP} HP — Spare Parts` : 'Spare Parts Inventory'}
          </span>
        </div>
      </div>

      <nav className="flex items-center gap-2">
        <button
          onClick={() => setIsLight((v) => !v)}
          title="Toggle light theme"
          className="px-3 py-1.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all"
        >
          {isLight ? <Sun size={14} /> : <Moon size={14} />}
        </button>
        {user && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 text-sm text-slate-200">
            <span>{user.username || user.email}</span>
            <button
              onClick={onLogout}
              className="rounded-lg px-3 py-1 text-slate-300 hover:text-white hover:bg-white/10 transition-all"
            >
              Logout
            </button>
          </div>
        )}
        {navItems.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onNav(key)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
              page === key
                ? 'bg-brand-green text-white shadow-lg shadow-brand-green/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {label}
          </button>
        ))}
      </nav>
    </header>
  )
}
