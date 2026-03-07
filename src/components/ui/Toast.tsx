import { useEffect, useState } from 'react'

interface ToastMessage {
  id: number
  text: string
  type: 'error' | 'success' | 'warning'
}

let toastId = 0
let addToastFn: ((text: string, type: ToastMessage['type']) => void) | null = null

export function showToast(text: string, type: ToastMessage['type'] = 'error') {
  addToastFn?.(text, type)
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  useEffect(() => {
    addToastFn = (text, type) => {
      const id = ++toastId
      setToasts(prev => [...prev, { id, text, type }])
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
    }
    return () => { addToastFn = null }
  }, [])

  if (toasts.length === 0) return null

  const colors = {
    error: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
    success: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
    warning: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
  }

  const icons = {
    error: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>,
    success: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>,
    warning: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg>,
  }

  return (
    <div className="fixed top-4 left-4 right-4 z-[100] flex flex-col items-center gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-2xl border backdrop-blur-xl shadow-2xl text-sm font-medium animate-in slide-in-from-top fade-in duration-300 max-w-md w-full ${colors[toast.type]}`}
        >
          {icons[toast.type]}
          {toast.text}
        </div>
      ))}
    </div>
  )
}
