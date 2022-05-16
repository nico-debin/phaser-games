import Phaser from "phaser";

// Keys
import { SceneKeys, TilemapKeys } from "../consts/";

// Characters
import Player from '../characters/Player';

// Player Input
import { InputController } from "../controllers";

// Debugging utilities
import { debugDraw } from "../utils/debug";

export default class GameScene extends Phaser.Scene {
  // Game tilemap
  // private tilemap!: Phaser.Tilemaps.Tilemap;
  
  // Main Player
  // private player!: Player;

  // Cursor keys input listener
  // private inputController!: InputController;

  constructor() {
    super({ key: SceneKeys.Game });
  }

  create(): void {
    // Create the map
    // this.createTilemap();

    // Input listener
    // this.inputController = new InputController(this, "wasd");

    // Create the main player
    // this.createPlayer();

    // Follow the player with the camera
    // this.cameras.main.startFollow(this.player);

    // Add colliders between game objects to the physics engine
    // this.setColliders();
  }

  // private createTilemap(): void {
  //   this.tilemap = this.add.tilemap(TilemapKeys.DungeonTilemap);
  //   const tilesetGrass = this.tilemap.addTilesetImage("TX Tileset Grass", TilemapKeys.GrassTiles, 32, 32, 0, 0);
  //   const tilesetWalls = this.tilemap.addTilesetImage("TX Tileset Wall", TilemapKeys.WallTiles, 32, 32, 0, 0);

  //   // this.tilemap.createLayer('Ground', tilesetGrass);
  //   // this.tilemap.createLayer('Walls', tilesetWalls).setCollisionByProperty({ collides: true });
  //   // debugDraw(this.tilemap.getLayer('Walls').tilemapLayer, this);
  // }

  // private createPlayer(): void {
  //   this.player = new Player(this, 400, 300);
  // }

  // private setColliders(): void {
  //   const walls = this.tilemap.getLayer('Walls').tilemapLayer;

  //   // Collide player with walls
  //   this.physics.add.collider(this.player, walls);
  // }

  // update(): void {
  //   this.player.update(this.inputController);
  // }
}
