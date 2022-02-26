import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { io, Socket } from 'socket.io-client'
import { useAuth } from '../components/auth/AuthProvider'
import { getCurrentToken } from '../services/auth/Token'

const GameRoom = () => {
  const { roomId } = useParams()
  const [socket, setSocket ]= useState<Socket | null>()
  // TODO: attempt to connect here
  useEffect(() => {
    const newSocket = io("http://localhost:8000")
    newSocket.on("connect", () => {
      newSocket.emit('join-room-as-host', roomId, getCurrentToken())
      setSocket(newSocket)
    })
    return (() => {
      newSocket.disconnect()
    })
  }, [])
  

  return <div>GameRoom {roomId}</div>
}

export default GameRoom
