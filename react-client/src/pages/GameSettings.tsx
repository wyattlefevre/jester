import { Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getGameSettingDescriptions } from '../services/api/GamesService'
import { GameSettingDescription } from '../services/GameSettings'

const GameSettings = () => {
  const { gameId } = useParams()
  const [settingDescriptions, setSettingDescriptions] = useState<GameSettingDescription[]>([])

  useEffect(() => {
    if (gameId)
      getGameSettingDescriptions(+gameId)
        .then((gameSettingDescriptions: GameSettingDescription[]) => {
          console.log(gameSettingDescriptions)
          setSettingDescriptions(gameSettingDescriptions)
        })
        .catch((err) => {
          console.error(err)
        })
  }, [])

  return (
    <div>
      <p>{`game settings for id: ${gameId}`}</p>
      {settingDescriptions.map((description) => (
        <div>
          <p>name: {description.name}</p>
          <p>type: {description.type}</p>
          <p>default value: {description.defaultValue}</p>
        </div>
      ))}
      <Button variant="contained">Open Lobby</Button>
    </div>
  )
}

export default GameSettings
