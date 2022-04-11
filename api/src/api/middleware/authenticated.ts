import CognitoExpress from 'cognito-express'
import Config from '@/config'
import { Request, Response } from 'express'

const cognitoExpress = new CognitoExpress({
  region: Config.cognito.region,
  cognitoUserPoolId: Config.cognito.cognitoUserPoolId,
  tokenUse: 'access',
  tokenExpiration: Config.cognito.cognitoTokenExpiration,
})

const authenticated = (req: Request, res: Response, next) => {
  const accessTokenFromClient = req.headers.authorization
  if (!accessTokenFromClient) return res.status(401).send('Access Token missing from header')

  cognitoExpress.validate(accessTokenFromClient, (err, response) => {
    if (err) return res.status(401).send(err)
    res.locals.user = response
    next()
  })
}

export default authenticated
