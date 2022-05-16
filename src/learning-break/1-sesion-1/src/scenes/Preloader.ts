import Phaser from "phaser";
import { SceneKeys, TilemapKeys, AvatarKeys } from "../consts";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super({ key: SceneKeys.Preloader });
  }

  preload(): void {
    this.preloadTilemap();
    this.preloadCharacters();
  }

  private preloadTilemap(): void {
    this.load.image(TilemapKeys.WallTiles, "./tilesets/TX Tileset Wall.png");
    this.load.image(TilemapKeys.GrassTiles, "./tilesets/TX Tileset Grass.png");
    this.load.tilemapTiledJSON(TilemapKeys.DungeonTilemap, "./tilemaps/dungeon-v1.json");
  }

  private preloadCharacters(): void {
    this.load.spritesheet(AvatarKeys.WARRIOR, "./characters/warrior-01.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  create(): void {
    this.scene.start(SceneKeys.Game);
  }
}
