import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import socket from './services/socket'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Settings from './pages/Settings'
import Admin from './pages/Admin'
import Chat from './pages/Chat'
import Apply from './pages/Apply'

function ProtectedRoute({ children }) {
  const { token, user, isLoading } = useAuthStore()

  useEffect(() => {
    if (token && user) socket.connect(token)
    else socket.disconnect()
    return () => socket.disconnect()
  }, [token, user])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!token) return <Navigate to="/login" replace />
  return children
}

function AdminRoute({ children }) {
  const { user } = useAuthStore()
  if (user?.role !== 'admin') return <Navigate to="/" replace />
  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="settings" element={<Settings />} />
          <Route path="chat" element={<Chat />} />
          <Route path="chat/:roomId" element={<Chat />} />
          <Route path="admin" element={<AdminRoute><Admin /></AdminRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
