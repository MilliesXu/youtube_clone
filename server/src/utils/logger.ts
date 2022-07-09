import pino from 'pino'

const log = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      timestamp: true,
      translateTime: true,
    }
  }
})

export default log
