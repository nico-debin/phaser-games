import Phaser from 'phaser'

import TextureKeys from '../consts/TextureKeys'

import { MovementInput, PlayerId } from '../types/playerTypes'

import Player from './Player'

export default class Fauna extends Player {

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    playerId: PlayerId
  ) {
    super(scene, x, y, TextureKeys.Fauna, playerId)
    this.scale = 2

    console.log('Playing fauna animation')
    this.anims.play('fauna-idle-down')
  }

  update(movementInput: MovementInput) {
    super.update(movementInput)

    if (movementInput.left) {
      this.anims.play('fauna-run-side', true)

      // Flip sprite to the left
      this.setFlipX(true)
    } else if (movementInput.right) {
      this.anims.play('fauna-run-side', true)

      // Flip sprite to the right
      this.setFlipX(false)
    } else if (movementInput.up) {
      this.anims.play('fauna-run-up', true)
    } else if (movementInput.down) {
      this.anims.play('fauna-run-down', true)
    } else {
      const parts = this.anims.currentAnim.key.split('-')
      parts[1] = 'idle'
      this.anims.play(parts.join('-'))
    }
  }
}
