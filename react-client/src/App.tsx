import React, { useEffect } from 'react'
import AuthProvider, { useAuth } from './components/auth/AuthProvider'
import { useLocation, Routes, Route, useNavigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Login from './pages/Login'
import Host from './pages/Host'
import NotFound from './pages/NotFound'
import Signup from './pages/Signup'
import GameSettings from './pages/GameSettings'
import GameRoom from './pages/GameRoom'
import PlayerControls from './pages/PlayerControls'

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
            <Route
              path="/game/:gameId/settings"
              element={
                <RequireAuth>
                  <GameSettings />
                </RequireAuth>
              }
            />
            <Route
              path="/game/room/:roomId"
              element={
                <RequireAuth>
                  <GameRoom />
                </RequireAuth>
              }
            />
            <Route path="/game/play/:roomId" element={<PlayerControls />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  )
}

function RequireAuth({ children }: { children: JSX.Element }) {
  let auth = useAuth()
  let location = useLocation()
  const navigate = useNavigate()
  useEffect(() => {
    auth
      .getSession()
      .then((session) => {
        if (!session) {
          console.error('session no longer active')
          navigate('/login', { state: { from: location } })
        }
      })
      .catch((err) => {
        console.error(err)
        navigate('/login', { state: { from: location } })
      })
  })
  return children
}

function ProtectedPage() {
  return <h3>Protected</h3>
}

export default App
