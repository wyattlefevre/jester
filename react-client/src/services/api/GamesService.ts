import axios from 'axios'
import { GameSetting } from '../GameSettings'
import { config, apiURL } from './ApiService'

const gamesControllerURL = apiURL + '/games'

export const getGamesList = () => {
  return axios
    .get(gamesControllerURL + '/list', config())
    .then((res) => {
      return res.data
    })
    .catch((err) => {
      console.error(err)
      throw err
    })
}

export const getGameSettingDescriptions = (gameId: number) => {
  return axios
    .get(gamesControllerURL + `/${gameId}/settings`, config())
    .then((res) => {
      return res.data
    })
    .catch((err) => {
      console.log('in game service')
      console.error(err)
      throw err
    })
}

export const openGame = (gameId: number, gameSettings: GameSetting[]) => {
  return axios
    .post(gamesControllerURL + `/open`, { gameId: gameId, gameSettings: gameSettings }, config())
    .then((res) => {
      return res.data
    })
    .catch((err) => {
      console.error(err)
      throw err
    })
}
