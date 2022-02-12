import React, { useEffect } from 'react'
import { Button } from '@mui/material'
import { useAuth } from '../components/auth/AuthProvider'
import { helloApi, helloApiNoAuth } from '../services/api/ApiService'

const Host = () => {
  const auth = useAuth()
  const clickButton = () => {
    auth.getSession().then((res) => {
      console.log(res)
    })
  }

  useEffect(() => {
    helloApi()
      .then((data) => {
        console.log(data)
      })
      .catch((err) => {
        console.error(err)
        alert(err.message)
      })
  }, [])

  return (
    <div>
      <h1>host a game</h1>
      <p>choose from the list</p>
      <Button onClick={clickButton}>Show current user</Button>
    </div>
  )
}

export default Host
