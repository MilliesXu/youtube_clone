import 'dotenv/config'
import supertest from 'supertest'
import { PrismaClient } from '@prisma/client'

import { createServer } from '../utils/server'

const app = createServer()

let prismaGlobal: PrismaClient

const userPayload = {
  id: 0,
  username: 'Erwin Xu',
  email: 'winzchip@gmail.com',
  password: 'erwinxu13',
  confirmPassword: 'erwinxu13'
}

describe('User', () => {
  beforeAll(async () => {
    const prisma = new PrismaClient()
    prismaGlobal = prisma
  }),
  afterAll(async () => {
    await prismaGlobal.user.deleteMany({})
    await prismaGlobal.$disconnect()
  }),
  describe('Create user but no data send', () => {
    it('Should return 400', async () => {
      await supertest(app).post('/api/user/').expect(400)
    })
  })
  describe('Create user but password not match', () => {
    it('Should return 400', async () => {
      await supertest(app).post('/api/user/')
        .send({
          ...userPayload,
          confirmPassword: '1234'
        })
        .expect(400)
    })
  })
  describe('Create user and success', () => {
    it('Should return 200, userInfo, successMessage', async () => {
      const { body, statusCode } = await supertest(app).post('/api/user/')
        .send(userPayload)
      
      expect(statusCode).toBe(200)
      expect(body).toMatchObject({
        userInfo: {
          username: userPayload.username,
          email: userPayload.email
        },
        successMessage: 'Successfully create a new user'
      })
    })
  })
  describe('Create user but username and email is already used', () => {
    it('Should return 409', async () => {
      await supertest(app).post('/api/user/')
        .send(userPayload)
        .expect(409)
    })
  })
})
