import { Button, OutlinedInput, Radio, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getGameSettingDescriptions, openGame } from '../services/api/GamesService'
import { GameSetting, GameSettingDescription } from '../services/GameSettings'

const GameSettings = () => {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const [settingDescriptions, setSettingDescriptions] = useState<GameSettingDescription[]>([])
  const [settings, setSettings] = useState<GameSetting[]>([])

  useEffect(() => {
    if (gameId)
      getGameSettingDescriptions(+gameId)
        .then((gameSettingDescriptions: GameSettingDescription[]) => {
          console.log(gameSettingDescriptions)
          setSettingDescriptions(gameSettingDescriptions)
          let defaultSettings = gameSettingDescriptions.map((settingDesc) => {
            return { name: settingDesc.name, value: settingDesc.defaultValue }
          })
          console.log('default settings')
          console.log(defaultSettings)
          setSettings(defaultSettings)
        })
        .catch((err) => {
          console.log('in game settings')
          console.error(err)
        })
  }, [])

  const openLobby = () => {
    if (gameId)
      openGame(+gameId, settings)
        .then(({ roomId }) => {
          navigate(`/game/room/${roomId}`)
        })
        .catch((err) => console.error(err))
  }

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>, settingIndex: number) => {
    let newSettings = [...settings]
    newSettings[settingIndex].value = event.target.value == 'true'
    setSettings(newSettings)
  }

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    settingIndex: number,
  ) => {
    let newValue = +event.target.value
    let min = settingDescriptions[settingIndex].min
    let max = settingDescriptions[settingIndex].max
    if (min && newValue < min) return
    if (max && newValue > max) return
    let newSettings = [...settings]
    newSettings[settingIndex].value = newValue
    setSettings(newSettings)
  }

  const adjustSettingValue = (change: number, index: number) => {
    let newValue = (settings[index].value as number) + change
    let min = settingDescriptions[index].min
    let max = settingDescriptions[index].max

    if ((min && newValue < min) || newValue < 0) return
    if (max && newValue > max) return
    let newSettings = [...settings]
    newSettings[index].value = change + (settings[index].value as number)
    setSettings(newSettings)
  }

  const settingInput = (settingDescription: GameSettingDescription, index: number) => {
    if (!settings[index]) return
    if (settingDescription.type === 'boolean') {
      return (
        <>
          <Radio
            checked={settings[index].value === true}
            onChange={(e) => {
              handleRadioChange(e, index)
            }}
            value={'true'}
            inputProps={{ 'aria-label': 'True' }}
          />
          <Typography display="inline">Yes</Typography>
          <Radio
            checked={settings[index].value === false}
            onChange={(e) => {
              handleRadioChange(e, index)
            }}
            value={'false'}
            inputProps={{ 'aria-label': 'False' }}
          />
          <Typography display="inline">No</Typography>
        </>
      )
    } else {
      return (
        <>
          <Button
            sx={{ fontSize: '1.3rem', py: 0, px: 0, fontWeight: 'bold' }}
            onClick={() => {
              adjustSettingValue(-1, index)
            }}
          >
            -
          </Button>
          <OutlinedInput
            value={settings[index].value}
            onChange={(e) => {
              handleInputChange(e, index)
            }}
            inputProps={{
              style: {
                textAlign: 'center',
                fontSize: '1.3rem',
                width: 50,
                paddingTop: 1,
                paddingBottom: 1,
              },
            }}
          />
          <Button
            sx={{ fontSize: '1.3rem', py: 0, px: 0, fontWeight: 'bold' }}
            onClick={() => {
              adjustSettingValue(1, index)
            }}
          >
            +
          </Button>
        </>
      )
    }
  }

  return (
    <div>
      {settingDescriptions.map((description, i) => (
        <div key={i}>
          <Typography variant="h5">{description.name}</Typography>
          {description.description && <Typography>{description.description}</Typography>}
          {settingInput(description, i)}
        </div>
      ))}
      <Button onClick={openLobby} variant="contained">
        Open Lobby
      </Button>
    </div>
  )
}

export default GameSettings
