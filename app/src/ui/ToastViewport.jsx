import { useToast } from '../state/toast/ToastContext.jsx'

export function ToastViewport() {
  const { toasts } = useToast()

  if (!toasts.length) return null

  return (
    <div className="toastWrap" aria-live="polite" aria-relevant="additions">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast ${t.kind === 'ok' ? 'toastOk' : 'toastErr'}`}
          role="status"
          data-testid={`toast-${t.kind}`}
        >
          <div style={{ fontWeight: 700 }}>{t.title}</div>
          {t.message ? <div className="muted">{t.message}</div> : null}
        </div>
      ))}
    </div>
  )
}

