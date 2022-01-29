import { Box } from '@mui/material'
import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useAuth } from './auth/AuthProvider'
import Navbar from './Navbar'

const Layout = () => {
  const auth = useAuth()
  return (
    <div>
      <Navbar username={auth.user} />
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Outlet />
      </Box>
    </div>
  )
}

export default Layout
