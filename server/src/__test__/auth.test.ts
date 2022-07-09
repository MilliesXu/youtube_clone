import 'dotenv/config'
import supertest from 'supertest'
import { PrismaClient } from '@prisma/client'

import { createServer } from '../utils/server'
import { createUser } from '../modules/user/user.service'

const app = createServer()

let prismaGlobal: PrismaClient
let userId: number

const userPayload = {
  id: 0,
  username: 'Erwin Xu',
  email: 'winzchip@gmail.com',
  password: 'erwinxu13',
  confirmPassword: 'erwinxu13'
}


describe('Auth', () => {
  beforeAll(async () => {
    const prisma = new PrismaClient()
    prismaGlobal = prisma
    const user = await createUser(userPayload)
    userId = user.id
  }),
  afterAll(async () => {
    await prismaGlobal.user.deleteMany({})
    await prismaGlobal.$disconnect()
  }),
  describe('Login but no data send', () => {
    it('Should return 400', async () => {
      await supertest(app).post('/api/auth').expect(400)
    })
  })
  describe('Login but email not correct', () => {
    it('Should return 401', async () => {
      await supertest(app).post('/api/auth')
        .send({
          email: 'wrong@email.com',
          password: 'erwinxu13'
        })
        .expect(401)
    })
  }),
  describe('Login but password not correct', () => {
    it('Should return 401', async () => {
      await supertest(app).post('/api/auth')
        .send({
          email: 'winzchip@gmail.com',
          password: 'erwinxu134'
        })
        .expect(401)
    })
  }),
  describe('Login and success', () => {
    it('Should return 200, and success message', async () => {
      const { body, statusCode } = await supertest(app).post('/api/auth')
        .send({
          email: 'winzchip@gmail.com',
          password: 'erwinxu13'
        })

      expect(statusCode).toBe(200)
      expect(body).toMatchObject({
        successMessage: 'Successfully login'
      })
    })
  })
})