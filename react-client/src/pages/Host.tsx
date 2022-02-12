import React, { useEffect, useState } from 'react'
import { helloApi, helloApiNoAuth } from '../services/api/ApiService'
import { getGamesList } from '../services/api/GamesService'

interface GameDescription {
  id: number
  name: string
  description: string
}

const Host = () => {
  const [gameDescriptions, setGameDescriptions] = useState<GameDescription[]>([])

  useEffect(() => {
    getGamesList()
      .then((gameDescriptions) => {
        setGameDescriptions(gameDescriptions)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [])

  return (
    <div>
      <h1>host a game</h1>
      <p>choose from the list</p>
      {gameDescriptions.map((gameDescription) => (
        <p>{gameDescription.name}</p>
      ))}
    </div>
  )
}

export default Host
