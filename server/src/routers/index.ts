
import { Express } from 'express'

import authRoute from '../modules/auth/auth.route'
import userRoute from '../modules/user/user.route'
import videoRoute from '../modules/video/video.route'

export default(app: Express) => {
  app.use('/api/auth', authRoute)
  app.use('/api/user', userRoute)
  app.use('/api/video', videoRoute)
}