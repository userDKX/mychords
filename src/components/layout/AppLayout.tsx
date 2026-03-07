import { NavLink, Outlet, useLocation } from 'react-router-dom'
import type { SVGProps } from 'react'

const navItems = [
  { to: '/', label: 'Inicio', icon: UserIcon },
  { to: '/songs', label: 'Mis Canciones', icon: MusicIcon },
  { to: '/community', label: 'Comunidad', icon: GlobeIcon },
]

export function AppLayout() {
  const location = useLocation()

  const hideMobileNav = location.pathname.match(/^\/songs\/.+/)

  return (
    <div className="min-h-dvh bg-[#030712] flex flex-col items-center relative overflow-hidden">
      {/* Background gradients for premium feel */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-600/15 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/15 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <div className="w-full max-w-7xl flex flex-col min-h-dvh relative z-10">
        {/* Header - desktop */}
        <header className="hidden md:flex items-center justify-between px-6 py-4 mt-6 mx-6 rounded-2xl glass-panel">
          <NavLink to="/" className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-white/70">
            MyChords
          </NavLink>
          <nav className="flex items-center gap-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300
                  ${isActive ? 'bg-brand-500/10 text-brand-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] ring-1 ring-white/5' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4 h-4 transition-transform ${isActive ? 'scale-110' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                    {label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </header>

        {/* Content */}
        <main className={`flex-1 w-full pt-6 md:pt-10 px-4 md:px-6 ${hideMobileNav ? 'pb-12' : 'md:pb-12'}`} style={!hideMobileNav ? { paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 7rem)' } : undefined}>
          <Outlet />
        </main>
      </div>

      {/* Bottom tab bar - mobile */}
      {!hideMobileNav && (
        <nav className="md:hidden fixed left-4 right-4 glass-panel rounded-2xl flex justify-around p-2 z-50" style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1.5 py-2.5 px-3 text-[11px] font-medium rounded-xl flex-1 transition-all duration-300
                ${isActive ? 'text-brand-400 bg-brand-500/15 ring-1 ring-brand-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]' : 'text-slate-500 hover:text-slate-300'}`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  )
}

function UserIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function MusicIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
    </svg>
  )
}

function GlobeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}
