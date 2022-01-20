import Phaser from 'phaser'

enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

const randomDirection = (exclude: Direction) => {
  let newDirection = Phaser.Math.Between(0, 3)
  while (newDirection === exclude) {
    newDirection = Phaser.Math.Between(0, 3)
  }

  return newDirection
}

export default class Cobra extends Phaser.Physics.Arcade.Sprite {
  private direction = Direction.DOWN
  private moveEvent: Phaser.Time.TimerEvent

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number,
  ) {
    super(scene, x, y, texture, frame)

    this.anims.play('cobra-idle-down')

    scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleTileCollision, this)

    this.direction = randomDirection(this.direction)
    this.moveEvent = scene.time.addEvent({
      delay: 2000,
      callback: () => {
        this.direction = randomDirection(this.direction)
      },
      loop: true,
    })
  }

  destroy(fromScene?: boolean | undefined)
  {
    this.moveEvent.destroy()
    super.destroy(fromScene)
  }

  private handleTileCollision(gameObject: Phaser.GameObjects.GameObject, tile: Phaser.Tilemaps.Tile) {
    if (gameObject !== this) {
      return
    }

    this.direction = randomDirection(this.direction)
  }
  
  preUpdate(t: number, dt: number) {
    super.preUpdate(t, dt)

    const speed = 100
    switch (this.direction) {
      case Direction.UP:
        this.anims.play('cobra-walk-up', true)
        this.setVelocity(0, -speed)
        break
        
        case Direction.DOWN:
        this.anims.play('cobra-walk-down', true)
        this.setVelocity(0, speed)
        break
        
        case Direction.LEFT:
        this.anims.play('cobra-walk-side', true)
        this.setVelocity(-speed, 0)
        this.setFlipX(true)
        break
        
        case Direction.RIGHT:
        this.anims.play('cobra-walk-side', true)
        this.setVelocity(speed, 0)
        this.setFlipX(false)
        break
    }
  }
}
