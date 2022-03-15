import { Button, OutlinedInput } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { io, Socket } from 'socket.io-client'

interface Prompt {
  promptId: string
  promptText: string
  responseOptions: string[]
}

const PlayerControls = () => {
  const { roomId } = useParams()

  const [playerSocket, setPlayerSocket] = useState<Socket | null>()
  const [prompt, setPrompt] = useState<Prompt | null>(null)
  useEffect(() => {
    const nickname = localStorage.getItem('nickname')
    if (!roomId || !nickname || !process.env.REACT_APP_API_SOCKET_URL) {
      return
    }
    const socket = io(process.env.REACT_APP_API_SOCKET_URL)
    socket.on('connect', () => {
      socket.emit('join-room', roomId, nickname)
    })

    socket.on('prompt', (promptId: string, prompt: string, responseOptions: string[]) => {
      console.log('prompt', promptId, prompt, responseOptions)
      setPrompt({ promptId: promptId, promptText: prompt, responseOptions: responseOptions })
    })
    console.log('play game as', nickname)
    setPlayerSocket(socket) // TODO: do I actually need this?
  }, [])

  const renderResponseOptions = () => {
    if (prompt && prompt.responseOptions.length > 0) {
      return (
        <>
          {prompt.responseOptions.map((option, index) => {
            return <Button key={index}>{option}</Button>
          })}
        </>
      )
    } else {
      return <OutlinedInput />
    }
  }

  return (
    <div>
      <h1>Play {roomId}</h1>
      {prompt && <h2>{prompt.promptText}</h2>}
      {renderResponseOptions()}
    </div>
  )
}

export default PlayerControls
