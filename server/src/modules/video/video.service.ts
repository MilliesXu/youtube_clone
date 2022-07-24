import { StatusCodes } from "http-status-codes"
import { customAlphabet } from "nanoid"
import { MyError } from "../../middlewares/errorHandler"
import prisma from "../../utils/prisma"
import { UpdateVideoInput } from "./video.schema"

const nanoId = customAlphabet('1234567890abcdefghijklmnopqrstuvwyz', 10)

export const createVideo = async (userId: number) => {
  return await prisma.video.create({
    data: {
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

export const findVideo = async (videoId: number) => {
  const video = await prisma.video.findUnique({
    where: {
      id: videoId
    },
    include: {
      user: {
        select: {
          username: true
        }
      }
    }
  })

  if (!video) throw new MyError('Video not found', StatusCodes.NOT_FOUND)

  return video
}

export const findVideos = async () => {
  return await prisma.video.findMany({
    where: {
      published: true
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

export const updateVideo = async (videoId: number, data: UpdateVideoInput, userId: number) => {
  const video = await findVideo(videoId)

  if (video.userId !== userId) throw new MyError('Unauthorized', StatusCodes.UNAUTHORIZED)

  return await prisma.video.update({
    where: {
      id: videoId
    },
    data: {
      title: data.title,
      description: data.description,
      published: data.published
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

export const updateVideoExtension = async (id: number, extension: string) => {
  return await prisma.video.update({
    where: {
      id
    },
    data: {
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
