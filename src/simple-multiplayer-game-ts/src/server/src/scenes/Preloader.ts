import Phaser from 'phaser'

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader')
  }

  preload() {
    this.load.image('ship', 'spaceShips_001.png')
  }

  create() {
    this.scene.start('game')
  }
}
