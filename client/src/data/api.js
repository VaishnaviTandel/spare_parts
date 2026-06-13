import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || '/api'
const api = axios.create({ baseURL })

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common.Authorization
  }
}

// ── Auth ──────────────────────────────────────────────
export const loginUser    = (identifier, password) => api.post('/auth/login', { identifier, password })
export const registerUser = (username, email, password) => api.post('/auth/register', { username, email, password })
export const forgotPassword = (email) => api.post('/auth/forgot-password', { email })
export const resetPassword  = (email, token, password) => api.post('/auth/reset-password', { email, token, password })
export const getMe        = () => api.get('/auth/me')

// ── Parts ──────────────────────────────────────────────
export const getParts    = (hp)      => api.get('/parts', { params: hp ? { hp } : {} })
export const createPart  = (data)    => api.post('/parts', data)
export const updatePart  = (id, data)=> api.put(`/parts/${id}`, data)
export const buyPart     = (id)      => api.patch(`/parts/${id}/buy`)
export const deletePart  = (id)      => api.delete(`/parts/${id}`)

// ── Notes ──────────────────────────────────────────────
export const getNotes    = ()        => api.get('/notes')
export const createNote  = (text)    => api.post('/notes', { text })
export const deleteNote  = (id)      => api.delete(`/notes/${id}`)

// ── Logs ───────────────────────────────────────────────
export const getLogs     = ()        => api.get('/logs')

export { api }
