import Phaser from 'phaser'
import TextureKeys from '../consts/TextureKeys'

export default class Pipe extends Phaser.Physics.Arcade.Sprite {
  private isBottomPipe: Boolean

  constructor(scene: Phaser.Scene, x: number, y: number, isBottomPipe = false) {
    super(scene, x, y, TextureKeys.Pipe)
    this.isBottomPipe = isBottomPipe

    if (isBottomPipe) {
      this.setOrigin(0.5, 0)
    } else {
      this.setOrigin(0.5, 1).setFlipY(true)
    }
  }

  get isBottom() {
    return this.isBottomPipe
  }

  get isTop() {
    return !this.isBottom
  }
}
