import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { io, Socket } from 'socket.io-client'
import HostMessages from '../components/HostMessages'
import { getCurrentToken } from '../services/auth/Token'
import HostMessage from '../services/HostMessage'
import { ClientEvents } from '../services/SocketEvents'

const GameRoom = () => {
  const { roomId } = useParams()
  const [hostSocket, setHostSocket] = useState<Socket | null>()
  const [messages, setMessages] = useState<HostMessage[]>([])
  const [players, setPlayers] = useState<string[]>([])
  const [gameStarted, setGameStarted] = useState<boolean>(false)
  const currentToken = getCurrentToken()
  console.log('players', players)
  useEffect(() => {
    if (!roomId || !currentToken || !process.env.REACT_APP_API_SOCKET_URL) {
      return
    }
    const socket = io(process.env.REACT_APP_API_SOCKET_URL)
    socket.on(ClientEvents.Connect, () => {
      socket.emit(ClientEvents.JoinRoomAsHost, roomId, currentToken, (message: string) => {
        console.log(message)
      })
    })
    socket.on(ClientEvents.Error, (msg) => {
      console.log('error emitted from server')
      console.error(msg)
    })
    socket.on(ClientEvents.UpdatePlayerList, (playerList: string[]) => {
      console.log('update-player-list')
      console.log(playerList)
      setPlayers(playerList)
    })

    socket.on(ClientEvents.Message, (hostMessages: HostMessage[]) => {
      console.log('received messages from server')
      console.log(hostMessages)
      setMessages(hostMessages)
    })

    setHostSocket(socket)
    return () => {
      socket.disconnect()
    }
  }, [])

  const startGame = () => {
    console.log('attempting game start')
    hostSocket?.emit(ClientEvents.StartGame)
    setGameStarted(true)
  }

  const next = () => {
    console.log('next')
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
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <HostMessages messages={messages} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        {gameStarted ? (
          <Button variant="contained" onClick={next}>
            Next
          </Button>
        ) : (
          <Button variant="contained" onClick={startGame} disabled={players.length < 3}>
            Start Game
          </Button>
        )}
      </Box>
    </div>
  )
}

export default GameRoom
