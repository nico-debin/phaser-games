import Phaser from 'phaser'
import AnimationKeys from '~/consts/AnimationKeys'
import TextureKeys from '~/consts/TextureKeys'

import { sceneEvents } from '../events/EventsCenter'

enum PlayerState {
  // Flying normally
  Flying,

  // Player has been hurt and it's recoverying
  Recovering,

  // Player is dead
  Dead,
}

interface ToggleFunctionObject {
  startCallback: Function;
  stopCallback: Function;
}

export default class Player extends Phaser.GameObjects.Container {
  public FLYING_VELOCITY = 200
  public MAX_LIVES = 5

  private bird: Phaser.GameObjects.Sprite
  cursors: Phaser.Types.Input.Keyboard.CursorKeys

  // Amount of lives
  private livesCount: number

  // Player state
  private playerState!: PlayerState

  private blinkIntervalId!: number

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)

    const scale = 0.15

    this.bird = scene.add
      .sprite(0, 0, TextureKeys.Player)
      .setOrigin(0.5, 1)
      .setScale(scale)

    // Animations
    this.createAnimations()
    this.bird.play(AnimationKeys.PlayerFly)

    // Set state and lives
    this.playerState = PlayerState.Flying
    this.livesCount = this.MAX_LIVES

    // Add player to the world
    this.add(this.bird)

    // Physics
    scene.physics.add.existing(this)

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setCircle(this.bird.displayWidth * 0.5 * 0.7, -this.bird.displayWidth * 0.5 * 0.7 + 5, -this.bird.displayHeight * 0.7 - 20)

    // Cursors keys
    this.cursors = scene.input.keyboard.createCursorKeys()
  }

  preUpdate() {
    const body = this.body as Phaser.Physics.Arcade.Body

    if (this.playerState !== PlayerState.Dead) {
      if (this.cursors.space?.isDown) {
        body.setVelocity(this.FLYING_VELOCITY, -250)
      } else if (this.cursors.down?.isDown) {
        body.setVelocityX(0) // DEBUG
      }
    }
  }

  get lives() {
    return this.livesCount
  }

  handleDamage() {
    if (this.playerState === PlayerState.Dead) return
    if (this.playerState === PlayerState.Recovering) return
    if (this.playerState === PlayerState.Flying) {
      if (this.lives >= 1) {
        this.livesCount--
      }

      if (this.lives === 0) {
        this.killPlayer()
      } else {
        this.playerState = PlayerState.Recovering
        this.startBlinking()
        setTimeout(() => {
          this.stopBlinking()
          this.playerState = PlayerState.Flying
        }, 5000)
      }
    }
  }

  private killPlayer() {
    this.playerState = PlayerState.Dead

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setVelocityX(0)

    sceneEvents.emit('player-dead')
  }

  isDead() {
    return this.playerState === PlayerState.Dead
  }

  onDead(callback: Function) {
    sceneEvents.once('player-dead', callback)
  }

  private startBlinking() {
    sceneEvents.emit('player-blinking-start')
    this.blinkIntervalId = setInterval(() => {
      this.bird.setVisible(!this.bird.visible)
    }, 50)
  }

  private stopBlinking() {
    sceneEvents.emit('player-blinking-stop')
    clearInterval(this.blinkIntervalId);
  }

  onBlinking({startCallback, stopCallback}: ToggleFunctionObject) {
    sceneEvents.on('player-blinking-start', startCallback)
    sceneEvents.on('player-blinking-stop', stopCallback)
  }

  createAnimations() {
    this.bird.anims.create({
      key: AnimationKeys.PlayerFly,
      frames: this.bird.anims.generateFrameNames(TextureKeys.Player, {
        start: 1,
        end: 8,
        prefix: 'frame-',
        suffix: '.png',
      }),
      frameRate: 10,
      repeat: -1,
    })
  }
}
