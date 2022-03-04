import { Router } from 'express'
import games from './routes/games'
import hello from './routes/hello'
import rooms from './routes/rooms'

export default () => {
  const app = Router()
  hello(app)
  games(app)
  rooms(app)
  return app
}
