import Phaser from 'phaser'

const adminEvents = new Phaser.Events.EventEmitter()
const uiEvents = new Phaser.Events.EventEmitter()
const settingsEvents = new Phaser.Events.EventEmitter()

export { adminEvents, uiEvents, settingsEvents }
