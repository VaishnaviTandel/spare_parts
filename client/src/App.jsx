import { useState } from 'react'
import { ToastProvider } from './context/ToastContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import AnimatedBackground from './components/AnimatedBackground'
import Topbar    from './components/Topbar'
import HomePage  from './pages/HomePage'
import DetailPage from './pages/DetailPage'
import NotesPage from './pages/NotesPage'
import LogPage   from './pages/LogPage'
import LoginPage from './pages/LoginPage'
import Spinner   from './components/Spinner'

function Inner() {
  const { user, loading, logout } = useAuth()
  const [page, setPage] = useState('home')
  const [detailHP, setDetailHP] = useState(null)

  const goDetail = (hp) => { setDetailHP(hp); setPage('detail') }
  const goHome   = ()   => { setDetailHP(null); setPage('home') }
  const goNav    = (p)  => setPage(p)

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Spinner text="Checking login…" /></div>
  }

  if (!user) {
    return <LoginPage />
  }

  return (
    <>
      <AnimatedBackground />
      <div className="relative z-10 min-h-screen px-4 py-4 max-w-5xl mx-auto">
        <Topbar
          page={page}
          detailHP={detailHP}
          onBack={goHome}
          onNav={goNav}
          user={user}
          onLogout={logout}
        />
        <main>
          {page === 'home'   && <HomePage  onSelect={goDetail} />}
          {page === 'detail' && <DetailPage hp={detailHP} />}
          {page === 'notes'  && <NotesPage />}
          {page === 'log'    && <LogPage />}
        </main>
      </div>
    </>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Inner />
      </AuthProvider>
    </ToastProvider>
  )
}
