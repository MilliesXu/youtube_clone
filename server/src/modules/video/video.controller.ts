import busboy from 'busboy'
import fs from 'fs'
import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { MyError } from '../../middlewares/errorHandler'
import { createVideo, deleteVideo, findVideo, findVideos, updateVideo, updateVideoExtension } from './video.service'
import { UpdateVideoInput, UpdateVideoParams } from './video.schema'
import { createAsync } from '../../middlewares/errorHandler'

const MIME_TYPES = ['video/mp4']
const CHUNK_SIZE_IN_BYTES = 1000000 // 1 mb

const getPath = ({ videoId, extension }: {videoId: string, extension: string}) => {
  return `${process.cwd()}/videos/${videoId}.${extension}`
}

export const uploadVideoHandler = createAsync(async (req: Request, res: Response, next: NextFunction) => {
  const bb = busboy({ headers: req.headers })
  const { userId } = res.locals.user
  let extension: string
  const video = await createVideo(userId)
  
  const handleAbort = () => {
    // Unpipe the busboy stream from request
    req.unpipe(bb);

    res.set('Connection', 'close');
    return next(new MyError('Invalid file type or something wrong', StatusCodes.BAD_REQUEST))
  };

  bb.on('file',(async (_, file, info) => {
    if (!MIME_TYPES.includes(info.mimeType)) {
      await deleteVideo(video.id)
      return bb.emit('error')
    }

    extension = info.mimeType.split('/')[1]

    const filePath = getPath({
      videoId: video.videoId,
      extension
    })

    const stream = fs.createWriteStream(filePath)

    file.pipe(stream)
  }))

  bb.on('close', async () => {
    const updatedVideo = await updateVideoExtension(video.id, extension)
    res.writeHead(StatusCodes.CREATED, {
      Connection: "close",
      "Content-Type": "application/json",
    });

    res.write(JSON.stringify({
      videoInfo: updatedVideo,
      successMessage: 'Successfully upload the video'
    }))
    res.end()
  })

  bb.on('error', handleAbort)

  req.pipe(bb)
})

export const updateVideoHandler = createAsync<UpdateVideoInput, {}, UpdateVideoParams>(async (req: Request, res: Response) => {
  const { videoId } = req.params
  const id = parseInt(videoId)
  const body = req.body
  const userId = res.locals.user.userId

  const video = await updateVideo(id, body, userId)

  res.send({
    videoInfo: video,
    successMessage: 'Successfully update video'
  })
})

export const findVideosHandler = createAsync(async (req: Request, res: Response) => {
  const videos = await findVideos()

  res.send({
    videos
  })
})

export const streamVideoHandler = createAsync<{}, {}, UpdateVideoParams>(async (req: Request, res: Response, next: NextFunction) => {
  const { videoId } = req.params
  const id = parseInt(videoId)

  const range = req.headers.range

  if (!range) next(new MyError('range must be provided', StatusCodes.BAD_REQUEST))

  const video = await findVideo(id)

  const filePath = getPath({
    videoId: video.videoId,
    extension: video.extension as string
  })

  const fileSizeInBytes = fs.statSync(filePath).size

  const chunkStart = Number(range?.replace(/\D/g, ''))

  const chunkEnd = Math.min(chunkStart + CHUNK_SIZE_IN_BYTES, fileSizeInBytes - 1)

  const contentLength = chunkEnd - chunkStart + 1

  const headers = {
    "Content-Range": `bytes ${chunkStart}-${chunkEnd}/${fileSizeInBytes}`,
    "Accept-Ranges": 'bytes',
    "Content-length": contentLength,
    "Content-Type": `video/${video.extension}`,
    // "Cross-Origin_Resource-Policy": "cross-origin"
  }

  res.writeHead(StatusCodes.PARTIAL_CONTENT, headers)

  const videoStream = fs.createReadStream(filePath, {
    start: chunkStart,
    end: chunkEnd
  })

  videoStream.pipe(res)
})
