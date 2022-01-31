import { CognitoUserPool, ICognitoUserPoolData } from 'amazon-cognito-identity-js'

const poolData: ICognitoUserPoolData = {
  UserPoolId: 'us-west-2_UI73WNSXV',
  ClientId: '26r70fhm3v9b5irrkceuiho8ep',
}

export default new CognitoUserPool(poolData)
