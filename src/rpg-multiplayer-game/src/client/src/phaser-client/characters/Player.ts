import Phaser from 'phaser'

import { MovementInput, PlayerId } from '../types/playerTypes'

export default abstract class Player extends Phaser.GameObjects.Sprite {
  private playerId: PlayerId
  protected orientation: 'left' | 'right' | 'up' | 'down' | undefined;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, playerId: string, frame?: string | number | undefined) {
    super(scene, x, y, texture)
    this.playerId = playerId
  }

  get id (){
    return this.playerId
  }

  update(movementInput: MovementInput) {
    if (movementInput.left) {
      this.orientation = 'left';
    } else if (movementInput.right) {
      this.orientation = 'right';
    } else if (movementInput.up) {
      this.orientation = 'up';
    } else if (movementInput.down) {
      this.orientation = 'down';
    }
  }

  fight() {
    // Override this method on child classes
  }
}
