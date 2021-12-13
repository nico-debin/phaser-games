import Phaser from 'phaser'

import SceneKeys from '../consts/SceneKeys'
import TextureKeys from '../consts/TextureKeys'

export default class Preloader extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Preloader)
  }

  preload() {
    this.load.image(TextureKeys.Ship, 'spaceShips_001.png')
    this.load.image(TextureKeys.OtherPlayer, 'enemyBlack5.png')
  }

  create() {
    this.scene.start(SceneKeys.Game)
  }
}
