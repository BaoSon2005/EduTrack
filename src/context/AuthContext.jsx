/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'
import { roles, users } from '../data/mockDatabase'

const AuthContext = createContext(null)

const roleProfileIds = {
  admin: 'user-admin',
  training: 'user-training',
  teacher: 'teacher-thorne',
  student: 'student-alice',
}

export function AuthProvider({ children }) {
  const [role, setRole] = useState('training')

  const value = useMemo(() => {
    const currentUser = users.find((user) => user.id === roleProfileIds[role]) ?? users[0]
    const currentRole = roles.find((item) => item.id === role) ?? roles[0]

    return {
      role,
      roles,
      currentRole,
      currentUser,
      setRole,
    }
  }, [role])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
