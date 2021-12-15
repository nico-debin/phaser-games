import Phaser from 'phaser'
import { MovementInput, PlayerId } from '../types/playerTypes'



export default class Player extends Phaser.Physics.Arcade.Image {
  private playerId: PlayerId

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, playerId: PlayerId) {
    super(scene, x, y, texture)
    this.playerId = playerId
  }

  get id (){
    return this.playerId
  }

  update(movementInput: MovementInput) {
    const speed = 300

    if (movementInput.left) {
      this.setVelocity(-speed, 0)
    } else if (movementInput.right) {
      this.setVelocity(speed, 0)
    } else if (movementInput.up) {
      this.setVelocity(0, -speed)
    } else if (movementInput.down) {
      this.setVelocity(0, speed)
    } else {
      this.setVelocity(0, 0)
    }
  }
}
