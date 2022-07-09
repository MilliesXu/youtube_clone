
import { Express } from 'express'

import authRoute from '../modules/auth/auth.route'
import userRoute from '../modules/user/user.route'

export default(app: Express) => {
  app.use('/api/auth', authRoute)
  app.use('/api/user', userRoute)
}