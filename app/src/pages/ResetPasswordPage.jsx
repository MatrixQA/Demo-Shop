import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useToast } from '../state/toast/ToastContext.jsx'
import { resetPassword } from '../state/auth/authStore.js'

export function ResetPasswordPage() {
  const { pushToast } = useToast()
  const nav = useNavigate()
  const [params] = useSearchParams()
  const token = params.get('token') || ''

  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('')
  const [ok, setOk] = useState(false)

  function onSubmit(e) {
    e.preventDefault()
    setError('')

    const res = resetPassword({ token, newPassword })
    if (!res.ok) {
      setError(res.error)
      pushToast({ kind: 'err', title: 'Reset failed', message: res.error })
      return
    }

    setOk(true)
    pushToast({ kind: 'ok', title: 'Password updated' })
    setTimeout(() => nav('/login', { replace: true }), 500)
  }

  return (
    <div className="card" style={{ maxWidth: 560, margin: '0 auto' }}>
      <h1 style={{ marginTop: 0 }}>Reset password</h1>

      <form onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="rp-password">New password</label>
          <input
            id="rp-password"
            className="input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            type="password"
            autoComplete="new-password"
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

        {ok ? (
          <>
            <div style={{ height: 10 }} />
            <div style={{ color: '#16a34a', fontWeight: 700 }}>
              Password updated. Redirecting to login…
            </div>
          </>
        ) : null}

        <div style={{ height: 16 }} />
        <button className="btn btnPrimary" type="submit">
          Update password
        </button>
        <Link to="/login" className="btn" style={{ marginLeft: 10 }}>
          Back to login
        </Link>
      </form>
    </div>
  )
}

