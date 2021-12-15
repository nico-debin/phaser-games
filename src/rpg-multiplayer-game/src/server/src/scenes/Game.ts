import Phaser from 'phaser'
import { Server } from 'socket.io'

import settings from '~/settings'

import NetworkEventKeys from '../consts/NetworkEventKeys'
import SceneKeys from '../consts/SceneKeys'
import TextureKeys from '../consts/TextureKeys'

import {
  MovementInput,
  PlayerId,
  PlayersStates,
  PlayerState,
} from '../types/playerTypes'

import Player from '../characters/Player'
import SocketIOEventKeys from '~/consts/SocketIOEventKeys'
declare global {
  interface Window {
    io: Server
  }
}

const io = window.io || { on: () => {} }
export default class Game extends Phaser.Scene {
  // Phaser representation of the players
  players!: Phaser.Physics.Arcade.Group

  // State representation of the players, used to update client
  playersStates: PlayersStates = {}

  mapIsland!: Phaser.Tilemaps.Tilemap

  constructor() {
    super(SceneKeys.Game)
  }

  create() {
    this.createPlayers()
    this.createTilesets()
    this.createSocketHandlers()
  }

  private createPlayers() {
    this.players = this.physics.add.group({
      classType: Player,
    })
    this.physics.add.collider(this.players, this.players)
  }

  private createTilesets() {
    this.mapIsland = this.make.tilemap({
      key: 'islands',
    })

    // Tilset are created in the server to handle collisions
    const tilesetIslandBeach = this.mapIsland.addTilesetImage(
      'tf_beach_tileB',
      'tiles-islands-beach',
      32,
      32,
      0,
      0,
    )
    const tilesetIslandShoreline = this.mapIsland.addTilesetImage(
      'tf_beach_tileA1',
      'tiles-islands-shoreline',
      32,
      32,
      0,
      0,
    )

    const islandLayer = this.mapIsland.createLayer('Island 1/Island', [
      tilesetIslandBeach,
      tilesetIslandShoreline,
    ])
    const pathsLayer = this.mapIsland.createLayer('Island 1/Paths', [
      tilesetIslandBeach,
    ])
    const vegetationBottomLayer = this.mapIsland.createLayer(
      'Island 1/Vegetation bottom',
      tilesetIslandBeach,
    )

    // Tileset colliders
    islandLayer.setCollisionByProperty({ collides: true })
    pathsLayer.setCollisionByProperty({ collides: true })
    vegetationBottomLayer.setCollisionByProperty({ collides: true })

    // Collide players with tiles
    this.physics.add.collider(this.players, [
      islandLayer,
      pathsLayer,
      vegetationBottomLayer,
    ])
  }

  private createSocketHandlers() {
    const gameScene: Game = this

    io.on(SocketIOEventKeys.Connection, (socket) => {
      const playerId: PlayerId = socket.id

      console.log(`user ${playerId} connected`)

      // Get player initial location from object layer
      const playersLayer = this.mapIsland.getObjectLayer('Players')
      const randomPlayerIndex = Phaser.Math.Between(
        0,
        playersLayer.objects.length - 1,
      )
      const playerObj = playersLayer.objects[randomPlayerIndex]

      // create a new player and add it to our players object
      this.playersStates[playerId] = {
        playerId,
        x: playerObj?.x!,
        y: playerObj?.y!,
        movementInput: {
          left: false,
          right: false,
          up: false,
          down: false,
        },
      }

      // add player to server
      addPlayer(this, this.playersStates[playerId])

      // send the players object to the new player
      socket.emit(NetworkEventKeys.PlayersInitialStatusInfo, this.playersStates)

      // update all other players of the new player
      socket.broadcast.emit(
        NetworkEventKeys.PlayersNew,
        this.playersStates[playerId],
      )

      // Player disconnected handler
      socket.on(SocketIOEventKeys.Disconnect, () => handleSocketDisconnect(gameScene, playerId))

      // Player input handler: when a player moves, update the player data
      socket.on(NetworkEventKeys.PlayersInput, function (
        inputData: MovementInput,
      ) {
        handlePlayerInput(gameScene, playerId, inputData)
      })
    })
  }

  update(t: number, dt: number) {
    let playerHasMoved = false
    this.players.getChildren().forEach((gameObject) => {
      const player = gameObject as Player
      const input = this.playersStates[player.id].movementInput

      player.update(input)

      if (!playerHasMoved) {
        playerHasMoved =
          this.playersStates[player.id].x != player.x ||
          this.playersStates[player.id].y != player.y
      }

      this.playersStates[player.id].x = player.x
      this.playersStates[player.id].y = player.y
    })

    if (playerHasMoved) {
      io.emit(NetworkEventKeys.PlayersStatusUpdate, this.playersStates)
    }
  }
}

const addPlayer = (scene: Game, playerState: PlayerState) => {
  const player = new Player(
    scene,
    playerState.x,
    playerState.y,
    TextureKeys.Ship,
    playerState.playerId,
  )
    .setOrigin(0.5, 0.5)
    .setDisplaySize(53, 40)
  scene.physics.add.existing(player)

  scene.players.add(player)
}

const removePlayer = (scene: Game, playerId: PlayerId) => {
  scene.players.getChildren().forEach((gameObject) => {
    const player = gameObject as Player
    if (playerId === player.id) {
      player.destroy()
    }
  })
}

const handlePlayerInput = (
  scene: Game,
  playerId: PlayerId,
  input: MovementInput,
) => {
  scene.players.getChildren().forEach((gameObject) => {
    const player = gameObject as Player
    if (playerId === player.id) {
      scene.playersStates[player.id].movementInput = input
    }
  })
}

/*** Socket Handlers ***/
const handleSocketDisconnect = (gameScene: Game, playerId: PlayerId) => {
  console.log(`user ${playerId} disconnected`)

  // remove player from server
  removePlayer(gameScene, playerId)

  // remove this player from our players object
  delete gameScene.playersStates[playerId]

  // emit a message to all players to remove this player
  io.emit(NetworkEventKeys.PlayersLeft, playerId)
}
