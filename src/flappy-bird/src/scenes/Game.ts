import Phaser from 'phaser'
import TextureKeys from '../consts/TextureKeys'
import Player from '../game/Player'
import SceneKeys from '../consts/SceneKeys'

import { sceneEvents } from '../events/EventsCenter'
import PipeColumn from '~/game/PipeColumn'

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

    // this.add.existing(new PipeColumn(this, width * 0.5))

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
    this.pipes = this.physics.add.staticGroup({
      classType: PipeColumn,
    })
    for (let i = 1; i <= 6; ++i) {
      const x = 500 + PIPE_DISTANCE * i
      this.pipes.add(new PipeColumn(this, x))
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
    const maxX = this.getRightMostPipePosition()

    this.pipes.children.iterate((child) => {
      const pipeColumn = child as PipeColumn
      const scrollX = this.cameras.main.scrollX

      if (pipeColumn.x + pipeColumn.displayWidth / 2 < scrollX) {
        pipeColumn.wrapPipes(maxX + PIPE_DISTANCE)
      }
    })
  }

  // Find the max X of all pipes
  getRightMostPipePosition() {
    const firstPipeColumn = this.pipes.getChildren()[0] as PipeColumn
    let maxX = firstPipeColumn.x
    this.pipes.children.iterate((child) => {
      const pipeColumn = child as PipeColumn

      if (pipeColumn.x > maxX) {
        maxX = pipeColumn.x
      }
    })
    return maxX
  }

  handlePlayerPipeOverlap(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject,
  ) {
    console.log('OVERLAP')
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
