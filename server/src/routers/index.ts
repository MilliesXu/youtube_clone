
import { Express } from 'express'

import userRoute from '../modules/user/user.route'

export default(app: Express) => {
  app.use('/api/user', userRoute)
}