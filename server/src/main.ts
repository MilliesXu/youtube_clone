import { createServer } from './utils/server'

const PORT = process.env.PORT || 4000
const signals = ['SIGTERM', 'SIGINT']

const app = createServer()

const server = app.listen(PORT, () => {
  console.log(`Server listening at http:localhost:${PORT}`)
})

const gracefulShutdown = (signal: string) => {
  process.on(signal, async () => {
    server.close()

    process.exit(0)
  })
}

signals.map((signal) => gracefulShutdown(signal))
