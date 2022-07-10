import 'dotenv/config'
import supertest from 'supertest'
import fs from 'fs'
import { PrismaClient } from '@prisma/client'

import { createServer } from '../utils/server'
import { createUser } from '../modules/user/user.service'
import { signInJWT } from '../modules/auth/auth.utils'

const app = createServer()

let prismaGlobal: PrismaClient

const videoPayload = {
  title: 'Video One',
  description: 'This is video one'
}

const userPayload = {
  id: 0,
  username: 'Erwin Xu',
  email: 'winzchip@gmail.com',
  password: 'erwinxu13',
  confirmPassword: 'erwinxu13'
}

let token: string

describe('Video', () => {
  beforeAll(async () => {
    const prisma = new PrismaClient()
    prismaGlobal = prisma
    const user = await createUser(userPayload)
    userPayload.id = user.id
    token = signInJWT({ userId: user.id }, 'ACCESS_TOKEN_PRIVATE')
  }),
  afterAll(async () => {
    await prismaGlobal.video.deleteMany({})
    await prismaGlobal.user.deleteMany({})
    await prismaGlobal.$disconnect()
  }),
  describe('Upload video and success', () => {
    it('Should return 201, videoInfo, and successMessage', async () => {
      const { body, statusCode } = await supertest(app).post('/api/video')
        .set('Connection', 'keep-alive')
        .set('Cookie', `accessToken=${token}`)
        .attach('file', 'C://Users/winzc/Downloads/Learn the alphabet with Top Gear.mp4')

      expect(statusCode).toBe(201)
      expect(body).toMatchObject({
        user: {
          username: userPayload.username
        },
        extension: 'mp4'
      })
    })
  })
})