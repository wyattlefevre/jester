import express from 'express'
import cors from 'cors'
import routes from '@/api'
import config from '@/config'

export default ({ app }: { app: express.Application }) => {
  app.enable('trust proxy')
  app.use(cors())
  app.use(express.json())
  app.use(config.api.prefix, routes())
  /// catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found')
    err['status'] = 404
    next(err)
  })

  /// error handlers
  app.use((err, req, res, next) => {
    /**
     * Handle 401 thrown by express-jwt library
     */
    if (err.name === 'UnauthorizedError') {
      return res.status(err.status).send({ message: err.message }).end()
    }
    return next(err)
  })
  app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.json({
      errors: {
        message: err.message,
      },
    })
  })
}
