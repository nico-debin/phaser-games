import Phaser from 'phaser';

const sceneEvents = new Phaser.Events.EventEmitter();
const networkEventsMock = new Phaser.Events.EventEmitter();

export { sceneEvents, networkEventsMock };
