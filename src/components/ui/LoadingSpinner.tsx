export function LoadingSpinner({ size = 24 }: { size?: number }) {
  return (
    <div className="relative justify-center items-center flex" style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full border-[3px] border-white/5" />
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className="animate-spin text-brand-500 drop-shadow-[0_0_10px_rgba(99,102,241,0.6)] absolute inset-0"
      >
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

export function FullPageSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#030712] animate-in fade-in duration-300">
      <div className="relative flex justify-center items-center">
        <div className="absolute w-[100px] h-[100px] bg-brand-500/10 blur-[30px] rounded-full" />
        <LoadingSpinner size={48} />
      </div>
    </div>
  )
}
