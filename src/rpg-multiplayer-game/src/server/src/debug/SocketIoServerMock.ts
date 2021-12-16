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
    console.log(`SocketMock emit "${event}" with args:`, { args })
    this.eventEmitter.emit(event, args)
  }

  on(event: string, callback: Function) {
    this.eventEmitter.on(event, callback)
  }
}

class SocketIoServerMock {
  private networkEventsMock: Phaser.Events.EventEmitter

  constructor() {
    this.networkEventsMock = new Phaser.Events.EventEmitter()
  }

  on(event: string, callback: Function) {
    const newCallback = () => {
      const socketMock = new SocketMock(this.networkEventsMock)

      callback(socketMock)
    }
    this.networkEventsMock.on(event, newCallback)
  }

  emit(event: string, ...args: any[]) {
    console.log(`SocketServerMock emit "${event}" with args:`, { args })
    this.networkEventsMock.emit(event, args)
  }
}

export const socketIoServerMock = new SocketIoServerMock()
