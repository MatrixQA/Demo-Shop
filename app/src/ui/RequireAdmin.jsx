import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../state/auth/AuthContext.jsx'

export function RequireAdmin({ children }) {
  const { user } = useAuth()
  const loc = useLocation()

  if (!user) return <Navigate to="/login" state={{ from: loc.pathname }} replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />
  return children
}

