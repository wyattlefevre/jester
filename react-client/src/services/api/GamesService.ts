import axios from 'axios'
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
    .get(gamesControllerURL + `/games/${gameId}/settings`, config())
    .then((res) => {
      return res.data
    })
    .catch((err) => {
      console.error(err)
      throw err
    })
}
