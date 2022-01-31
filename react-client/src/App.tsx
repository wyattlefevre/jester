import React, { useEffect } from 'react'
import AuthProvider, { useAuth } from './components/auth/AuthProvider'
import { useLocation, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Login from './pages/Login'
import Host from './pages/Host'
import NotFound from './pages/NotFound'
import Signup from './pages/Signup'

const theme = createTheme()

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/protected"
              element={
                <RequireAuth>
                  <ProtectedPage />
                </RequireAuth>
              }
            />
            <Route
              path="/host"
              element={
                <RequireAuth>
                  <Host />
                </RequireAuth>
              }
            />
          </Route>
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  )
}

function RequireAuth({ children }: { children: JSX.Element }) {
  let auth = useAuth()
  let location = useLocation()
  useEffect(() => {
    auth
      .getSession()
      .then((session) => {
        if (!session) {
          console.error('session no longer active')
          return <Navigate to="/login" state={{ from: location }} replace />
        }
      })
      .catch((err) => {
        console.error(err)
        return <Navigate to="/login" state={{ from: location }} replace />
      })
  })
  return children
}

function ProtectedPage() {
  return <h3>Protected</h3>
}

export default App
