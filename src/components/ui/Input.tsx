import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-semibold tracking-wide text-slate-300 mb-2 pl-1 uppercase text-[11px]">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-slate-100 backdrop-blur-md
          placeholder:text-slate-500 focus:border-brand-500/50 focus:bg-white/[0.05] focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all duration-300
          min-h-[44px] ${error ? 'border-rose-500/50 focus:ring-rose-500/10 focus:border-rose-500/50' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-2 pl-1 text-xs font-medium text-rose-400">{error}</p>}
    </div>
  )
}
