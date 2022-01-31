import { Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
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
  const [errMessage, setErrMessage] = useState<string>('')

  useEffect(() => {
    if (auth.user !== null) {
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
      auth
        .authenticate(email, password)
        .then((data) => {
          navigate(from, { replace: true })
        })
        .catch((err) => {
          console.error(err)
          setErrMessage(err.message)
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
      <LoginForm callback={handleCredentials} buttonText="Login" errMessage={errMessage} />
      <Typography variant="body2" align="center">
        Don't have an account? <Link to="/signup">Sign up here</Link>
      </Typography>
    </div>
  )
}

export default Login
