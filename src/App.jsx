import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Layout, getAllowedRoutes } from './components/Layout'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Accounts } from './pages/Accounts'
import { Dashboard } from './pages/Dashboard'
import { DocumentsChat } from './pages/DocumentsChat'
import { Grades } from './pages/Grades'
import { Schedule } from './pages/Schedule'
import { Settings } from './pages/Settings'

function RoleGate({ children }) {
  const { role } = useAuth()
  const location = useLocation()
  const allowedRoutes = getAllowedRoutes(role)

  if (!allowedRoutes.includes(location.pathname)) {
    return <Navigate to="/" replace />
  }

  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        element={
          <RoleGate>
            <Layout />
          </RoleGate>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="grades" element={<Grades />} />
        <Route path="documents" element={<DocumentsChat />} />
        <Route path="settings" element={<Settings />} />
        <Route path="accounts" element={<Accounts />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
