import React from 'react'
import { useParams } from 'react-router-dom'

const GameSettings = () => {
  const { gameId } = useParams()

  return <div>{`game settings for id: ${gameId}`}</div>
}

export default GameSettings
