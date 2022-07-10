import busboy from 'busboy'
import fs from 'fs'
import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { MyError } from '../../middlewares/errorHandler'
import { createVideo, deleteVideo, updateVideo } from './video.service'
import { CreateVideoInput } from './video.schema'

const MIME_TYPES = ['video/mp4']

const getPath = ({ videoId, extension }: {videoId:  string, extension: string}) => {
  return `${process.cwd()}/videos/${videoId}.${extension}`
}

export const uploadVideoHandler = async (req: Request<{}, {}, CreateVideoInput>, res: Response, next: NextFunction) => {
  try {
    const bb = busboy({ headers: req.headers })
    const body = req.body
    const userId = res.locals.userId
    let extension: string
    const video = await createVideo(body, userId)
  
    bb.on('file', async (_, file, info) => {
      if (!MIME_TYPES.includes(info.mimeType)) {
        await deleteVideo(video.id)
        throw new MyError('Invalid file type', StatusCodes.BAD_REQUEST)
      }
  
      extension = info.mimeType.split('/')[1]
  
      const filePath = getPath({
        videoId: video.videoId,
        extension
      })
  
      const stream = fs.createWriteStream(filePath)
  
      file.pipe(stream)
    })
  
    bb.on('close', async () => {
      const updatedVideo = await updateVideo(video.id, {
        title: video.title,
        description: video.description,
      }, extension)
      res.writeHead(StatusCodes.CREATED, {
        Connection: "close",
        "Content-Type": "application/json",
      });
  
      res.write(JSON.stringify(updatedVideo))
    })
  
    res.send({
      videoInfo: updateVideo,
      successMessage: 'Successfully upload video'
    })
    return req.pipe(bb) 
  } catch (error: any) {
    next(new MyError(error.message, error.errorCode))
  }
}
