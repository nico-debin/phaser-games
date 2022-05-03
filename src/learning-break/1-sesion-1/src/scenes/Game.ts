import Phaser from "phaser";

// Keys
import { SceneKeys, TilemapKeys } from "../consts/";

// Characters
import Player from '../characters/Player';

// Player Input
import { InputController } from "../controllers";

export default class GameScene extends Phaser.Scene {
  // Game tilemap
  private tilemap!: Phaser.Tilemaps.Tilemap;
  
  // Main Player
  private player!: Player;

  // Cursor keys input listener
  private inputController!: InputController;

  constructor() {
    super({ key: SceneKeys.Game });
  }

  create(): void {
    this.createTilemap();

    // Cursor keys input listener
    this.inputController = new InputController(this, "wasd");

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

  update(): void {
    this.player.update(this.inputController);
  }
}
