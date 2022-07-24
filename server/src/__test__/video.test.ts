import 'dotenv/config'
import supertest from 'supertest'
import fs from 'fs'
import { PrismaClient } from '@prisma/client'

import { createServer } from '../utils/server'
import { createUser } from '../modules/user/user.service'
import { signInJWT } from '../modules/auth/auth.utils'

const app = createServer()

let prismaGlobal: PrismaClient
let videoId: number

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
  describe('Upload video but not login', () => {
    it('Should return 401', async () => {
      await supertest(app).post('/api/video').expect(401)
    })
  }),
  describe('Upload video but no video send', () => {
    it('Should return 400', async () => {
      await supertest(app).post('/api/video')
        .set('Connection', 'keep-alive')
        .set('Cookie', `accessToken=${token}`)
        .attach('file', 'C://Users/winzc/Downloads/1638920044645.png')
        .expect(400)
    })
  })
  describe('Upload video and success', () => {
    it('Should return 201, videoInfo, and successMessage', async () => {
      const { body, statusCode } = await supertest(app).post('/api/video')
        .set('Connection', 'keep-alive')
        .set('Cookie', `accessToken=${token}`)
        .attach('file', 'C://Users/winzc/Downloads/Learn the alphabet with Top Gear.mp4')

      videoId = body.videoInfo.id

      expect(statusCode).toBe(201)
      expect(body).toMatchObject({
        videoInfo: {
          user: {
            username: userPayload.username
          },
          extension: 'mp4'
        },
        successMessage: 'Successfully upload the video'
      })
    })
  })
  describe('Update video but not login', () => {
    it('Should return 401', async () => {
      await supertest(app).put(`/api/video/${10}`)
        .send({
          title: 'This is update one',
          description: 'This is update one',
          publised: true
        })
        .expect(401)
    })
  })
  describe('Update video but video not found', () => {
    it('Should return 400', async () => {
      await supertest(app).put(`/api/video/${10}`)
        .set('Cookie', `accessToken=${token}`)
        .send({
          title: 'This is update one',
          description: 'This is update one',
          published: true
        })
        .expect(404)
    })
  })
  describe('Update video and success', () => {
    it('Should return 200, successMessage, and video Info', async () => {
      const { body, statusCode } = await supertest(app).put(`/api/video/${videoId}`)
        .set('Cookie', `accessToken=${token}`)
        .send({
          title: 'This is update one',
          description: 'This is update one',
          published: true
        })

      expect(statusCode).toBe(200)
      expect(body).toMatchObject({
        videoInfo: {
          user: {
            username: userPayload.username,
          },
          extension: 'mp4',
          title: 'This is update one',
          description: 'This is update one',
          published: true
        },
        successMessage: 'Successfully update video'
      })
    })
  })
  describe('Get video and success', () => {
    it('Should return 200 and videos', async () => {
      const {body, statusCode} = await supertest(app).get(`/api/video/`)

      expect(statusCode).toBe(200)
      expect(body).toMatchObject({
        videos: [{
          user: {
            username: userPayload.username,
          },
          extension: 'mp4',
          title: 'This is update one',
          description: 'This is update one',
          published: true
        }]
      })
    })
  })
  describe('Stream video but vidoe not found', () => {
    it('Should return 404', async () => {
      await supertest(app).get(`/api/video/${0}`)
        .set('range', '1256')
        .expect(404)
    })
  })
})