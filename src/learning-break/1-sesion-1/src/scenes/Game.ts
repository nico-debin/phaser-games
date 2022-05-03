import Phaser from "phaser";
import { SceneKeys, TilemapKeys } from "../consts/";

export default class GameScene extends Phaser.Scene {
  // Game tilemap
  private tilemap!: Phaser.Tilemaps.Tilemap;

  constructor() {
    super({ key: SceneKeys.Game });
  }

  create(): void {
    this.createTilemap();
  }

  private createTilemap(): void {
    this.tilemap = this.add.tilemap(TilemapKeys.DungeonTilemap);
    const tilesetGrass = this.tilemap.addTilesetImage("TX Tileset Grass", TilemapKeys.GrassTiles, 32, 32, 0, 0);
    const tilesetWalls = this.tilemap.addTilesetImage("TX Tileset Wall", TilemapKeys.WallTiles, 32, 32, 0, 0);

    this.tilemap.createLayer('Ground', tilesetGrass);
    this.tilemap.createLayer('Walls', tilesetWalls);
  }
}
