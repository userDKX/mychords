import { useEffect, type ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-[#030712]/80 backdrop-blur-sm transition-opacity" />
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-slate-900 border border-white/10 p-6 sm:p-8 shadow-2xl animate-in slide-in-from-bottom sm:slide-in-from-bottom-8 duration-300 fade-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="mx-auto w-12 h-1.5 bg-white/10 rounded-full mb-6 sm:hidden" />

        {title && (
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
            <h2 className="text-xl font-bold text-slate-100 tracking-tight">{title}</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-rose-400 bg-white/5 hover:bg-rose-500/10 rounded-full p-2.5 transition-colors flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 5l10 10M15 5L5 15" />
              </svg>
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
