import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LoginForm } from '../components/auth/LoginForm'
import { FullPageSpinner } from '../components/ui/LoadingSpinner'

export function LoginPage() {
  const { user, loading } = useAuth()
  if (loading) return <FullPageSpinner />
  if (user) return <Navigate to="/" replace />
  return <LoginForm />
}
