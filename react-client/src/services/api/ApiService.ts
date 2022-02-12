import axios, { AxiosRequestConfig } from 'axios'
import { CognitoUserSession } from 'amazon-cognito-identity-js'
import UserPool from '../auth/UserPool'

const apiURL = process.env.REACT_APP_API_URL || ''

const config = () => {
  let token: string | undefined
  UserPool.getCurrentUser()?.getSession((err: Error | null, session: CognitoUserSession | null) => {
    if (!err) {
      token = session?.getAccessToken().getJwtToken()
    }
  })

  return {
    headers: {
      authorization: token,
      'content-type': 'application/json',
    },
  } as AxiosRequestConfig
}

export const helloApi = () => {
  return axios
    .get(apiURL + '/hello', config())
    .then((res) => {
      console.log('in res')
      return res.data
    })
    .catch((err) => {
      console.log('in err')
      console.error(err)
      throw err
    })
}
export const helloApiNoAuth = () => {
  return axios
    .get(apiURL + '/hello')
    .then((res) => {
      console.log('in res')
      return res.data
    })
    .catch((err) => {
      console.log('in err')
      console.error(err)
      throw err
    })
}
