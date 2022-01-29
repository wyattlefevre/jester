import React from 'react'
import { useTheme } from '@mui/material'
import { Box, Button, OutlinedInput, Typography, useMediaQuery } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const pageStyles = {
    height: '80vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  }
  const isMobile = useMediaQuery(useTheme().breakpoints.down('md'))
  const navigate = useNavigate()
  const hostGame = () => {
    navigate('/host')
  }
  return (
    <div>
      <Box sx={pageStyles}>
        <OutlinedInput placeholder="Room Code" />
        <Button sx={{ marginTop: 1 }} variant="contained">
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
