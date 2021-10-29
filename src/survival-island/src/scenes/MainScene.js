import Phaser from '../lib/phaser.js'
import Player from '../game/Player.js'

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene')
  }

  preload() {
    Player.preload(this, ['blacksmith', 'thief'])
    this.load.image('tiles', 'assets/images/RPG Nature Tileset.png')
    this.load.tilemapTiledJSON('map', 'assets/images/map.json')
  }

  createMap() {
    // Create map
    const map = this.make.tilemap({ key: 'map' })
    const tileset = map.addTilesetImage(
      'RPG Nature Tileset',
      'tiles',
      32,
      32,
      0,
      0,
    )
    const layer1 = map.createLayer('Tile Layer 1', tileset, 0, 0)
    const layer2 = map.createLayer('Tile Layer 2', tileset, 0, 0)

    layer1.setCollisionByProperty({ collides: true })
    this.matter.world.convertTilemapLayer(layer1)
  }

  createPlayers() {
    // blacksmith
    this.hero = new Player({
      name: 'blacksmith',
      scene: this,
      x: this.game.canvas.width / 2,
      y: this.game.canvas.height / 2,
    })

    this.hero.inputKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    })

    // thief 1
    this.thief1 = new Player({
      name: 'thief',
      scene: this,
      x: this.game.canvas.width / 3,
      y: this.game.canvas.height / 3,
    })

    this.thief1.inputKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.I,
      down: Phaser.Input.Keyboard.KeyCodes.K,
      left: Phaser.Input.Keyboard.KeyCodes.J,
      right: Phaser.Input.Keyboard.KeyCodes.L,
    })

    // thief 2
    this.thief2 = new Player({
      name: 'thief',
      scene: this,
      x: this.game.canvas.width / 4,
      y: this.game.canvas.height / 4,
    })

    this.thief2.inputKeys = this.input.keyboard.addKeys('up,down,left,right')
  }

  create() {
    this.createMap()
    this.createPlayers()

    const name = this.plugins.get('RandomNamePlugin').getName()
    console.log(name)
  }

  update() {
    this.hero.update()
    this.thief1.update()
    this.thief2.update()
  }
}
