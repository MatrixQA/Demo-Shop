import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '../state/toast/ToastContext.jsx'
import { register } from '../state/auth/authStore.js'

export function RegisterPage() {
  const { pushToast } = useToast()
  const nav = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [verifyToken, setVerifyToken] = useState(null)

  const verifyUrl = useMemo(() => {
    if (!verifyToken) return null
    return `/verify-email?token=${encodeURIComponent(verifyToken)}`
  }, [verifyToken])

  function onSubmit(e) {
    e.preventDefault()
    setError('')

    const res = register({ username, email, password })
    if (!res.ok) {
      setError(res.error)
      pushToast({ kind: 'err', title: 'Registration failed', message: res.error })
      return
    }

    setVerifyToken(res.token)
    pushToast({ kind: 'ok', title: 'Account created', message: 'Verify your email to log in.' })
  }

  return (
    <div className="card" style={{ maxWidth: 560, margin: '0 auto' }}>
      <h1 style={{ marginTop: 0 }}>Create account</h1>

      <form onSubmit={onSubmit} data-testid="register-form">
        <div className="field">
          <label htmlFor="reg-username">Username</label>
          <input
            id="reg-username"
            className="input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            data-testid="register-username"
          />
        </div>

        <div style={{ height: 12 }} />

        <div className="field">
          <label htmlFor="reg-email">Email</label>
          <input
            id="reg-email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            data-testid="register-email"
          />
        </div>

        <div style={{ height: 12 }} />

        <div className="field">
          <label htmlFor="reg-password">Password</label>
          <input
            id="reg-password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete="new-password"
            data-testid="register-password"
          />
        </div>

        {error ? (
          <>
            <div style={{ height: 10 }} />
            <div className="error" role="alert" data-testid="register-error">
              {error}
            </div>
          </>
        ) : null}

        <div style={{ height: 16 }} />

        <button className="btn btnPrimary" type="submit" data-testid="register-submit">
          Register
        </button>
        <button className="btn" type="button" onClick={() => nav('/login')} style={{ marginLeft: 10 }}>
          Back to login
        </button>
      </form>

      {verifyUrl ? (
        <>
          <div style={{ height: 18 }} />
          <div className="card" style={{ background: '#0b1220', color: '#e6edf6' }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Demo email verification</div>
            <div style={{ opacity: 0.9, marginBottom: 10 }}>
              In a real app we’d email you a verification link. For this demo, click:
            </div>
            <Link to={verifyUrl} className="btn btnPrimary" data-testid="register-verify-email">
              Verify email
            </Link>
          </div>
        </>
      ) : null}

      <div style={{ height: 14 }} />
      <div style={{ opacity: 0.8 }}>
        Already have an account? <Link to="/login">Sign in</Link>
      </div>
    </div>
  )
}

