import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { loginHandler } from './auth.controller'
import { loginSchema } from './auth.schema'

const router = express.Router()

router.post('/', validateRequest(loginSchema), loginHandler)

export default router