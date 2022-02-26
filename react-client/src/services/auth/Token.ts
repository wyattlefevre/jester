import { CognitoUserSession } from "amazon-cognito-identity-js"
import UserPool from "./UserPool"

export const getCurrentToken: () => string | undefined  = () => {
  let token: string | undefined
  UserPool.getCurrentUser()?.getSession((err: Error | null, session: CognitoUserSession | null) => {
    if (!err) {
      token = session?.getAccessToken().getJwtToken()
    }
  })
  return token
}