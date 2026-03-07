import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { RegisterForm } from '../components/auth/RegisterForm'
import { FullPageSpinner } from '../components/ui/LoadingSpinner'

export function RegisterPage() {
  const { user, loading } = useAuth()
  if (loading) return <FullPageSpinner />
  if (user) return <Navigate to="/" replace />
  return <RegisterForm />
}
