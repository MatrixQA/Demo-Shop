/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'
import { authenticate } from './authStore.js'

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

  const value = useMemo(() => {
    function login(username, password, opts = {}) {
      const res = authenticate(username, password)
      if (!res.ok) return res
      setUser(res.user)
      try {
        if (opts.remember === false) window.localStorage.removeItem(STORAGE_KEY)
        else window.localStorage.setItem(STORAGE_KEY, JSON.stringify(res.user))
      } catch {
        // ignore
      }
      return { ok: true }
    }

    function logout() {
      setUser(null)
      try {
        window.localStorage.removeItem(STORAGE_KEY)
      } catch {
        // ignore
      }
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

