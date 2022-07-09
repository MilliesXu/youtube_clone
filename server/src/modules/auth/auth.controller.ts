import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { MyError } from '../../middlewares/errorHandler'
import { compareUserPassword } from '../user/user.service'
import { LoginInput } from './auth.schema'
import { signInJWT } from './auth.utils'

export const loginHandler = async (req: Request<{}, {}, LoginInput>, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body
    const user = await compareUserPassword(email, password)

    const token = signInJWT({ userId: user.id }, 'ACCESS_TOKEN_PRIVATE')

    res.cookie('accessToken', token, {
      maxAge: 3.154e10,
      httpOnly: true,
      domain: 'localhost',
      path: '/',
      sameSite: 'strict',
      secure: false
    })

    return res.send({
      successMessage: 'Successfully login'
    })

  } catch (error: any) {
    next(new MyError(error.message, error.errorCode))
  }
}