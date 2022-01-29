import React from 'react'
import { AppBar, Box, Button, IconButton, Toolbar, Typography } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './auth/AuthProvider'
import { Menu as MenuIcon } from '@mui/icons-material'

type NavbarProps = {
  username: string
}

const Navbar = (props: NavbarProps) => {
  const navigate = useNavigate()
  const auth = useAuth()
  const loggedIn = auth?.user !== null
  const location = useLocation()
  console.log('location', location)
  const clickLogin = () => {
    console.log('clicked button')
    if (loggedIn) {
      console.log('calling signout')
      auth.signout(() => {})
    } else {
      console.log('should not hit')
      navigate('/login')
    }
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            JESTER
          </Typography>
          <Typography variant="body1" component="div" sx={{ marginRight: 2 }}>
            {props.username}
          </Typography>
          {!(location.pathname === '/login') && (
            <Button onClick={clickLogin} color="secondary" variant="contained">
              {loggedIn ? 'Logout' : 'Login'}
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Navbar
