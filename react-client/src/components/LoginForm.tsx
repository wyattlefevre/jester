import { Button, TextField } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'

interface LoginFormProps {
  callback: (
    email: string,
    setEmailError: React.Dispatch<React.SetStateAction<boolean>>,
    password: string,
    setPasswordError: React.Dispatch<React.SetStateAction<boolean>>,
  ) => void
  buttonText: string
}

const LoginForm = ({ callback, buttonText }: LoginFormProps) => {
  const [email, setEmail] = useState<string>('')
  const [emailError, setEmailError] = useState<boolean>(false)

  const [password, setPassword] = useState<string>('')
  const [passwordError, setPasswordError] = useState<boolean>(false)
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    callback(email, setEmailError, password, setPasswordError)
  }

  return (
    <Box sx={{ my: 2 }}>
      <form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: 300, alignItems: 'center' }}>
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            error={emailError}
            fullWidth
          />
          <TextField
            sx={{ my: 1 }}
            value={password}
            label="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
            error={passwordError}
            fullWidth
          />
          <Button type="submit" variant="contained" sx={{ width: 300 }}>
            {buttonText}
          </Button>
        </Box>
      </form>
    </Box>
  )
}

export default LoginForm
