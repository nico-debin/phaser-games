const path = require('path')
const jsdom = require('jsdom')

const express = require('express')
const app = express()
const server = require('http').Server(app)

const { Server } = require('socket.io')
const io = new Server(server)

const { JSDOM } = jsdom
const DatauriParser = require('datauri/parser')
const datauriParser = new DatauriParser()

app.use(express.static(__dirname + '/public'))

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})

function setupAuthoritativePhaser() {
  JSDOM.fromFile(path.join(__dirname, 'authoritative_server/index.html'), {
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
        server.listen(process.env.PORT || 8081, function () {
          console.log(`Listening on ${server.address().port}`)
        })
      }

      // Socket
      dom.window.io = io

      // JSDOM's "URL.createObjectURL" bugfix
      dom.window.URL.createObjectURL = (blob) => {
        if (blob) {
          return datauriParser.format(
            blob.type,
            blob[Object.getOwnPropertySymbols(blob)[0]]._buffer,
          ).content
        }
      }
      dom.window.URL.revokeObjectURL = (objectURL) => {}
    })
    .catch((error) => {
      console.log(error.message)
    })
}
setupAuthoritativePhaser()
