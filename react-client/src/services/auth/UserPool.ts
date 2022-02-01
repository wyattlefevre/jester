import { CognitoUserPool, ICognitoUserPoolData } from 'amazon-cognito-identity-js'


const poolData: ICognitoUserPoolData = {
  UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID || '',
  ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID || '',
}

export default new CognitoUserPool(poolData)
