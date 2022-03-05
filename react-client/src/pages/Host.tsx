import { Button, Card, CardActions, CardContent, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getGamesList } from '../services/api/GamesService'

interface GameDescription {
  id: number
  name: string
  description: string
}

const Host = () => {
  const [gameDescriptions, setGameDescriptions] = useState<GameDescription[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    getGamesList()
      .then((gameDescriptions) => {
        console.log(gameDescriptions)
        setGameDescriptions(gameDescriptions)
      })
      .catch((err) => {
        console.error(err)
        console.log('in host')
      })
  }, [])

  const playGame = (id: number) => {
    console.log('play game with id: ', id)
    navigate(`/game/${id}/settings`)
  }

  return (
    <div>
      {/* <h1>host a game</h1> */}
      <Typography variant="h4" align="center" sx={{ m: 5 }}>
        Host a game
      </Typography>
      {gameDescriptions.map((game, index) => (
        // <div key={index}>
        //   <p>{gameDescription.name}</p>
        //   <p>{gameDescription.description}</p>
        // </div>
        <Card key={index} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5">{game.name}</Typography>
            <Typography>{game.description}</Typography>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              variant="contained"
              onClick={() => {
                playGame(game.id)
              }}
            >
              Play
            </Button>
          </CardActions>
        </Card>
      ))}
    </div>
  )
}

export default Host
