import express from 'express'
import { validateRequest } from 'zod-express-middleware'
import { registerUserHandler } from './user.controller'
import { createUserSchema } from './user.schema'

const router = express.Router()

router.post('/', validateRequest(createUserSchema), registerUserHandler)

export default router
