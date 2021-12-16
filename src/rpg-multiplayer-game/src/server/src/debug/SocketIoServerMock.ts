import Phaser from 'phaser'

class SocketMock {
  private socketId: string
  private eventEmitter: Phaser.Events.EventEmitter

  constructor(eventEmitter: Phaser.Events.EventEmitter){
    this.socketId = Phaser.Math.Between(10000, 99999).toString()
    this.eventEmitter = eventEmitter
  }

  get id() {
    return this.socketId
  }

  get broadcast() {
    return this
  }

  emit(event: string, ...args: any[]) {
    // console.log(`SocketMock emit "${event}" with args:`, { ...args })
    this.eventEmitter.emit(event, ...args)
  }
  
  on(event: string, callback: Function) {
    // console.log(`SocketMock on "${event}" received`)
    const newCallback = (...args: any[]) => {
      // console.log(`SocketMock executing "${event}" callback with args:`, { ...args })
      callback(...args)
    }
    this.eventEmitter.on(event, newCallback)
  }
}

class SocketIoServerMock {
  private networkEventsMock: Phaser.Events.EventEmitter

  constructor() {
    this.networkEventsMock = new Phaser.Events.EventEmitter()
  }

  on(event: string, callback: Function) {
    // console.log(`SocketServerMock on "${event}" received`)
    const newCallback = (...args: any[]) => {
      // console.log(`SocketServerMock executing "${event}" callback with args:`, { ...args })      
      const socketMock = new SocketMock(this.networkEventsMock)
      callback(socketMock, ...args)
    }
    this.networkEventsMock.on(event, newCallback)
  }

  emit(event: string, ...args: any[]) {
    // console.log(`SocketServerMock emit "${event}" with args:`, { ...args })
    this.networkEventsMock.emit(event, ...args)
  }
}

export const socketIoServerMock = new SocketIoServerMock()
