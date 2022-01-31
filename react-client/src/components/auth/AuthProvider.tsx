import React, { useEffect } from 'react'
import { fakeAuthProvider } from '../../services/auth/auth'

interface AuthContextType {
  user: any //TODO: set type?
  signin: (user: string, callback: VoidFunction) => void
  signout: (callback: VoidFunction) => void
}

const AuthContext = React.createContext<AuthContextType>(null!)

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<any>(null) //TODO: set user type?
  const signin = (newUser: string, callback: VoidFunction) => {
    return fakeAuthProvider.signin(() => {
      setUser(newUser)
      localStorage.setItem('user', newUser)
      callback()
    })
  }

  const signout = (callback: VoidFunction) => {
    return fakeAuthProvider.signout(() => {
      setUser(null)
      localStorage.removeItem('user')
      callback()
    })
  }

  const value = { user, signin, signout }

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser !== null) {
      setUser(savedUser)
    }
  })
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return React.useContext(AuthContext)
}

export default AuthProvider
