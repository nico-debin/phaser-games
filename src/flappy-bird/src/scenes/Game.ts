import Phaser from 'phaser'
import TextureKeys from '../consts/TextureKeys'
import Player from '../game/Player'
import SceneKeys from '../consts/SceneKeys'

import { sceneEvents } from '../events/EventsCenter'

// Distance between one pipe and another
const PIPE_DISTANCE = 150 * 2

export default class Game extends Phaser.Scene {
  private background!: Phaser.GameObjects.TileSprite
  private player!: Player
  private pipes!: Phaser.Physics.Arcade.StaticGroup
  private playerPipesOverlap!: Phaser.Physics.Arcade.Collider

  constructor() {
    super(SceneKeys.Game)
  }

  init() {}

  create() {
    this.scene.run(SceneKeys.GameUI)

    const width = this.scale.width
    const height = this.scale.height

    // Set background
    this.background = this.add
      .tileSprite(0, 0, width, height, TextureKeys.Background)
      .setOrigin(0, 0)
      .setScrollFactor(0, 0)

    // Create player
    this.player = new Player(this, 200, 200)

    // Create Pipes
    this.createPipes()

    // Add player
    this.add.existing(this.player)

    // Show Game Over scene when player dies
    this.player.onDead(() => {
      this.playerPipesOverlap.destroy()

      this.scene.run(SceneKeys.GameOver)

      this.input.keyboard.once('keydown-ENTER', () => {
        this.scene.stop(SceneKeys.GameOver)
        this.scene.restart()
      })
    })

    this.playerPipesOverlap = this.physics.add.overlap(
      this.player,
      this.pipes,
      this.handlePlayerPipeOverlap,
      undefined,
      this,
    )

    // Disable Player-Pipes collider when blinking
    this.player.onBlinking({
      startCallback: () => {
        this.playerPipesOverlap.active = false
      },
      stopCallback: () => {
        this.playerPipesOverlap.active = true
      },
    })

    const body = this.player.body as Phaser.Physics.Arcade.Body
    body.setCollideWorldBounds(true)
    body.setVelocityX(this.player.FLYING_VELOCITY)

    // World bounds
    this.physics.world.setBounds(0, 0, Number.MAX_SAFE_INTEGER, height)

    // Follow the player with the main camera
    this.cameras.main.startFollow(this.player)
    this.cameras.main.setBounds(0, 0, Number.MAX_SAFE_INTEGER, height)
  }

  createPipes() {
    this.pipes = this.physics.add.staticGroup()
    for (let i = 1; i <= 6; ++i) {
      const x = 500 + PIPE_DISTANCE * i
      const {
        bottomY,
        topY,
      } = this.generateRandomVerticalPositionPipesCoordinates()

      const platformBottom = this.pipes.create(
        x,
        bottomY,
        TextureKeys.Pipe,
      ) as Phaser.Physics.Arcade.Sprite
      platformBottom.setOrigin(0.5, 0)

      const bodyBottom = platformBottom.body as Phaser.Physics.Arcade.StaticBody
      bodyBottom.setOffset(0, platformBottom.displayHeight / 2)

      // Create Top pipes
      const platformTop = this.pipes.create(
        x,
        topY,
        TextureKeys.Pipe,
      ) as Phaser.Physics.Arcade.Sprite
      platformTop.setOrigin(0.5, 1).setFlipY(true)

      const bodyTop = platformTop.body as Phaser.Physics.Arcade.StaticBody
      bodyTop.setOffset(0, -platformTop.displayHeight / 2)
    }
  }

  update() {
    // Wrap pipes
    this.wrapPipes()

    // Scroll the background
    this.background.setTilePosition(this.cameras.main.scrollX)

    if (this.player.isDead()) {
      const body = this.player.body as Phaser.Physics.Arcade.Body
      body.setCollideWorldBounds(false)
    }
  }

  wrapPipes() {
    let cont = 0
    const maxX = this.getRigthMostPipePosition()
    this.pipes.children.iterate((child) => {
      const pipe = child as Phaser.Physics.Arcade.Sprite
      const scrollX = this.cameras.main.scrollX

      if (pipe.x + pipe.displayWidth / 2 < scrollX) {
        // const {
        //   topY,
        //   bottomY,
        // } = this.generateRandomVerticalPositionPipesCoordinates()

        // TODO: how to tell if current pipe is top or bottom pipe?
        // How to encapsulate that logic? maybe a static group for each column?

        pipe.x = maxX + PIPE_DISTANCE
        pipe.body.updateFromGameObject()
      }
    })
  }

  // Find the max X of all pipes
  getRigthMostPipePosition() {
    const firstPipe = this.pipes.getChildren()[0] as Phaser.Physics.Arcade.Sprite
    let maxX = firstPipe.x
    this.pipes.children.iterate((child) => {
      const pipe = child as Phaser.Physics.Arcade.Sprite

      if (pipe.x > maxX) {
        maxX = pipe.x
      }
    })
    return maxX
  }

  handlePlayerPipeOverlap(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject,
  ) {
    const player = obj1 as Player
    player.handleDamage()

    sceneEvents.emit('player-health-changed', player.lives)
  }

  generateRandomVerticalPositionPipesCoordinates() {
    const playerHeight = (this.player.body as Phaser.Physics.Arcade.Body).height

    // Space between top tube and bottom tube, to let the player go through
    const playerOffset = 2 * playerHeight

    // Space with world border
    const marginOffset = 10

    let topY = Phaser.Math.Between(
      marginOffset,
      this.scale.height - playerOffset - marginOffset,
    )
    let bottomY = Phaser.Math.Between(
      topY + playerOffset,
      this.scale.height - marginOffset,
    )

    return { topY, bottomY }
  }
}
