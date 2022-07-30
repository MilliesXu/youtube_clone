import argon2 from 'argon2'
import { StatusCodes } from 'http-status-codes'
import { MyError } from '../../middlewares/errorHandler'

import prisma from "../../utils/prisma"
import { CreateUserInput } from "./user.schema"

export const createUser = async (data: CreateUserInput) => {
  return await prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      password: await argon2.hash(data.password)
    }
  })
}

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email
    }
  })
}

export const compareUserPassword = async (email: string, password: string) => {
  const user = await findUserByEmail(email)

  if (!user || !await argon2.verify(user.password, password)) throw new MyError('Invalid email or password', StatusCodes.UNAUTHORIZED)

  return user
}

export const findUserById = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: {
      id
    }
  })

  if (!user) throw new MyError('Invalid email or password', StatusCodes.UNAUTHORIZED)

  return user
}
