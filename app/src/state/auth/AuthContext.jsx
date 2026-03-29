import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { users } from '../../data/users.js'

const AuthContext = createContext(null)

const STORAGE_KEY = 'demoShop.auth.v1'

function loadUser() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const u = JSON.parse(raw)
    if (!u || typeof u !== 'object') return null
    if (!u.username || !u.role) return null
    return { username: String(u.username), role: String(u.role) }
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadUser())

  useEffect(() => {
    try {
      if (user) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      else window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  }, [user])

  const value = useMemo(() => {
    function login(username, password) {
      const found = users.find(
        (u) => u.username === username && u.password === password,
      )
      if (!found) return { ok: false, error: 'Invalid credentials' }
      setUser({ username: found.username, role: found.role })
      return { ok: true }
    }

    function logout() {
      setUser(null)
    }

    return { user, login, logout }
  }, [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

