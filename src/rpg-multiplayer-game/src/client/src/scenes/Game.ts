import Phaser from 'phaser'
import { io, Socket } from 'socket.io-client'

import {
  MovementInput,
  PlayerId,
  PlayersStates,
  PlayerState,
} from '../types/playerTypes'

import NetworkEventKeys from '../consts/NetworkEventKeys'
import SceneKeys from '../consts/SceneKeys'

import { createCharacterAnims, createLizardAnims } from '../anims'

import Player from '../characters/Player'
import Fauna from '../characters/Fauna'
import Lizard from '../characters/Lizard'

export default class Game extends Phaser.Scene {
  players!: Phaser.GameObjects.Group
  currentPlayer!: Player

  private socket!: Socket
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private lastMovementInput!: MovementInput

  constructor() {
    super(SceneKeys.Game)
  }

  get currentPlayerId() {
    return this.socket.id
  }

  create() {

    // Socket to communicate with the server
    this.socket = io()

    // Players will be stored in this group
    this.players = this.add.group({
      classType: Player,
    })

    // Create animations
    createCharacterAnims(this.anims)
    createLizardAnims(this.anims)

    // Create tilemap and layers
    const mapIsland = this.make.tilemap({
      key: 'islands',
    })

    const tilesetIslandBeach = mapIsland.addTilesetImage('tf_beach_tileB', 'tiles-islands-beach', 32, 32, 0, 0)
    const tilesetIslandShoreline = mapIsland.addTilesetImage('tf_beach_tileA1', 'tiles-islands-shoreline', 32, 32, 0, 0)

    mapIsland.createLayer('Ocean', [tilesetIslandShoreline])
    mapIsland.createLayer('Island 1/Island', [tilesetIslandBeach, tilesetIslandShoreline])
    mapIsland.createLayer('Island 1/Paths', [tilesetIslandBeach])
    mapIsland.createLayer('Island 1/Vegetation bottom', tilesetIslandBeach)
    mapIsland.createLayer('Island 1/Vegetation top', tilesetIslandBeach).setDepth(10)

    // Camara limited to the map
    this.cameras.main.setBounds(0, 0, mapIsland.widthInPixels, mapIsland.heightInPixels);

    const gameScene: Game = this

    // All players in the game - used when joining a game that already has players
    this.socket.on(NetworkEventKeys.PlayersInitialStatusInfo, function (
      playersStates: PlayersStates,
    ) {
      Object.keys(playersStates).forEach(function (id) {
        if (playersStates[id].playerId === gameScene.currentPlayerId) {
          displayPlayers(gameScene, playersStates[id])
        } else {
          displayPlayers(gameScene, playersStates[id], false)
        }
      })

      gameScene.cameras.main.startFollow(gameScene.currentPlayer, true)
    })

    // A new player has joined the game
    this.socket.on(NetworkEventKeys.PlayersNew, function (
      playerState: PlayerState,
    ) {
      displayPlayers(gameScene, playerState, false)
    })

    // A player has been disconnected
    this.socket.on(NetworkEventKeys.PlayersLeft, function (playerId: PlayerId) {
      gameScene.players.getChildren().forEach(function (gameObject) {
        const player = gameObject as Player
        if (playerId === player.id) {
          player.destroy()
        }
      })
    })

    // Update players positions
    this.socket.on(NetworkEventKeys.PlayersStatusUpdate, function (
      players: PlayersStates,
    ) {
      Object.keys(players).forEach(function (id) {
        gameScene.players.getChildren().forEach(function (gameObject) {
          const player = gameObject as Player
          if (players[id].playerId === player.id) {
            player.setPosition(players[id].x, players[id].y)
            player.update(players[id].movementInput)
          }
        })
      })
    })

    this.cursors = this.input.keyboard.createCursorKeys()
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
    } else if (this.cursors.right.isDown) {
      this.lastMovementInput.right = true
    } else {
      this.lastMovementInput.left = false
      this.lastMovementInput.right = false
    }

    if (this.cursors.up.isDown) {
      this.lastMovementInput.up = true
    } else if (this.cursors.down.isDown) {
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
      this.socket.emit(NetworkEventKeys.PlayersInput, this.lastMovementInput)

      this.currentPlayer.update(this.lastMovementInput)
    }
  }
}

const displayPlayers = (
  scene: Game,
  playerState: PlayerState,
  isMainPlayer = true,
) => {
  // const player = isMainPlayer
  //   ? new Fauna(scene, playerState.x, playerState.y, playerState.playerId)
  //   : new Lizard(scene, playerState.x, playerState.y, playerState.playerId)
  const player = new Fauna(scene, playerState.x, playerState.y, playerState.playerId)
  // player.setOrigin(0.5, 0.5)

  if (isMainPlayer) {
    scene.currentPlayer = player
  } else {
    player.setTint(0xff0000)
  }

  // DEBUG
  scene.physics.add.existing(player)
  const size = 32
  // This setting works only for Fauna character
  // TODO: handle different characters with different sizes
  player.body.setSize(size * 0.41, size * 0.4, false)
  player.body.setOffset(size * 0.31, size * 0.45)
  console.log(`body player: `, { width: player.body.width, heigth: player.body.height, originX: player.originX, originY: player.originY })

  scene.add.existing(player)

  scene.players.add(player)

}
