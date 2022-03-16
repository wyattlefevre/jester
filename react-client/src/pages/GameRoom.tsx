import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { io, Socket } from 'socket.io-client'
import { useAuth } from '../components/auth/AuthProvider'
import { getCurrentToken } from '../services/auth/Token'

const GameRoom = () => {
  const { roomId, gameId } = useParams()
  const [hostSocket, setHostSocket] = useState<Socket | null>()
  const [message, setMessage] = useState<string | null>('message example')
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
      console.log('update-player-list')
      setPlayers(playerList)
    })
    socket.on('player-join', (nickname: string) => {
      console.log('player joined', nickname)
    })

    socket.on('message', (msg) => {
      setMessage(msg)
    })

    setHostSocket(socket)
    return () => {
      socket.disconnect()
    }
  }, [])

  const startGame = () => {
    console.log('attempting game start')
    hostSocket?.emit('start-game')
  }

  return (
    <div>
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography textAlign="center" sx={{ fontSize: '2.5rem' }}>
            Room - {roomId}
          </Typography>
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
        {players.map((player, index) => (
          <Typography sx={{ mx: 2 }} key={index}>
            {player}
          </Typography>
        ))}
      </Box>
      <Button variant="contained" onClick={startGame}>
        Start Game
      </Button>
    </div>
  )
}

export default GameRoom
