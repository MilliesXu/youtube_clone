import { customAlphabet } from "nanoid"
import prisma from "../../utils/prisma"

const nanoId = customAlphabet('1234567890abcdefghijklmnopqrstuvwyz', 10)

export const createVideo = async (data: any, userId: number) => {
  return await prisma.video.create({
    data: {
      title: data.title,
      description: data.descrtiption,
      videoId: nanoId(),
      user: {
        connect: {
          id: userId
        }
      }
    },
    include: {
      user: {
        select: {
          username: true
        }
      }
    }
  })
}

export const updateVideo = async (id: number, data: any, extension: string) => {
  return await prisma.video.update({
    where: {
      id
    },
    data: {
      title: data.title,
      description: data.description,
      extension
    },
    include: {
      user: {
        select: {
          username: true
        }
      }
    }
  })
}

export const deleteVideo = async (id: number) => {
  return await prisma.video.delete({
    where: {
      id
    }
  })
}
