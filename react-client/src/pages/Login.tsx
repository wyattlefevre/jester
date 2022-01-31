import { Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../components/auth/AuthProvider'
import LoginForm from '../components/LoginForm'

interface LocationState {
  from: {
    pathname: string
  }
}

const Login = () => {
  let navigate = useNavigate()
  let location = useLocation()
  let auth = useAuth()

  let from = (location.state as LocationState)?.from?.pathname || '/'

  useEffect(() => {
    if (auth?.user !== null) {
      navigate(from, { replace: true })
    }
  })

  const handleCredentials = (
    email: string,
    setEmailError: React.Dispatch<React.SetStateAction<boolean>>,
    password: string,
    setPasswordError: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    if (email && password) {
      setEmailError(false)
      setPasswordError(false)
      console.log('email', email)
      console.log('password', password)
      auth.signin(email, () => {
        // Send them back to the page they tried to visit when they were
        // redirected to the login page. Use { replace: true } so we don't create
        // another entry in the history stack for the login page.  This means that
        // when they get to the protected page and click the back button, they
        // won't end up back on the login page, which is also really nice for the
        // user experience.
        navigate(from, { replace: true })
      })
    } else {
      setEmailError(email ? false : true)
      setPasswordError(password ? false : true)
    }
  }

  return (
    <div>
      <Typography sx={{ mt: 6, mb: 2 }} variant="h5" align="center">
        Login
      </Typography>
      <LoginForm callback={handleCredentials} buttonText="Login" />
      <Typography variant="body2" align="center">
        Don't have an account? <Link to="/signup">Sign up here</Link>
      </Typography>
    </div>
  )
}

export default Login
