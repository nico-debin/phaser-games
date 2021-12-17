import Phaser from 'phaser'

export class SocketMock {
  private socketId: string
  private eventEmitter: Phaser.Events.EventEmitter

  constructor(){
    this.socketId = Phaser.Math.Between(10000, 99999).toString()
    this.eventEmitter = new Phaser.Events.EventEmitter()
  }

  get id() {
    return this.socketId
  }

  get broadcast() {
    return this
  }

  emit(event: string, ...args: any[]) {
    // console.log(`SocketMock emit (id: ${this.id}) "${event}" with args:`, { ...args })
    this.eventEmitter.emit(event, ...args)
  }
  
  on(event: string, callback: Function) {
    // console.log(`SocketMock on "${event}" received`)
    const newCallback = (...args: any[]) => {
      // console.log(`SocketMock (id: ${this.id}) executing "${event}" callback with args:`, { ...args })
      callback(...args)
    }
    this.eventEmitter.on(event, newCallback)
  }
}

interface SocketMockCollection {
  [id: string]: SocketMock
}

class SocketIoServerMock {
  private networkEventsMock: Phaser.Events.EventEmitter
  private socketMocks: SocketMockCollection = {}

  constructor() {
    this.networkEventsMock = new Phaser.Events.EventEmitter()
  }

  on(event: string, callback: Function) {
    // console.log(`SocketServerMock on "${event}" received`)
    const newCallback = (...args: any[]) => {
      // console.log(`SocketServerMock executing "${event}" callback with args:`, { ...args })      
      const socketMock = new SocketMock()
      socketIoServerMock.addSocketMock(socketMock)
      callback(socketMock, ...args)
    }
    this.networkEventsMock.on(event, newCallback)
  }

  emit(event: string, ...args: any[]) {
    // console.log(`SocketServerMock emit "${event}" with args:`, { ...args })
    this.networkEventsMock.emit(event, ...args)
  }

  addSocketMock(socket: SocketMock) {
    // console.log(`New socket with id '${socket.id}' added`)
    this.socketMocks[socket.id] = socket
  }

  getSocketMock(socketId: string): SocketMock {
    return this.socketMocks[socketId]
  }
}

export const socketIoServerMock = new SocketIoServerMock()
