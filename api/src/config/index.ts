export default {
  port: process.env.PORT, // todo: replace with env var
  api: {
    prefix: '/api',
  },
  cognito: {
    region: process.env.COGNITO_REGION,
    cognitoUserPoolId: process.env.COGNITO_USER_POOL_ID,
    cognitoTokenExpiration: 3600000
  }
}