import Phaser from 'phaser'

import TextureKeys from '../consts/TextureKeys'

import { MovementInput, PlayerId } from '../types/playerTypes'

import Player from './Player'

export default class Lizard extends Player {

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    playerId: PlayerId
  ) {
    super(scene, x, y, TextureKeys.Lizard, playerId)
    this.scale = 2

    this.anims.play('lizard-idle')
  }

  update(movementInput: MovementInput) {
    super.update(movementInput)

    const runAnimation = 'lizard-run'
    const idleAnimation = 'lizard-idle'

    if (movementInput.left) {
      this.anims.play(runAnimation, true)

      // Flip sprite to the left
      this.setFlipX(true)
    } else if (movementInput.right) {
      this.anims.play(runAnimation, true)

      // Flip sprite to the right
      this.setFlipX(false)
    } else if (movementInput.up) {
      this.anims.play(runAnimation, true)
    } else if (movementInput.down) {
      this.anims.play(runAnimation, true)
    } else {
      this.anims.play(idleAnimation, true)
    }
  }
}
