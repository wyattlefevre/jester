import express from 'express';
import config from './config'
import loaders from './loaders'

async function startServer() {
  const app = express()
  loaders({expressApp: app})
  app.listen(config.port, () => {
    console.log(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️
      ################################################
    `);
  }).on('error', err => {
    console.error(err)
    process.exit(1)
  })
}

startServer()