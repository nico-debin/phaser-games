import Phaser from 'phaser'

import AvatarKeys from '../consts/AvatarKeys'
import FontKeys from '../consts/FontKeys'
import SceneKeys from '../consts/SceneKeys'
import TextureKeys from '../consts/TextureKeys'

export default class Preloader extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Preloader)
  }

  preload() {
    this.load.image('tiles-islands-beach', 'tiles/tf_beach_tileB.png')
    this.load.image('tiles-islands-shoreline', 'tiles/tf_beach_tileA1.png')
    this.load.tilemapTiledJSON('islands', 'tilemaps/islands-01.json')

    this.load.atlas(TextureKeys.Fauna, 'characters/fauna.png', 'characters/fauna.json')
    this.load.atlas(TextureKeys.Lizard, 'enemies/lizard.png', 'enemies/lizard.json')

    this.load.spritesheet(AvatarKeys.ADRIAN_TOMKINS, 'characters/adrian-tomkins.png', {frameWidth: 64, frameHeight: 64})
    this.load.spritesheet(AvatarKeys.CALVIN_KOEPKE, 'characters/calvin-koepke.png', {frameWidth: 64, frameHeight: 64})
    this.load.spritesheet(AvatarKeys.JOEL_BOWEN, 'characters/joel-bowen.png', {frameWidth: 64, frameHeight: 64})
    this.load.spritesheet(AvatarKeys.JOHN_GEIGER, 'characters/john-geiger.png', {frameWidth: 64, frameHeight: 64})
    this.load.spritesheet(AvatarKeys.LAKSHMI_VEGESNA, 'characters/lakshmi-vegesna.png', {frameWidth: 64, frameHeight: 64})
    this.load.spritesheet(AvatarKeys.MICHAEL_KANTOR, 'characters/michael-kantor.png', {frameWidth: 64, frameHeight: 64})
    this.load.spritesheet(AvatarKeys.NICK_TAYLOR, 'characters/nick-taylor.png', {frameWidth: 64, frameHeight: 64})
    this.load.spritesheet(AvatarKeys.NICOLAS_DEBIN, 'characters/nicolas-debin.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet(AvatarKeys.RYAN_MCKAY, 'characters/ryan-mckay.png', {frameWidth: 64, frameHeight: 64})

    // Fonts
    this.load.bitmapFont(FontKeys.DESYREL, 'fonts/bitmap/desyrel.png', 'fonts/bitmap/desyrel.xml')
  }

  create() {
    this.scene.start(SceneKeys.Game)
  }
}
