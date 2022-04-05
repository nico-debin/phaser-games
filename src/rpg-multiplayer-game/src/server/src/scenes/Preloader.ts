import Phaser from 'phaser';

import SceneKeys from '../consts/SceneKeys';
import TextureKeys from '../consts/TextureKeys';

export default class Preloader extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Preloader);
  }

  preload() {
    this.load.image('tiles-islands-beach', 'tiles/tf_beach_tileB.png');
    this.load.image('tiles-islands-shoreline', 'tiles/tf_beach_tileA1.png');
    this.load.tilemapTiledJSON('islands', 'tilemaps/islands-01.json');
  }

  create() {
    this.scene.start(SceneKeys.Game);
  }
}
