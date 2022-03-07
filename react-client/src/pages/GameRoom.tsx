import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { io, Socket } from 'socket.io-client'
import { useAuth } from '../components/auth/AuthProvider'
import { getCurrentToken } from '../services/auth/Token'

const GameRoom = () => {
  const { roomId } = useParams()
  const [hostSocket, setHostSocket] = useState<Socket | null>()
  const [players, setPlayers] = useState<string[]>([])
  const currentToken = getCurrentToken()
  useEffect(() => {
    if (!roomId || !currentToken || !process.env.REACT_APP_API_SOCKET_URL) {
      return
    }
    const socket = io(process.env.REACT_APP_API_SOCKET_URL)
    socket.on('connect', () => {
      socket.emit('join-room-as-host', roomId, currentToken, (message: string) => {
        console.log(message)
      })
    })
    socket.on('error', (msg) => {
      console.log('error emitted from server')
      console.error(msg)
    })
    socket.on('update-player-list', (playerList: string[]) => {
      setPlayers(playerList)
    })

    setHostSocket(socket)
    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <div>
      <h1>GameRoom {roomId}</h1>
      {players.map((player) => (
        <h2>{player}</h2>
      ))}
    </div>
  )
}

export default GameRoom
