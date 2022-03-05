import axios from 'axios'
import { apiURL } from './ApiService'

const roomsControllerURL = apiURL + '/rooms'

export const getRoomStatus = (roomId: string) => {
  return axios.get(roomsControllerURL + `/${roomId}/status`).then((res) => {
    return res
  })
}
