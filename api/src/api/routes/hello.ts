import { Router, Request, Response } from "express";

const route = Router();
export default (app: Router) => {
  app.use('/', route);
  route.get('/hello', (req: Request, res: Response) => {
    return res.json({message: "hello"}).status(200)
  })
}