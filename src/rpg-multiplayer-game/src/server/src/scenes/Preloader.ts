import Phaser from 'phaser'

import SceneKeys from '../consts/SceneKeys'
import TextureKeys from '../consts/TextureKeys'

export default class Preloader extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Preloader)
  }

  preload() {
    this.load.tilemapTiledJSON('islands', 'tiles/islands-01.json')
  }

  create() {
    this.scene.start(SceneKeys.Game)
  }
}
