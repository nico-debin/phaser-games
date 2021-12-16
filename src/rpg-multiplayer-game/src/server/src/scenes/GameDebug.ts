import Phaser from 'phaser'

import { socketIoServerMock } from '../debug/SocketIoServerMock'

import SceneKeys from '../consts/SceneKeys'
import SocketIOEventKeys from '../consts/SocketIOEventKeys'
import NetworkEventKeys from '../consts/NetworkEventKeys'

import Game from './Game'
import { MovementInput } from '../types/playerTypes'

export default class GameDebug extends Phaser.Scene {
  private gameScene!: Game
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private lastMovementInput!: MovementInput

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
    const players = this.gameScene.players.getChildren()
    if (players.length > 0) {
      this.gameScene.cameras.main.startFollow(
        players[0],
        true,
      )
    }

    const tilesetIslandBeach = this.gameScene.mapIsland.getTileset(
      'tf_beach_tileB',
    )
    const tilesetIslandShoreline = this.gameScene.mapIsland.getTileset(
      'tf_beach_tileA1',
    )

    // Load Ocean and Vegetation Top layers
    this.gameScene.mapIsland
      .createLayer('Ocean', tilesetIslandShoreline)
      .setDepth(-10)
    this.gameScene.mapIsland
      .createLayer('Island 1/Vegetation top', tilesetIslandBeach)
      .setDepth(10)

    this.lastMovementInput = {
      left: false,
      right: false,
      up: false,
      down: false,
    }
  }

  update(t: number, dt: number) {
    // Capture last movement to compare what changed
    const { left, right, up, down } = this.lastMovementInput

    if (this.cursors.left.isDown) {
      this.lastMovementInput.left = true
      // this.gameScene.cameras.main.y += 4
    } else if (this.cursors.right.isDown) {
      this.lastMovementInput.right = true
      // this.gameScene.cameras.main.y -= 4
    } else {
      this.lastMovementInput.left = false
      this.lastMovementInput.right = false
    }

    if (this.cursors.up.isDown) {
      this.lastMovementInput.up = true
      // this.gameScene.cameras.main.x += 4
    } else if (this.cursors.down.isDown) {
      this.lastMovementInput.down = true
      // this.gameScene.cameras.main.x -= 4
    } else {
      this.lastMovementInput.up = false
      this.lastMovementInput.down = false
    }

    if (this.cursors.space.isDown) {
      debugger
    }

    if (
      left !== this.lastMovementInput.left ||
      right !== this.lastMovementInput.right ||
      up !== this.lastMovementInput.up ||
      down !== this.lastMovementInput.down
    ) {
      socketIoServerMock.emit(NetworkEventKeys.PlayersInput, this.lastMovementInput)

      // this.currentPlayer.update(this.lastMovementInput)
    }
  }
}
