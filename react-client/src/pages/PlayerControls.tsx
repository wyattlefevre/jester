import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { io, Socket } from 'socket.io-client'

const PlayerControls = () => {
  const { roomId } = useParams()

  const [playerSocket, setPlayerSocket] = useState<Socket | null>()
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
    })
    console.log('play game as', nickname)
  }, [])
  return <div>Play {roomId}</div>
}

export default PlayerControls
