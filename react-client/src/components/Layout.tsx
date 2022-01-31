import { Box } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from './auth/AuthProvider'
import Navbar from './Navbar'

const Layout = () => {
  const auth = useAuth()
  return (
    <div>
      <Navbar username={auth.user?.getUsername() || ''} />
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Outlet />
      </Box>
    </div>
  )
}

export default Layout
