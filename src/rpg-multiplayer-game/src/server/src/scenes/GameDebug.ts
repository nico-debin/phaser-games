import Phaser from 'phaser'

import { socketIoServerMock } from '../debug/SocketIoServerMock'

import SceneKeys from '../consts/SceneKeys'
import SocketIOEventKeys from '../consts/SocketIOEventKeys'

import Game from './Game'

export default class GameDebug extends Phaser.Scene {
  private gameScene!: Game
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

  constructor() {
    super(SceneKeys.GameDebug)
  }

  create() {
    // Save reference to the Game scene
    this.gameScene = this.scene.manager.getScene(SceneKeys.Game) as Game

    this.cursors = this.input.keyboard.createCursorKeys()

    // Start new connection
    socketIoServerMock.emit(SocketIOEventKeys.Connection)

    // Show display text
    this.add.text(12, 20, 'Running server in debug mode', {
      // @ts-ignore
      fontSize: 20,
    })

    // Camera bounded to world limits
    this.gameScene.cameras.main.setBounds(
      0,
      0,
      this.gameScene.mapIsland.widthInPixels,
      this.gameScene.mapIsland.heightInPixels,
    )

    // Follow the player
    this.gameScene.cameras.main.startFollow(
      this.gameScene.players.getChildren().pop()!,
      true,
    )

    const tilesetIslandBeach = this.gameScene.mapIsland.getTileset(
      'tf_beach_tileB',
    )
    const tilesetIslandShoreline = this.gameScene.mapIsland.getTileset(
      'tf_beach_tileA1',
    )

    this.gameScene.mapIsland
      .createLayer('Ocean', tilesetIslandShoreline)
      .setDepth(-10)
    this.gameScene.mapIsland
      .createLayer('Island 1/Vegetation top', tilesetIslandBeach)
      .setDepth(10)
  }

  update(t: number, dt: number) {
    if (this.cursors.up.isDown) {
      this.gameScene.cameras.main.y += 4
    } else if (this.cursors.down.isDown) {
      this.gameScene.cameras.main.y -= 4
    }

    if (this.cursors.left.isDown) {
      this.gameScene.cameras.main.x += 4
    } else if (this.cursors.right.isDown) {
      this.gameScene.cameras.main.x -= 4
    }

    if (this.cursors.space.isDown) {
      debugger
    }
  }
}
