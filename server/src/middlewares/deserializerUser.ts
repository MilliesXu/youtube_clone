
import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { verifyJWT } from '../modules/auth/auth.utils'
import { MyError } from './errorHandler'

const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accessToken } = req.cookies

    if (!accessToken) throw new MyError('Unauthorized', StatusCodes.UNAUTHORIZED)

    const decoded = verifyJWT(accessToken, 'ACCESS_TOKEN_PUBLIC')

    if (!decoded) throw new MyError('Unauthrozied', StatusCodes.UNAUTHORIZED)

    res.locals.user = decoded

    next()
  } catch (error: any) {
    next(new MyError(error.message, error.errorCode))
  }
}

export default deserializeUser