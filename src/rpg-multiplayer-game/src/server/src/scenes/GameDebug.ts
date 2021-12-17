import Phaser from 'phaser'

import { socketIoServerMock } from '../debug/SocketIoServerMock'

import { MovementInput, PlayerId } from '../types/playerTypes'

import SceneKeys from '../consts/SceneKeys'
import SocketIOEventKeys from '../consts/SocketIOEventKeys'
import NetworkEventKeys from '../consts/NetworkEventKeys'

import Game from './Game'
import Player from '../characters/Player'

type Movement = 'up' | 'down' | 'left' | 'right'
type MovementKeys = {
  [key in Movement]: Phaser.Input.Keyboard.Key
}

export default class GameDebug extends Phaser.Scene {
  private gameScene!: Game
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private lastMovementInput!: MovementInput

  // The id of the selected player to move with the keyboard keys
  private selectedPlayerId!: PlayerId

  // The index of the selected player in gameScene.players.getChildren() array
  private selectedPlayerIndex = 0

  private nKey!: Phaser.Input.Keyboard.Key
  private movementKeys!: MovementKeys

  constructor() {
    super(SceneKeys.GameDebug)
  }

  create() {
    // Save reference to the Game scene
    this.gameScene = this.scene.manager.getScene(SceneKeys.Game) as Game

    this.cursors = this.input.keyboard.createCursorKeys()
    this.nKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N)
    this.movementKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    }) as MovementKeys

    // Start new connection
    socketIoServerMock.emit(SocketIOEventKeys.Connection)

    const displayMessage = [
      'Running server in debug mode',
      'Use W A S D keys to move player',
      'Use N to add new player',
      'Use LEFT and RIGHT keys to switch players'
    ]
    // Show display text
    this.add.text(12, 20, displayMessage.join('\n'), {
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

    // Set first player as selected player
    this.selectPlayerByIndex(0)

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

  /**
   * Set the selected player using the array's index
   */
  private selectPlayerByIndex(playerIndex: number) {
    const players = this.gameScene.players.getChildren() as Player[]

    if (playerIndex in players) {
      const player = this.gameScene.players.getChildren()[playerIndex] as Player

      this.selectedPlayerIndex = playerIndex
      this.selectedPlayerId = player.id

      // Follow new selected player
      this.gameScene.cameras.main.startFollow(player, true)
    } else {
      console.log(`no playerIndex ${playerIndex}`)
    }
  }

  private selectNextPlayer(reverse = false) {
    const players = this.gameScene.players.getChildren() as Player[]
    const incremental = reverse ? -1 : 1
    let nextIndex = this.selectedPlayerIndex + incremental
    
    if (nextIndex == players.length){
      nextIndex = 0
    } else if (nextIndex < 0) {
      nextIndex = players.length - 1
    }

    this.selectPlayerByIndex(nextIndex)
  }

  update(t: number, dt: number) {
    this.handlePlayerMovement()

    // Add new player
    if (Phaser.Input.Keyboard.JustDown(this.nKey)) {
      socketIoServerMock.emit(SocketIOEventKeys.Connection)
    }

    if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
      this.selectNextPlayer(true)
    } else if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
      this.selectNextPlayer()
    }
  }

  private handlePlayerMovement() {
    // Capture last movement to compare what changed
    const { left, right, up, down } = this.lastMovementInput

    if (this.movementKeys.left.isDown) {
      this.lastMovementInput.left = true
    } else if (this.movementKeys.right.isDown) {
      this.lastMovementInput.right = true
    } else {
      this.lastMovementInput.left = false
      this.lastMovementInput.right = false
    }

    if (this.movementKeys.up.isDown) {
      this.lastMovementInput.up = true
    } else if (this.movementKeys.down.isDown) {
      this.lastMovementInput.down = true
    } else {
      this.lastMovementInput.up = false
      this.lastMovementInput.down = false
    }

    if (
      left !== this.lastMovementInput.left ||
      right !== this.lastMovementInput.right ||
      up !== this.lastMovementInput.up ||
      down !== this.lastMovementInput.down
    ) {
      // Send event to selected player's socket
      socketIoServerMock
        .getSocketMock(this.selectedPlayerId)
        .emit(NetworkEventKeys.PlayersInput, this.lastMovementInput)
    }
  }
}
