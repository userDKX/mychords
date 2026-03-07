import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { FullPageSpinner } from '../ui/LoadingSpinner'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <FullPageSpinner />
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}
