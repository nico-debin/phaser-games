import express, { Request, Response, Application } from 'express'
import { Server as HttpServer} from 'http'
import { Server } from 'socket.io'

const app: Application = express()
const httpServer = new HttpServer(app)

const io = new Server(httpServer)

const PORT = process.env.PORT || 8081

app.use(express.static(__dirname + '/client/dist'))

app.get('/', (req: Request, res: Response): void => {
  res.sendFile(__dirname + '/index.html')
})

app.listen(PORT, (): void => {
  console.log(`Server Running here 👉 http://localhost:${PORT}`)
})
