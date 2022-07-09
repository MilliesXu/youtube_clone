import argon2 from 'argon2'

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