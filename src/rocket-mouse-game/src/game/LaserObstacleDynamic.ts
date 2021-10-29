import Phaser from 'phaser'
import LaserObstacleMovementKeys from '~/consts/LaserObstacleMovementKeys'
import TextureKeys from '~/consts/TextureKeys'

export default class LaserObstacleDynamic extends Phaser.GameObjects.Container {
  startX: number
  startY: number
  tween: Phaser.Tweens.Tween | null
  diagonalDirection: number

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)

    this.startX = x
    this.startY = y
    this.tween = null
    this.diagonalDirection = 1

    const scale = 0.6

    const top = scene.add
      .image(0, -10, TextureKeys.LaserEnd)
      .setScale(scale)
      .setOrigin(0.5, 0)

    const middle = scene.add
      .image(0, top.y + top.displayHeight, TextureKeys.LaserMiddle)
      .setScale(scale)
      .setOrigin(0.5, 0)

    // set height of middle laser to 200px
    middle.setDisplaySize(middle.width * middle.scaleX, 60)

    const bottom = scene.add
      .image(0, middle.y + middle.displayHeight, TextureKeys.LaserEnd)
      .setScale(scale)
      .setOrigin(0.5, 0)
      .setFlipY(true)

    this.add(top)
    this.add(middle)
    this.add(bottom)

    scene.physics.add.existing(this)

    const body = this.body as Phaser.Physics.Arcade.Body
    const width = top.displayWidth
    const height =
      top.displayHeight + middle.displayHeight + bottom.displayHeight

    body.setSize(width * 0.5, height * 0.85)
    body.setOffset(-width * 0.25, 0) // Based on values given to setOrigin
    body.setAllowGravity(false)
    body.setVelocityY(0)

    body.position.x = this.x + body.offset.x
    body.position.y = this.y
  }

  stopMove() {
    if (this.tween) {
      this.tween.stop()
      this.tween = null
    }
  }

  setMoveType(movementType: LaserObstacleMovementKeys) {
    console.log(`LaserObstacle: setMoveType(${movementType})`)
    this.stopMove()
    switch (movementType) {
      case LaserObstacleMovementKeys.static: {
        // Don't do anything
        break
      }
      case LaserObstacleMovementKeys.horizontal: {
        this.moveHorizontally()
        break
      }
      case LaserObstacleMovementKeys.vertical: {
        this.moveVertically()
        break
      }
      case LaserObstacleMovementKeys.diagonal: {
        this.moveDiagonally()
        break
      }
      case LaserObstacleMovementKeys.random: {
        const moves = [
          LaserObstacleMovementKeys.vertical,
          LaserObstacleMovementKeys.horizontal,
          LaserObstacleMovementKeys.diagonal,
        ]
        const randomIndex = Math.floor(Math.random() * moves.length)
        const randomMove = moves[randomIndex]
        this.setMoveType(randomMove)
        break
      }
    }
  }

  private moveVertically() {
    this.startY = this.y
    this.tween = this.scene.tweens.addCounter({
      from: 0,
      to: -200,
      duration: 2000,
      ease: Phaser.Math.Easing.Sine.InOut,
      repeat: -1,
      yoyo: true,
      onUpdate: (tween, target) => {
        const y = this.startY + target.value
        const dy = y - this.y
        this.y = y

        const body = this.body as Phaser.Physics.Arcade.Body
        body.setVelocityY(dy)
      },
    })
  }

  private moveHorizontally() {
    this.startX = this.x
    this.tween = this.scene.tweens.addCounter({
      from: 0,
      to: -300,
      duration: 2000,
      ease: Phaser.Math.Easing.Sine.InOut,
      repeat: -1,
      yoyo: true,
      onUpdate: (tween, target) => {
        const x = this.startX + target.value
        const dx = x - this.x
        this.x = x

        const body = this.body as Phaser.Physics.Arcade.Body
        body.setVelocityX(dx)
      },
    })
  }

  private moveDiagonally() {
    this.startX = this.x
    this.startY = this.y
    this.diagonalDirection = Math.random() < 0.5 ? -1 : 1
    this.tween = this.scene.tweens.addCounter({
      from: -300,
      to: 0,
      duration: 2000,
      ease: Phaser.Math.Easing.Sine.InOut,
      repeat: -1,
      yoyo: true,
      onUpdate: (tween, target) => {
        const x = this.startX + target.value * this.diagonalDirection
        const y = this.startY + target.value
        const dx = x - this.x
        const dy = y - this.y
        this.x = x
        this.y = y

        const body = this.body as Phaser.Physics.Arcade.Body
        body.setVelocity(dx, dy)
      },
    })
  }
}
