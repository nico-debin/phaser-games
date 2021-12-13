import Phaser from 'phaser'

import SceneKeys from '../consts/SceneKeys'
import TextureKeys from '../consts/TextureKeys'

export default class Preloader extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Preloader)
  }

  preload() {
    this.load.image(TextureKeys.Ship, 'spaceShips_001.png')
  }

  create() {
    this.scene.start(SceneKeys.Game)
  }
}
