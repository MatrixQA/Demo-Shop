import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../state/auth/AuthContext.jsx'
import { useToast } from '../state/toast/ToastContext.jsx'

export function LoginPage() {
  const { login } = useAuth()
  const { pushToast } = useToast()
  const nav = useNavigate()
  const loc = useLocation()

  const from = useMemo(() => loc.state?.from || '/', [loc.state])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function onSubmit(e) {
    e.preventDefault()
    setError('')

    if (!username || !password) {
      setError('Username and password are required.')
      return
    }

    const res = login(username, password)
    if (!res.ok) {
      setError(res.error)
      pushToast({ kind: 'err', title: 'Login failed', message: res.error })
      return
    }

    pushToast({ kind: 'ok', title: 'Logged in' })
    nav(from, { replace: true })
  }

  return (
    <div className="card" style={{ maxWidth: 520, margin: '0 auto' }}>
      <h1 style={{ marginTop: 0 }}>Login</h1>

      <form onSubmit={onSubmit} data-testid="login-form">
        <div className="field">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            className="input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            data-testid="login-username"
          />
        </div>

        <div style={{ height: 12 }} />

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete="current-password"
            data-testid="login-password"
          />
        </div>

        {error ? (
          <>
            <div style={{ height: 10 }} />
            <div className="error" role="alert" data-testid="login-error">
              {error}
            </div>
          </>
        ) : null}

        <div style={{ height: 16 }} />

        <button className="btn btnPrimary" type="submit" data-testid="login-submit">
          Sign in
        </button>
      </form>
    </div>
  )
}

