import express from 'express'
import { processRequestBody } from 'zod-express-middleware'
import deserializeUser from '../../middlewares/deserializerUser'
import { updateVideoHandler, uploadVideoHandler } from './video.controller'

const router = express.Router()

router.post('/', deserializeUser, uploadVideoHandler)
router.put('/:videoId', deserializeUser, updateVideoHandler)

export default router