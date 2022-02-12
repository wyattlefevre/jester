import { Router } from 'express'
import games from './routes/games'
import hello from './routes/hello'

export default () => {
  const app = Router()
  hello(app)
  games(app)
  return app
}
