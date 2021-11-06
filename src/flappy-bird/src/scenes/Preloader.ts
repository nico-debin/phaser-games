import Phaser from 'phaser'
import TextureKeys from '~/consts/TextureKeys'
import SceneKeys from '../consts/SceneKeys'

export default class Preloader extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Preloader)
  }

  preload() {
    // Images
    this.load.image(TextureKeys.Background, 'sky.jpg')
    this.load.image(TextureKeys.Ground, 'ground.png')
    this.load.image(TextureKeys.Pipe, 'pipe.png')
    this.load.image(TextureKeys.HeartEmpty, 'ui_heart_empty.png')
    this.load.image(TextureKeys.HeartFull, 'ui_heart_full.png')

    this.load.atlas(
      TextureKeys.Player,
      'characters/bird.png',
      'characters/bird.json',
    )
  }

  create() {
    this.scene.start(SceneKeys.Game)
  }
}