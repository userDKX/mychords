import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#030712] relative overflow-hidden">
      {/* Dynamic Backgrounds */}
      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-brand-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="bg-white/[0.02] border border-white/[0.05] p-8 md:p-10 rounded-[2.5rem] backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 blur-[60px] rounded-full pointer-events-none" />

          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-white/70 mb-3 tracking-tight">MyChords</h1>
            <p className="text-slate-400 font-medium tracking-wide">Inicia sesión en tu cuenta</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />
            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            {error && <p className="text-sm font-medium text-rose-400 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full py-4 text-base shadow-[0_0_20px_rgba(99,102,241,0.25)] mt-4">
              {loading ? 'Entrando...' : 'Iniciar sesión'}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-slate-400">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-brand-400 hover:text-brand-300 hover:underline underline-offset-4 transition-all">Regístrate</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
