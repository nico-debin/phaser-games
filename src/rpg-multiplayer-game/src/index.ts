import path from 'path'
import express, { Request, Response, Application } from 'express'
import { Server as HttpServer } from 'http'
import { Server } from 'socket.io'
import { JSDOM } from 'jsdom'
import DatauriParser from 'datauri/parser'

const PORT = process.env.PORT || 8081

const app: Application = express()
const httpServer = new HttpServer(app)

const io = new Server(httpServer)

const datauriParser = new DatauriParser()

app.use(express.static(__dirname + '/client/dist'))

app.get('/', (req: Request, res: Response): void => {
  res.sendFile(__dirname + '/index.html')
})

setupPhaserServer()

function setupPhaserServer() {
  JSDOM.fromFile(path.join(__dirname, 'server/dist/index.html'), {
    // To run the scripts in the html file
    runScripts: 'dangerously',

    // Also load supported external resources
    resources: 'usable',

    // So requestAnimationFrame events fire
    pretendToBeVisual: true,
  })
    .then((dom) => {
      // Callback to trigger when phaser has loaded
      dom.window.gameLoaded = () => {
        httpServer.listen(PORT, (): void => {
          console.log(`Server Running here 👉 http://localhost:${PORT}`)
        })
      }

      // Socket
      dom.window.io = io

      // JSDOM's "URL.createObjectURL" bugfix
      dom.window.URL.createObjectURL = (blob): string => {
        if (blob) {
          return (
            datauriParser.format(
              blob.type,
              blob[Object.getOwnPropertySymbols(blob)[0]]._buffer,
            ).content || ''
          )
        }
        return ''
      }
      dom.window.URL.revokeObjectURL = (objectURL) => {}
    })
    .catch((error) => {
      console.log(error.message)
    })
}
