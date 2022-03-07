import React, { useEffect, useState } from 'react'
import { Alert, Snackbar, useTheme } from '@mui/material'
import { Box, Button, OutlinedInput, Typography, useMediaQuery } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { getRoomStatus } from '../services/api/RoomsService'

const Home = () => {
  const roomCodeLength = 4
  const nicknameMaxLength = 10
  const pageStyles = {
    height: '80vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  }
  const isMobile = useMediaQuery(useTheme().breakpoints.down('md'))
  const navigate = useNavigate()
  const [roomCode, setRoomCode] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [nickname, setNickname] = useState<string>('')

  useEffect(() => {
    const lastNickname = localStorage.getItem('nickname')
    if (lastNickname) {
      setNickname(lastNickname)
    }
  }, [])

  const hostGame = () => {
    navigate('/host')
  }

  const joinGame = () => {
    setErrorMessage(null)
    getRoomStatus(roomCode, nickname)
      .then(() => {
        navigate(`/game/play/${roomCode}`)
        localStorage.setItem('nickname', nickname)
      })
      .catch((err) => {
        if (err.response) {
          setErrorMessage(err.response.data)
        } else {
          setErrorMessage(err.message)
        }
      })
  }

  return (
    <div>
      <Box sx={pageStyles}>
        <OutlinedInput
          sx={{ mb: 1 }}
          placeholder="Nickname"
          value={nickname}
          onChange={(event) => {
            if (event.target.value.length <= nicknameMaxLength)
              setNickname(event.target.value.toUpperCase())
          }}
          inputProps={{ style: { textAlign: 'center', fontSize: '1.3rem' } }}
        />
        <OutlinedInput
          placeholder="Room Code"
          value={roomCode}
          onChange={(event) => {
            if (event.target.value.length <= roomCodeLength)
              setRoomCode(event.target.value.toUpperCase())
          }}
          inputProps={{ style: { textAlign: 'center', fontSize: '1.3rem' } }}
        />
        <Button
          sx={{ marginTop: 1 }}
          variant="contained"
          disabled={roomCode.length != roomCodeLength || nickname.length === 0}
          onClick={joinGame}
        >
          Join Game
        </Button>
        {errorMessage && (
          <Alert sx={{ mt: 1 }} severity="error">
            {errorMessage}
          </Alert>
        )}
        {!isMobile && (
          <>
            <Typography sx={{ marginTop: 3 }} align="center">
              OR
            </Typography>
            <Button onClick={hostGame} sx={{ marginTop: 3 }} variant="contained" color="secondary">
              Host Game
            </Button>
          </>
        )}
      </Box>
    </div>
  )
}

export default Home
