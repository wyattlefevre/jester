import { Request, Response, Router } from 'express'
import middleware from '@/api/middleware'
import { GameError, getAllGamesInfo, getGameSettingDescriptions } from '@/services/GameService'
import RoomManager from '@/services/RoomManager'

const route = Router()

export default (app: Router) => {
  app.use('/games', route)

  route.get('/list', middleware.authenticated, (req: Request, res: Response) => {
    const games = getAllGamesInfo()
    return res.json(games).status(200)
  })

  route.get('/:gameId/settings', middleware.authenticated, (req: Request, res: Response) => {
    const { gameId } = req.params
    const settingDescriptions = getGameSettingDescriptions(+gameId)
    if (settingDescriptions) return res.json(settingDescriptions)
    return res.sendStatus(404)
  })

  //TODO: will eventually want to limit the number of games a host can have open to 1
  route.post('/open', middleware.authenticated, (req: Request, res: Response) => {
    const { gameId, settings } = req.body
    try {
      const roomManager = RoomManager.getInstance()
      const roomId = roomManager.openRoom(gameId, settings)
      return res.json({ roomId: roomId }).status(200)
    } catch (err) {
      if (err instanceof GameError) {
        return res.json({ message: err.message }).sendStatus(400)
      } else {
        console.error(err)
        throw err
      }
    }
  })
}
