import React, { useState } from 'react'
import Pool from '../../services/auth/UserPool'
import { CognitoUser, AuthenticationDetails, CognitoUserSession } from 'amazon-cognito-identity-js'

interface AuthContextType {
  authenticate: (Username: string, Password: string) => Promise<CognitoUserSession | null>
  getSession: () => Promise<CognitoUserSession | null>
  logout: () => void
  user: CognitoUser | null
}

const AuthContext = React.createContext<AuthContextType>(null!)

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<CognitoUser | null>(Pool.getCurrentUser())

  const getSession: () => Promise<CognitoUserSession | null> = async () => {
    return await new Promise((resolve, reject) => {
      const currentUser = Pool.getCurrentUser()
      if (currentUser) {
        currentUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
          if (err) {
            reject()
          } else {
            resolve(session)
          }
        })
      } else {
        reject()
      }
    })
  }

  const authenticate: (
    Username: string,
    Password: string,
  ) => Promise<CognitoUserSession | null> = async (Username: string, Password: string) => {
    return await new Promise((resolve, reject) => {
      const currentUser = new CognitoUser({ Username, Pool })
      const authDetails = new AuthenticationDetails({ Username, Password })

      currentUser.authenticateUser(authDetails, {
        onSuccess: (data) => {
          console.log('onSuccess: ', data)
          setUser(currentUser)
          resolve(data)
        },
        onFailure: (err) => {
          console.error('onFailure: ', err)
          reject(err)
        },
        newPasswordRequired: (data) => {
          console.log('newPasswordRequired: ', data)
          resolve(data)
        },
      })
    })
  }

  const logout = () => {
    const currentUser = Pool.getCurrentUser()
    if (currentUser) {
      currentUser.signOut()
      setUser(Pool.getCurrentUser())
    }
  }

  const value = { authenticate, getSession, logout, user }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return React.useContext(AuthContext)
}

export default AuthProvider
