import { Router, Request, Response } from "express";
import middleware from '@/api/middleware'

const route = Router();
export default (app: Router) => {
  app.use('/', route);
  route.get('/hello', middleware.authenticated, (req: Request, res: Response) => {
    return res.json("hello from jester api").status(200)
  })
}