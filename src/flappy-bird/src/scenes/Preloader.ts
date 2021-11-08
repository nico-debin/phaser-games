import Phaser from 'phaser'
import AudioKeys from '~/consts/AudioKeys'
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
    this.load.image(TextureKeys.HeartScene, 'heart.png')

    // Audio
    this.load.audio(AudioKeys.PlayerDamage, 'sfx/hit.wav')
    this.load.audio(AudioKeys.PlayerNewLive, 'sfx/new-live.wav')
    this.load.audio(AudioKeys.Ambience, 'sfx/8_Bit_Overworld_Theme_NoDrums.mp3')

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