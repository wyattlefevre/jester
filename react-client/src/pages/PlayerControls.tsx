import { AppBar, Button, OutlinedInput, Toolbar, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import { Prompt, PromptType } from '../services/Prompt'

const PlayerControls = () => {
  const { roomId } = useParams()
  const colors = ['#5000a6', '#a60000', '#a69200', '#3da600', '#00a64d', '#0053a6', '#9e00a6']
  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [message, setMessage] = useState<string | null>('message example')
  const [bgColor, setBgColor] = useState<string>('#5000a6')
  const [nickname, setNickname] = useState<string>('')
  const randomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)]
  }
  useEffect(() => {
    setBgColor(randomColor())
    const localNickName = localStorage.getItem('nickname')
    setNickname(localNickName || 'ERROR retrieving nickname')
    if (!roomId || !localNickName || !process.env.REACT_APP_API_SOCKET_URL) {
      return
    }
    const socket = io(process.env.REACT_APP_API_SOCKET_URL)
    socket.on('connect', () => {
      socket.emit('join-room', roomId, localNickName)
    })

    socket.on('prompt', (prompt: Prompt) => {
      console.log('received prompt', prompt)
      console.log('prompt', prompt)
      setPrompt(prompt)
    })
    socket.on('message', (msg) => {
      setMessage(msg)
    })
    console.log('play game as', localNickName)
  }, [])

  const renderResponseOptions = () => {
    console.log('render response options', prompt)
    if (prompt && prompt.rules.type === PromptType.Selection) {
      const buttonColor = randomColor()
      return (
        <>
          {prompt.rules.responseOptions &&
            prompt.rules.responseOptions.map((option, index) => {
              return (
                <Button
                  key={index}
                  variant="contained"
                  color="primary"
                  sx={{ mx: 1, backgroundColor: buttonColor }}
                >
                  {option}
                </Button>
              )
            })}
        </>
      )
    } else {
      let inputs = []
      if (prompt) {
        for (let i = 0; i < prompt.rules.limit; i++) {
          inputs.push(<OutlinedInput />)
        }
      }
      return inputs
    }
  }

  const renderPrompt = () => {
    return (
      <>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 2,
          }}
        >
          <Typography variant="h4" textAlign="center">
            {prompt?.prompt}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 2,
          }}
        >
          {renderResponseOptions()}
        </Box>
      </>
    )
  }

  return (
    <div>
      <AppBar position="static" sx={{ backgroundColor: bgColor }}>
        <Toolbar>
          <Typography>{nickname}</Typography>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: '#292929',
          color: 'white',
        }}
      >
        <Typography>Room {roomId}</Typography>
      </Box>
      {prompt && renderPrompt()}
    </div>
  )
}

export default PlayerControls
