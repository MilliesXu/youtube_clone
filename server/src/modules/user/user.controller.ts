import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { MyError } from '../../middlewares/errorHandler'
import { CreateUserInput } from './user.schema'
import { createUser } from './user.service'

export const registerUserHandler = async (req: Request<{}, {}, CreateUserInput>, res: Response, next: NextFunction) => {
  try {
    const data = req.body
    const user = await createUser(data)

    res.send({
      userInfo: user,
      successMessage: 'Successfully create a new user'
    })
  } catch (error: any) {
    if (error.code === 'P2002') {
      next(new MyError('User is already exist', StatusCodes.CONFLICT))
    }

    next(new MyError('Internal Server Error', StatusCodes.INTERNAL_SERVER_ERROR))
  }
}