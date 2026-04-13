import { useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useToast } from '../state/toast/ToastContext.jsx'
import { verifyEmail } from '../state/auth/authStore.js'

export function VerifyEmailPage() {
  const { pushToast } = useToast()
  const [params] = useSearchParams()
  const token = params.get('token') || ''

  const res = useMemo(() => verifyEmail(token), [token])

  useEffect(() => {
    if (!res.ok) {
      pushToast({ kind: 'err', title: 'Verification failed', message: res.error })
      return
    }
    pushToast({ kind: 'ok', title: 'Email verified' })
  }, [pushToast, res])

  return (
    <div className="card" style={{ maxWidth: 560, margin: '0 auto' }}>
      <h1 style={{ marginTop: 0 }}>Verify email</h1>

      {res.ok ? (
        <div style={{ color: '#16a34a', fontWeight: 700 }}>
          Email verified for {res.username}. You can now log in.
        </div>
      ) : null}
      {!res.ok ? (
        <div className="error" role="alert">
          {res.error}
        </div>
      ) : null}

      <div style={{ height: 16 }} />
      <Link to="/login" className="btn btnPrimary">
        Go to login
      </Link>
    </div>
  )
}

