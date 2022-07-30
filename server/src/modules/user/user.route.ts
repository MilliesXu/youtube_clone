import express from 'express'
import deserializeUser from '../../middlewares/deserializerUser'
import validateRequest from '../../middlewares/validateRequest'
import { getUserHandler, registerUserHandler } from './user.controller'
import { createUserSchema } from './user.schema'

const router = express.Router()

router.post('/', validateRequest(createUserSchema), registerUserHandler)
router.get('/', deserializeUser, getUserHandler)

export default router
