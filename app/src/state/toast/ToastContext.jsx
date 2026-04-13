/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const value = useMemo(() => {
    function pushToast({ kind, title, message }) {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
      const toast = { id, kind, title, message }
      setToasts((t) => [toast, ...t].slice(0, 3))
      window.setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== id))
      }, 2500)
    }

    return { toasts, pushToast }
  }, [toasts])

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

