import { Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getGameSettingDescriptions, openGame } from '../services/api/GamesService'
import { GameSettingDescription } from '../services/GameSettings'

const GameSettings = () => {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const [settingDescriptions, setSettingDescriptions] = useState<GameSettingDescription[]>([])

  useEffect(() => {
    if (gameId)
      getGameSettingDescriptions(+gameId)
        .then((gameSettingDescriptions: GameSettingDescription[]) => {
          console.log(gameSettingDescriptions)
          setSettingDescriptions(gameSettingDescriptions)
        })
        .catch((err) => {
          console.log('in game settings')
          console.error(err)
        })
  }, [])

  const openLobby = () => {
    if (gameId)
      openGame(+gameId, [])
        .then(({ roomId }) => {
          navigate(`/game/room/${roomId}`)
        })
        .catch((err) => console.error(err))
  }

  return (
    <div>
      <p>{`game settings for id: ${gameId}`}</p>
      {settingDescriptions.map((description, i) => (
        <div key={i}>
          <p>name: {description.name}</p>
          <p>type: {description.type}</p>
          <p>default value: {description.defaultValue}</p>
        </div>
      ))}
      <Button onClick={openLobby} variant="contained">
        Open Lobby
      </Button>
    </div>
  )
}

export default GameSettings
