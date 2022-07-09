import express, { Express } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { CORS_ORIGIN } from '../constants'
import helmet from 'helmet'

export default (app: Express) => {
  app.use(cookieParser())
  app.use(express.json())
  app.use(cors({
    origin: CORS_ORIGIN,
    credentials: true
  }))
  app.use(helmet())
}
