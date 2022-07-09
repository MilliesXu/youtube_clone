import express from 'express'
import middlewares from '../middlewares'
import errorHandler from '../middlewares/errorHandler'
import routers from '../routers'


export const createServer = () => {
  const app = express()

  middlewares(app)
  routers(app)
  app.use(errorHandler)
  return app
}