import express from 'express'
import { processRequestBody } from 'zod-express-middleware'
import deserializeUser from '../../middlewares/deserializerUser'
import { uploadVideoHandler } from './video.controller'
import { createVideoSchema } from './video.schema'
import upload from '../../middlewares/multer'
import validateRequest from '../../middlewares/validateRequest'

const router = express.Router()

router.post('/', deserializeUser, validateRequest(createVideoSchema.body), uploadVideoHandler)

export default router