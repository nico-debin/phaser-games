import Phaser from 'phaser';

import SceneKeys from '../consts/SceneKeys';
import { MapConfig, mapsConfig, TilesetConfig } from '../mapsConfig';

export default class Preloader extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Preloader);
  }

  preload() {
    // Tilemaps
    mapsConfig.forEach((mapConfig: MapConfig) => {
      // Load tileset images
      mapConfig.tilesets.forEach((tilesetConfig: TilesetConfig) => {
        this.load.image(tilesetConfig.key, tilesetConfig.file);
      });

      // Load tilemap json file
      this.load.tilemapTiledJSON(mapConfig.name, mapConfig.tilemapFile);
    });
  }

  create() {
    this.scene.start(SceneKeys.Game);
  }
}
