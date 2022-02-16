import { Request, Response, Router } from 'express'
import middleware from '@/api/middleware'
import { getAllGamesInfo } from '@/services/GameService'

const route = Router()

export default (app: Router) => {
  app.use('/games', route)

  route.get('/list', middleware.authenticated, (req: Request, res: Response) => {
    const games = getAllGamesInfo()
    return res.json(games).status(200)
  })
}
