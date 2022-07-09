
import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { AnyZodObject, ZodError } from 'zod'
import { MyError } from './errorHandler'

const validateRequest = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.parseAsync({
      body: req.body,
      params: req.params,
      query: req.query
    })
    next()
  } catch (error: any) {
    const message = error.errors.map((err: ZodError) => err.message)
    next(new MyError(message, StatusCodes.BAD_REQUEST))
  }
}

export default validateRequest