import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../state/auth/AuthContext.jsx'
import { useToast } from '../state/toast/ToastContext.jsx'
import { getLastVerifyTokenFor } from '../state/auth/authStore.js'

export function LoginPage() {
  const { login } = useAuth()
  const { pushToast } = useToast()
  const nav = useNavigate()
  const loc = useLocation()

  const from = useMemo(() => loc.state?.from || '/', [loc.state])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')

  function onSubmit(e) {
    e.preventDefault()
    setError('')

    if (!username || !password) {
      setError('Username and password are required.')
      return
    }

    const res = login(username, password, { remember })
    if (!res.ok) {
      setError(res.error)
      pushToast({ kind: 'err', title: 'Login failed', message: res.error })
      return
    }

    pushToast({ kind: 'ok', title: 'Logged in' })
    nav(from, { replace: true })
  }

  const showVerifyCta = error === 'Please verify your email first.'

  function onVerifyClick() {
    const token = getLastVerifyTokenFor(username)
    if (!token) {
      pushToast({
        kind: 'err',
        title: 'Verification link not found',
        message: 'Please register again to generate a new verification link.',
      })
      return
    }
    nav(`/verify-email?token=${encodeURIComponent(token)}`)
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

        <div style={{ height: 12 }} />

        <label style={{ display: 'flex', gap: 10, alignItems: 'center', userSelect: 'none' }}>
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            data-testid="login-remember"
          />
          <span>Remember me</span>
        </label>

        {error ? (
          <>
            <div style={{ height: 10 }} />
            <div className="error" role="alert" data-testid="login-error">
              {error}
            </div>
          </>
        ) : null}

        {showVerifyCta ? (
          <>
            <div style={{ height: 12 }} />
            <button
              type="button"
              className="btn"
              onClick={onVerifyClick}
              data-testid="login-verify-cta"
            >
              Verify email
            </button>
          </>
        ) : null}

        <div style={{ height: 16 }} />

        <button className="btn btnPrimary" type="submit" data-testid="login-submit">
          Sign in
        </button>
      </form>

      <div style={{ height: 14 }} />
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link to="/register">Create account</Link>
        <span style={{ opacity: 0.5 }}>|</span>
        <Link to="/forgot-password">Forgot password?</Link>
      </div>
    </div>
  )
}

