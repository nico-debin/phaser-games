import Phaser from 'phaser'
import AnimationKeys from '~/consts/AnimationKeys'
import TextureKeys from '~/consts/TextureKeys'

export default class Player extends Phaser.GameObjects.Container {
  private bird: Phaser.GameObjects.Sprite
  cursors: Phaser.Types.Input.Keyboard.CursorKeys

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)

    const scale = 0.15

    this.bird = scene.add
      .sprite(0, 0, TextureKeys.Player)
      .setOrigin(0.5, 1)
      .setScale(scale)

    this.createAnimations()
    
    this.bird.play(AnimationKeys.PlayerFly)

    this.add(this.bird)

    // Physics
    scene.physics.add.existing(this)

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setSize(this.bird.width * scale, this.bird.height * scale)
    body.setOffset(-this.bird.displayWidth/2, -this.bird.displayHeight)

    // Cursors keys
    this.cursors = scene.input.keyboard.createCursorKeys()
  }

  preUpdate() {
    const body = this.body as Phaser.Physics.Arcade.Body

    if (this.cursors.space?.isDown) {
      body.setVelocityY(-300)
      // body.setAccelerationY(-100)
    }
  }

  createAnimations() {
    this.bird.anims.create({
      key: AnimationKeys.PlayerFly,
      frames: this.bird.anims.generateFrameNames(TextureKeys.Player, {
        start: 1,
        end: 8,
        prefix: 'frame-',
        suffix: '.png'
      }),
      frameRate: 10,
      repeat: -1
    })
  }
}
