import axios, { AxiosRequestConfig } from 'axios'
import { CognitoUserSession } from 'amazon-cognito-identity-js'
import UserPool from '../auth/UserPool'
import { getCurrentToken } from '../auth/Token'

export const apiURL = process.env.REACT_APP_API_URL || ''

export const config = () => {
  const token = getCurrentToken()
  return {
    headers: {
      authorization: token,
      'content-type': 'application/json',
    },
  } as AxiosRequestConfig
}

export const helloApi = () => {
  return axios.get(apiURL + '/hello', config()).then((res) => {
    console.log('in res')
    return res.data
  })
}
export const helloApiNoAuth = () => {
  return axios.get(apiURL + '/hello').then((res) => {
    return res.data
  })
}
