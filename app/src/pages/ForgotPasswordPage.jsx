import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useToast } from '../state/toast/ToastContext.jsx'
import { requestPasswordReset } from '../state/auth/authStore.js'

export function ForgotPasswordPage() {
  const { pushToast } = useToast()

  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [resetToken, setResetToken] = useState(null)

  const resetUrl = useMemo(() => {
    if (!resetToken) return null
    return `/reset-password?token=${encodeURIComponent(resetToken)}`
  }, [resetToken])

  function onSubmit(e) {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Email is required.')
      return
    }

    const res = requestPasswordReset(email)
    if (!res.ok) {
      setError(res.error)
      pushToast({ kind: 'err', title: 'Request failed', message: res.error })
      return
    }

    // Always show success to avoid account enumeration.
    pushToast({ kind: 'ok', title: 'Check your email', message: 'If an account exists, we sent a reset link.' })
    setResetToken(res.token)
  }

  return (
    <div className="card" style={{ maxWidth: 560, margin: '0 auto' }}>
      <h1 style={{ marginTop: 0 }}>Forgot password</h1>

      <form onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="fp-email">Email</label>
          <input
            id="fp-email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        {error ? (
          <>
            <div style={{ height: 10 }} />
            <div className="error" role="alert">
              {error}
            </div>
          </>
        ) : null}

        <div style={{ height: 16 }} />
        <button className="btn btnPrimary" type="submit">
          Send reset link
        </button>
        <Link to="/login" className="btn" style={{ marginLeft: 10 }}>
          Back to login
        </Link>
      </form>

      {resetUrl ? (
        <>
          <div style={{ height: 18 }} />
          <div className="card" style={{ background: '#0b1220', color: '#e6edf6' }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Demo password reset</div>
            <div style={{ opacity: 0.9, marginBottom: 10 }}>
              In a real app we’d email you a reset link. For this demo, click:
            </div>
            <Link to={resetUrl} className="btn btnPrimary">
              Reset password
            </Link>
          </div>
        </>
      ) : null}
    </div>
  )
}

