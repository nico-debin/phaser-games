import Phaser from 'phaser'
import SpeechBubble from '../../classes/SpeechBubble'
import AvatarAnimationKeys from '../../consts/AvatarAnimationKeys'

import NpcKeys from '../../consts/NpcKeys'

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
  private speechBubble?: SpeechBubble
  private isSpeaking = false

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    frame?: string | number,
  ) {
    super(scene, x, y, NpcKeys.COBRA, frame)

    this.play(`${NpcKeys.COBRA}-idle-down`)

    scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleTileCollision, this)

    this.direction = randomDirection(this.direction)
    this.moveEvent = scene.time.addEvent({
      delay: 2000,
      callback: () => {
        this.direction = randomDirection(this.direction)
      },
      loop: true,
    })

    this.speechBubble = new SpeechBubble(scene, x, y, 100, 35, "Go Cobras!", {
      fontSize: '14px',
    });
    this.speechBubble.setOffset(3, -this.displayHeight).setVisible(false);
  }

  destroy(fromScene?: boolean | undefined): void {
    this.moveEvent.destroy()
    super.destroy(fromScene)
    this.speechBubble?.destroy()
  }

  speak() {
    if (this.isSpeaking) return;
    this.isSpeaking = true;
    this.speechBubble?.setVisible(true);
    this.scene.time.delayedCall(3000, () => {
      this.speechBubble?.setVisible(false);
      this.isSpeaking = false;
    })
  }

  private handleTileCollision(gameObject: Phaser.GameObjects.GameObject, tile: Phaser.Tilemaps.Tile) {
    if (gameObject !== this) {
      return
    }

    this.direction = randomDirection(this.direction)
  }
  
  preUpdate(t: number, dt: number): void {
    super.preUpdate(t, dt)

    const speed = 100
    switch (this.direction) {
      case Direction.UP:
        this.anims.play(`${NpcKeys.COBRA}-${AvatarAnimationKeys.WALK_UP}`, true)
        this.setVelocity(0, -speed)
        break
        
        case Direction.DOWN:
        this.anims.play(`${NpcKeys.COBRA}-${AvatarAnimationKeys.WALK_DOWN}`, true)
        this.setVelocity(0, speed)
        break
        
        case Direction.LEFT:
        this.anims.play(`${NpcKeys.COBRA}-${AvatarAnimationKeys.WALK_SIDE}`, true)
        this.setVelocity(-speed, 0)
        this.setFlipX(true)
        break
        
        case Direction.RIGHT:
        this.anims.play(`${NpcKeys.COBRA}-${AvatarAnimationKeys.WALK_SIDE}`, true)
        this.setVelocity(speed, 0)
        this.setFlipX(false)
        break
    }

    this.speechBubble?.setPosition(this.x, this.y);
  }
}
