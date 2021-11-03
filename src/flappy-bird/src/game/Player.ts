import Phaser from 'phaser'
import AnimationKeys from '~/consts/AnimationKeys'
import TextureKeys from '~/consts/TextureKeys'

enum PlayerState {
  // Flying normally
  Flying,

  // Player has been hurt and it's recoverying
  Recovering,

  // Player is dead
  Dead,
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
    body.setSize(this.bird.width * scale, this.bird.height * scale)
    body.setOffset(-this.bird.displayWidth / 2, -this.bird.displayHeight)

    // Cursors keys
    this.cursors = scene.input.keyboard.createCursorKeys()
  }

  preUpdate() {
    const body = this.body as Phaser.Physics.Arcade.Body

    if (this.playerState !== PlayerState.Dead) {
      if (this.cursors.space?.isDown) {
        body.setVelocity(this.FLYING_VELOCITY, -400)
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
      console.log(`Lives count: ${this.lives}`)
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
    console.log('Killing Player')
    this.playerState = PlayerState.Dead
  }

  isDead() {
    return this.playerState === PlayerState.Dead
  }

  private startBlinking() {
    this.blinkIntervalId = setInterval(() => {
      this.bird.setVisible(!this.bird.visible)
    }, 50)
  }

  private stopBlinking() {
    clearInterval(this.blinkIntervalId);
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
