import axios from 'axios'
import { apiURL } from './ApiService'

const roomsControllerURL = apiURL + '/rooms'

export const getRoomStatus = (roomId: string, nickname: string) => {
  return axios.get(roomsControllerURL + `/${roomId}/status?nickname=${nickname}`).then((res) => {
    return res
  })
}
