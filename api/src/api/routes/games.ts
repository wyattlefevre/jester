import { Request, Response, Router } from 'express'
import middleware from '@/api/middleware'
import GameList from '@/models/GameList'

const route = Router()

export default (app: Router) => {
  app.use('/games', route)

  route.get('/list', middleware.authenticated, (req: Request, res: Response) => {
    const games = GameList.map((game) => {
      return (({ id, name }) => ({ id, name }))(game)
    })
    return res.json(games).status(200)
  })
}
