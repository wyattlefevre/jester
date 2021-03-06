import RoomManager from '@/services/RoomManager'
import { Request, Response, Router } from 'express'

const route = Router()

export default (app: Router) => {
  app.use('/rooms', route)

  route.get('/:roomId/status', (req: Request, res: Response) => {
    const { roomId } = req.params
    const { nickname } = req.query
    if (typeof nickname !== 'string') {
      return res.sendStatus(400)
    }

    console.log('room status nickname:', nickname)
    const rm = RoomManager.getInstance()
    if (rm.isAcceptingPlayers(roomId)) {
      if (rm.isNicknameAvailable(roomId, nickname)) return res.sendStatus(200)
      return res.status(400).send('Nickname unavailable')
    }
    return res.status(404).send('Room not found')
  })
}
