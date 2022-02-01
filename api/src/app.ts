import 'dotenv/config'
import express from 'express';
import config from './config'
import loaders from './loaders'

async function startServer() {
  const app = express()
  loaders({expressApp: app})
  const server = app.listen(config.port, () => {
    console.log(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️
      env var: ${process.env.TEST_VALUE}
      ################################################
    `);
  }).on('error', err => {
    console.error(err)
    process.exit(1)
  })
  // TODO: add socket.io
  // https://stackoverflow.com/questions/17696801/express-js-app-listen-vs-server-listen
  // https://socket.io/get-started/chat
  // https://socket.io/docs/v3/server-application-structure/
  // https://www.youtube.com/watch?v=ZKEqqIO7n-k&ab_channel=WebDevSimplified
}

startServer()