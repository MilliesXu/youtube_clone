import express from 'express'
import { processRequestBody } from 'zod-express-middleware'
import deserializeUser from '../../middlewares/deserializerUser'
import { findVideosHandler, streamVideoHandler, updateVideoHandler, uploadVideoHandler } from './video.controller'
import { updateVideoSchema } from './video.schema'

const router = express.Router()

router.post('/', deserializeUser, uploadVideoHandler)
router.put('/:videoId', deserializeUser, processRequestBody(updateVideoSchema.body), updateVideoHandler)
router.get('/', findVideosHandler)
router.get('/:videoId', streamVideoHandler)

export default router