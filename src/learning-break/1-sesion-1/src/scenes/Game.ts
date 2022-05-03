import Phaser from "phaser";

// Keys
import { SceneKeys, TilemapKeys } from "../consts/";

// Characters
import Player from '../characters/Player';

export default class GameScene extends Phaser.Scene {
  // Game tilemap
  private tilemap!: Phaser.Tilemaps.Tilemap;
  
  // Player
  private player!: Player;

  constructor() {
    super({ key: SceneKeys.Game });
  }

  create(): void {
    this.createTilemap();
    this.createPlayer();
  }

  private createTilemap(): void {
    this.tilemap = this.add.tilemap(TilemapKeys.DungeonTilemap);
    const tilesetGrass = this.tilemap.addTilesetImage("TX Tileset Grass", TilemapKeys.GrassTiles, 32, 32, 0, 0);
    const tilesetWalls = this.tilemap.addTilesetImage("TX Tileset Wall", TilemapKeys.WallTiles, 32, 32, 0, 0);

    this.tilemap.createLayer('Ground', tilesetGrass);
    this.tilemap.createLayer('Walls', tilesetWalls);
  }

  private createPlayer(): void {
    this.player = new Player(this, 400, 300);
  }
}
