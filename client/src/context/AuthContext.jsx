import { createContext, useContext, useEffect, useState } from 'react'
import { api, setAuthToken } from '../data/api'
import { useToast } from './ToastContext'

const AuthCtx = createContext()

export function AuthProvider({ children }) {
  const toast = useToast()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }

    setAuthToken(token)
    api.get('/auth/me')
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('token')
        setAuthToken(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (identifier, password) => {
    const { data } = await api.post('/auth/login', { identifier, password })
    setAuthToken(data.token)
    localStorage.setItem('token', data.token)
    setUser(data.user)
    return data.user
  }

  const register = async (username, email, password) => {
    const { data } = await api.post('/auth/register', { username, email, password })
    setAuthToken(data.token)
    localStorage.setItem('token', data.token)
    setUser(data.user)
    return data.user
  }

  const logout = () => {
    setUser(null)
    setAuthToken(null)
    localStorage.removeItem('token')
    toast('Logged out', 'info')
  }

  return (
    <AuthCtx.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthCtx.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthCtx)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
