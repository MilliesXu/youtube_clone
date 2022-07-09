import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

export class MyError extends Error {
  private errorCode: number

  constructor (message: string, errorCode: number) {
    super(message)
    this.errorCode = errorCode
  }
}

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const message = err.message ? err.message : 'Internal server error'
  const code = err.errorCode ? err.errorCode : StatusCodes.INTERNAL_SERVER_ERROR

  res.status(code).send({
    errorMessage: message,
    stack: process.env.NODE_ENV as string === 'development' ? err.stack : null
  })
}

export default errorHandler