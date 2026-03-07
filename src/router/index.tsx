import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { ProtectedRoute } from '../components/layout/ProtectedRoute'
import { LoginPage } from '../pages/LoginPage'
import { RegisterPage } from '../pages/RegisterPage'
import { HomePage } from '../pages/HomePage'
import { SongsPage } from '../pages/SongsPage'
import { SongCreatePage } from '../pages/SongCreatePage'
import { SongDetailPage } from '../pages/SongDetailPage'
import { CommunityPage } from '../pages/CommunityPage'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/songs', element: <SongsPage /> },
      { path: '/songs/new', element: <SongCreatePage /> },
      { path: '/songs/:slug', element: <SongDetailPage /> },
      { path: '/community', element: <CommunityPage /> },
    ],
  },
])
