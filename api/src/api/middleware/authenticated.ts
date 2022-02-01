import CognitoExpress from 'cognito-express'
import Config from '@/config'
import {Request, Response} from 'express'

const cognitoExpress = new CognitoExpress({
  region: Config.cognito.region,
  cognitoUserPoolId: Config.cognito.cognitoUserPoolId,
  tokenUse: "access",
  tokenExpiration: Config.cognito.cognitoTokenExpiration
})

const authenticated = (req: Request, res: Response, next) => {
  // console.log(req.headers.authorization)
  next()
}

export default authenticated