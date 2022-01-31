import React, { useState } from 'react'
import { AppBar, Box, Button, IconButton, Toolbar, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './auth/AuthProvider'
import { Home as HomeIcon } from '@mui/icons-material'

interface NavbarProps {
  username: string
}

const Navbar = (props: NavbarProps) => {
  const navigate = useNavigate()
  const auth = useAuth()
  const loginLogoutButton = () => {
    console.log('rendering login button')
    if (auth.getCurrentUser() !== null) {
      return (
        <Button
          onClick={() => {
            auth.logout()
          }}
          color="secondary"
          variant="contained"
        >
          Logout
        </Button>
      )
    }
    return (
      <Button
        onClick={() => {
          console.log('navigate to login')
          navigate('/login')
        }}
        color="secondary"
        variant="contained"
      >
        Login
      </Button>
    )
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            onClick={() => navigate('/')}
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 1 }}
          >
            <HomeIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            JESTER
          </Typography>
          <Typography variant="body1" component="div" sx={{ marginRight: 2 }}>
            {props.username}
          </Typography>
          {loginLogoutButton()}
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Navbar
