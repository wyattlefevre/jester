import { Box } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from './auth/AuthProvider'
import Navbar from './Navbar'

const Layout = () => {
  const auth = useAuth()
  const username = auth.getCurrentUser()?.getUsername()
  console.log('username', username)
  return (
    <div>
      <Navbar username={username || ''} />
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Outlet />
      </Box>
    </div>
  )
}

export default Layout
