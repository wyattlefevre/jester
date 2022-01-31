import { Typography } from '@mui/material'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import LoginForm from '../components/LoginForm'
import UserPool from '../services/auth/UserPool'

const Signup = () => {
  const [errMessage, setErrMessage] = useState<string>('')
  const handleCredentials = (
    email: string,
    setEmailError: React.Dispatch<React.SetStateAction<boolean>>,
    password: string,
    setPasswordError: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    if (email && password) {
      setEmailError(false)
      setPasswordError(false)
      console.log('signing up')
      UserPool.signUp(email, password, [], [], (err, data) => {
        if (err) {
          console.log(err)
          setErrMessage(err.message)
        } else {
          setErrMessage('')
        }
        console.log(data)
      })
    } else {
      setErrMessage('Missing required field')
      setEmailError(email ? false : true)
      setPasswordError(password ? false : true)
    }
  }

  return (
    <div>
      <Typography sx={{ mt: 6, mb: 2 }} variant="h5" align="center">
        Sign Up
      </Typography>
      <LoginForm callback={handleCredentials} buttonText="Sign Up" errMessage={errMessage} />
      <Typography variant="body2" align="center">
        Already have an account? <Link to="/login">Login.</Link>
      </Typography>
    </div>
  )
}

export default Signup
