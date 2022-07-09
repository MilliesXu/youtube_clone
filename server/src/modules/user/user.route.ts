import express from 'express'
import { processRequestBody } from "zod-express-middleware";
import { registerUserHandler } from './user.controller'
import { createUserSchema } from './user.schema'

const router = express.Router()

router.post('/', processRequestBody(createUserSchema.body), registerUserHandler)

export default router
