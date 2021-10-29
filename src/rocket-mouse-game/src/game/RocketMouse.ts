import Phaser from 'phaser'
import AudioKeys from '~/consts/AudioKeys'
import AnimationKeys from '../consts/AnimationKeys'
import TextureKeys from '../consts/TextureKeys'

enum MouseState {
  Running,
  Killed,
  Dead,
}

export default class RocketMouse extends Phaser.GameObjects.Container {
  private mouse: Phaser.GameObjects.Sprite
  private flames: Phaser.GameObjects.Sprite

  private mouseState = MouseState.Running

  private cursors: Phaser.Types.Input.Keyboard.CursorKeys

  private eventEmitter!: Phaser.Events.EventEmitter

  // private jetpackSoundIsPlaying = false
  private jetpackSound: Phaser.Sound.BaseSound

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)

    this.eventEmitter = new Phaser.Events.EventEmitter()
    this.jetpackSound = this.scene.sound.add(AudioKeys.jetpack)

    this.mouse = scene.add
      .sprite(0, 0, TextureKeys.RocketMouse)
      .setOrigin(0.5, 1)
      .play(AnimationKeys.RocketMouseRun)

    this.flames = scene.add
      .sprite(-63, -15, TextureKeys.RocketMouse)
      .play(AnimationKeys.RocketFlamesOn)

    this.enableJetpack(false)

    this.add(this.flames)
    this.add(this.mouse)

    scene.physics.add.existing(this)

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setSize(this.mouse.width * 0.5, this.mouse.height * 0.7)
    body.setOffset(this.mouse.width * -0.3, -this.mouse.height + 15)

    this.cursors = scene.input.keyboard.createCursorKeys()
  }

  enableJetpack(enabled = true) {
    this.flames.setVisible(enabled)

    // Play or stop jetpack sound
    if (!this.scene.sound.locked) {
      if (enabled) {
        !this.jetpackSound.isPlaying && this.jetpackSound.play()
      } else {
        this.jetpackSound.stop()
      }
    }
  }

  preUpdate() {
    const body = this.body as Phaser.Physics.Arcade.Body
    switch (this.mouseState) {
      case MouseState.Running: {
        if (this.cursors.space?.isDown) {
          body.setAccelerationY(-600)
          this.enableJetpack()
          this.mouse.play(AnimationKeys.RocketMouseFly, true)
        } else {
          body.setAccelerationY(0)
          this.enableJetpack(false)
        }

        // DEBUG - Move around the player with the arrows
        if (this.cursors.left?.isDown) {
          body.setVelocityX(-200)
        } else if (this.cursors.right?.isDown) {
          body.setVelocityX(200)
        } else if (this.cursors.down?.isDown) {
          body.setVelocityX(0)
        }

        if (body.blocked.down) {
          this.mouse.play(AnimationKeys.RocketMouseRun, true)
        } else if (body.velocity.y > 0) {
          this.mouse.play(AnimationKeys.RocketMouseFall, true)
        }
        break
      }

      case MouseState.Killed: {
        body.velocity.x *= 0.99
        if (body.velocity.x <= 100) {
          this.mouseState = MouseState.Dead
        }
        break
      }

      case MouseState.Dead: {
        body.setVelocity(0)
        this.eventEmitter.emit('mouse-dead')
        break
      }
    }
  }

  kill() {
    if (this.mouseState !== MouseState.Running) return

    this.jetpackSound.stop()

    this.mouseState = MouseState.Killed

    this.mouse.play(AnimationKeys.RocketMouseDead)
    this.scene.sound.play(AudioKeys.laser)

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setAccelerationY(0)
    body.setVelocity(1000, 0)
    this.enableJetpack(false)
  }

  isRunning() {
    return this.mouseState === MouseState.Running
  }

  isDeadOrKilled() {
    return this.mouseState === MouseState.Killed || this.mouseState === MouseState.Dead
  }

  onDead(callback: Function) {
    this.eventEmitter.once('mouse-dead', callback)
  }
}
