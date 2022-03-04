import RoomManager from '@/services/RoomManager'
import { Request, Response, Router } from 'express'

const route = Router()

export default (app: Router) => {
  app.use('/rooms', route)

  route.get('/:roomId/status', (req: Request, res: Response) => {
    const { roomId } = req.params
    const rm = RoomManager.getInstance()
    if (rm.isAcceptingPlayers(roomId)) {
      return res.sendStatus(200)
    }
    return res.json({ message: 'Room not found' }).sendStatus(404)
  })
}
