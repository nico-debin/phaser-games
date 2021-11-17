import Phaser from 'phaser'

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader')
  }

  preload() {
    this.load.image('tiles', 'tiles/dungeon_tiles_extruded.png')
    this.load.tilemapTiledJSON('dungeon', 'tiles/dungeon-01.json')

    this.load.atlas('faune', 'character/faune.png', 'character/faune.json')
  }

  create() {
    this.scene.start('game')
  }
}
