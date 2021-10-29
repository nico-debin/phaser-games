import Phaser from 'phaser'
import TextureKeys from '~/consts/TextureKeys'
import Player from '../game/Player'
import SceneKeys from '../consts/SceneKeys'

export default class Game extends Phaser.Scene {
  private background!: Phaser.GameObjects.TileSprite
  private player!: Player

  constructor() {
    super(SceneKeys.Game)
  }

  init() {}

  create() {
    const width = this.scale.width
    const height = this.scale.height

    // Set background
    this.background = this.add
      .tileSprite(0, 0, width, height, TextureKeys.Background)
      .setOrigin(0, 0)
      .setScrollFactor(0, 0)

    // Create player
    this.player = new Player(this, 200, 200)
    this.add.existing(this.player)

    const body = this.player.body as Phaser.Physics.Arcade.Body
    body.setCollideWorldBounds(true)
    body.setVelocityX(250)

    // World bounds
    this.physics.world.setBounds(0, 0, Number.MAX_SAFE_INTEGER, height)

    // Follow the player with the main camera
    this.cameras.main.startFollow(this.player)
    this.cameras.main.setBounds(0, 0, Number.MAX_SAFE_INTEGER, height)
  }

  update() {
    // Scroll the background
    this.background.setTilePosition(this.cameras.main.scrollX)
  }
}
