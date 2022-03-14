import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { io, Socket } from 'socket.io-client'

const PlayerControls = () => {
  const { roomId } = useParams()

  const [playerSocket, setPlayerSocket] = useState<Socket | null>()
  const [prompt, setPrompt] = useState<string>('')
  useEffect(() => {
    const nickname = localStorage.getItem('nickname')
    if (!roomId || !nickname || !process.env.REACT_APP_API_SOCKET_URL) {
      return
    }
    const socket = io(process.env.REACT_APP_API_SOCKET_URL)
    socket.on('connect', () => {
      socket.emit('join-room', roomId, nickname)
    })

    socket.on('prompt', (msg) => {
      console.log(msg)
      setPrompt(msg)
    })
    console.log('play game as', nickname)
    setPlayerSocket(socket) // TODO: do I actually need this?
  }, [])

  return (
    <div>
      <h1>Play {roomId}</h1>
      {prompt && <h2>{prompt}</h2>}
    </div>
  )
}

export default PlayerControls
