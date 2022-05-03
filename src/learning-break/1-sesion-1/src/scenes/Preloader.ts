import Phaser from "phaser";
import { SceneKeys, TextureKeys, TilemapKeys } from "../consts";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super({ key: SceneKeys.Preloader });
  }

  preload(): void {
    // this.preloadHelloWorld();
    this.preloadTilemap();
  }
  
  private preloadHelloWorld(): void {
    this.load.image(TextureKeys.LOGO, "./finderlogo.png");
    this.load.image(TextureKeys.SKY, "https://labs.phaser.io/assets/skies/space3.png");
    this.load.image(TextureKeys.RED, "https://labs.phaser.io/assets/particles/red.png");
  }

  private preloadTilemap(): void {
    this.load.image(TilemapKeys.WallTiles, "./tilesets/TX Tileset Wall.png");
    this.load.image(TilemapKeys.GrassTiles, "./tilesets/TX Tileset Grass.png");
    this.load.tilemapTiledJSON(TilemapKeys.DungeonTilemap, "./tilemaps/dungeon-v1.json");
  }

  create(): void {
    this.scene.start(SceneKeys.Game);
  }
}
