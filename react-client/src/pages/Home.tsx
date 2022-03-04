import React, { useState } from 'react'
import { useTheme } from '@mui/material'
import { Box, Button, OutlinedInput, Typography, useMediaQuery } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const roomCodeLength = 4
  const pageStyles = {
    height: '80vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  }
  const isMobile = useMediaQuery(useTheme().breakpoints.down('md'))
  const navigate = useNavigate()
  const [roomCode, setRoomCode] = useState<string>('')

  const hostGame = () => {
    navigate('/host')
  }

  const joinGame = () => {}
  return (
    <div>
      <Box sx={pageStyles}>
        <OutlinedInput
          placeholder="Room Code"
          value={roomCode}
          onChange={(event) => {
            if (event.target.value.length <= roomCodeLength)
              setRoomCode(event.target.value.toUpperCase())
          }}
        />
        <Button
          sx={{ marginTop: 1 }}
          variant="contained"
          disabled={roomCode.length != roomCodeLength}
        >
          Join Game
        </Button>
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
