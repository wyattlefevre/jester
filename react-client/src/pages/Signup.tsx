import { Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import LoginForm from '../components/LoginForm'

const Signup = () => {
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
    } else {
      email || setEmailError(true)
      password || setPasswordError(true)
    }
  }

  return (
    <div>
      <Typography sx={{ mt: 6, mb: 2 }} variant="h5" align="center">
        Sign Up
      </Typography>
      <LoginForm callback={handleCredentials} buttonText="Sign Up" />
      <Typography variant="body2" align="center">
        Already have an account? <Link to="/login">Login.</Link>
      </Typography>
    </div>
  )
}

export default Signup
