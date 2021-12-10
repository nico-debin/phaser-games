import express, { Request, Response, Application } from 'express'

const app: Application = express()

const PORT = process.env.PORT || 8081

// app.use(express.static(__dirname + '/client'))

app.get('/', (req: Request, res: Response): void => {
  res.send('Hello Typescript with Node.js!')
  // res.sendFile(__dirname + '/index.html')
})

app.listen(PORT, (): void => {
  console.log(`Server Running here 👉 http://localhost:${PORT}`)
})
