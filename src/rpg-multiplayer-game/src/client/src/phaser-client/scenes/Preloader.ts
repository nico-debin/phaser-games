import Phaser from 'phaser'

import AvatarKeys from '../consts/AvatarKeys'
import FontKeys from '../consts/FontKeys'
import NpcKeys from '../consts/NpcKeys'
import SceneKeys from '../consts/SceneKeys'
import TextureKeys from '../consts/TextureKeys'
import TilemapKeys from '../consts/TilemapKeys'
import { gameState } from '../states/GameState'
import { autorun } from 'mobx'

export default class Preloader extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Preloader)
  }

  preload() {
    // Tilemaps
    this.load.image(TilemapKeys.BeachTiles, 'tiles/tf_beach_tileB.png')
    this.load.image(TilemapKeys.BeachShoreTiles, 'tiles/tf_beach_tileA1.png')
    this.load.tilemapTiledJSON(TilemapKeys.IslandsTilemap, 'tilemaps/islands-01.json')

    // UI
    this.load.atlas(TextureKeys.UIMenu1, 'ui/ui-menu.png', 'ui/ui-menu_atlas.json')
    this.load.image(TextureKeys.SettingsBoard, 'ui/settings-board-500x600.png')
    this.load.image(TextureKeys.Paper, 'ui/paper-small.png')

    // Main Characters
    this.load.spritesheet(AvatarKeys.ADRIAN_TOMKINS, 'characters/adrian-tomkins.png', {frameWidth: 64, frameHeight: 64})
    this.load.spritesheet(AvatarKeys.CALVIN_KOEPKE, 'characters/calvin-koepke.png', {frameWidth: 64, frameHeight: 64})
    this.load.spritesheet(AvatarKeys.JOEL_BOWEN, 'characters/joel-bowen.png', {frameWidth: 64, frameHeight: 64})
    this.load.spritesheet(AvatarKeys.JOHN_GEIGER, 'characters/john-geiger.png', {frameWidth: 64, frameHeight: 64})
    this.load.spritesheet(AvatarKeys.LAKSHMI_VEGESNA, 'characters/lakshmi-vegesna.png', {frameWidth: 64, frameHeight: 64})
    this.load.spritesheet(AvatarKeys.MICHAEL_KANTOR, 'characters/michael-kantor.png', {frameWidth: 64, frameHeight: 64})
    this.load.spritesheet(AvatarKeys.NICK_TAYLOR, 'characters/nick-taylor.png', {frameWidth: 64, frameHeight: 64})
    this.load.spritesheet(AvatarKeys.NICOLAS_DEBIN, 'characters/nicolas-debin.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet(AvatarKeys.RYAN_MCKAY, 'characters/ryan-mckay.png', {frameWidth: 64, frameHeight: 64})

    // Default Characters
    this.load.spritesheet(AvatarKeys.BOY_01, 'characters/boy-01.png', {frameWidth: 64, frameHeight: 64})
    this.load.spritesheet(AvatarKeys.NIGHTELF, 'characters/nightelf.png', {frameWidth: 64, frameHeight: 64})
    this.load.spritesheet(AvatarKeys.ORC, 'characters/orc.png', {frameWidth: 64, frameHeight: 64})
    this.load.spritesheet(AvatarKeys.PIRATE_BLUE, 'characters/pirate-blue.png', {frameWidth: 64, frameHeight: 64})
    this.load.spritesheet(AvatarKeys.MAN_01, 'characters/man-01.png', {frameWidth: 64, frameHeight: 64})
    this.load.spritesheet(AvatarKeys.MAN_02, 'characters/man-02.png', {frameWidth: 64, frameHeight: 64})
    this.load.spritesheet(AvatarKeys.GIRL_01, 'characters/girl-01.png', {frameWidth: 64, frameHeight: 64})
    this.load.spritesheet(AvatarKeys.GIRL_02, 'characters/girl-02.png', {frameWidth: 64, frameHeight: 64})
    this.load.spritesheet(AvatarKeys.GIRL_03, 'characters/girl-03.png', {frameWidth: 64, frameHeight: 64})
    this.load.spritesheet(AvatarKeys.GIRL_04, 'characters/girl-04.png', {frameWidth: 64, frameHeight: 64})
    this.load.spritesheet(AvatarKeys.GIRL_05, 'characters/girl-05.png', {frameWidth: 64, frameHeight: 64})
    this.load.spritesheet(AvatarKeys.GIRL_06, 'characters/girl-06.png', {frameWidth: 64, frameHeight: 64})
    this.load.spritesheet(AvatarKeys.GIRL_07, 'characters/girl-07.png', {frameWidth: 64, frameHeight: 64})

    // NPC
    this.load.spritesheet(NpcKeys.COBRA, 'characters/npc/cobra-finder.png', { frameWidth: 64, frameHeight: 64 })

    // Fonts
    this.load.bitmapFont(FontKeys.DESYREL, 'fonts/bitmap/desyrel.png', 'fonts/bitmap/desyrel.xml')
    this.load.bitmapFont(FontKeys.GEM, 'fonts/bitmap/gem.png', 'fonts/bitmap/gem.xml')
    this.load.bitmapFont(FontKeys.GOTHIC, 'fonts/bitmap/gothic.png', 'fonts/bitmap/gothic.xml')

    // Effects
    this.load.image(TextureKeys.Blood, 'effects/blood.png')
    this.load.image(TextureKeys.VisionMask, 'effects/bitmap-mask.png')
    this.load.spritesheet(TextureKeys.Rain, 'effects/raindrops.png', {frameWidth: 32, frameHeight: 32})
  }

  create() {
    this.scene.launch(SceneKeys.Game);
    this.scene.bringToTop(SceneKeys.Bootstrap);

    autorun(() => {
      if (gameState.connectingToServer === false) {
        this.scene.stop(SceneKeys.Bootstrap);
        this.scene.stop(SceneKeys.Preloader);
      }
    })
  }
}
