interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
}

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <label className="inline-flex items-center gap-3 cursor-pointer min-h-[44px]">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-12 shrink-0 rounded-full border-2 border-transparent transition-all duration-300
          ${checked ? 'bg-brand-500 shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'bg-white/10 hover:bg-white/20'}`}
      >
        <span
          className={`pointer-events-none inline-block h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-300
            ${checked ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </button>
      {label && <span className="text-sm font-medium text-slate-200">{label}</span>}
    </label>
  )
}
