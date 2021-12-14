import Phaser from 'phaser'
import { Server } from 'socket.io'

import NetworkEventKeys from '../consts/NetworkEventKeys'
import SceneKeys from '../consts/SceneKeys'
import TextureKeys from '../consts/TextureKeys'

import { MovementInput, PlayerId, PlayersStates, PlayerState } from '../types/playerTypes'

import Player from '../characters/Player'
declare global {
  interface Window {
    io: Server
  }
}

const io = window.io
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
    this.mapIsland = this.make.tilemap({
      key: 'islands',
    })

    this.players = this.physics.add.group({
      classType: Player,
    })

    this.physics.add.collider(this.players, this.players)

    const gameScene: Game = this

    io.on('connection', (socket) => {
      const playerId: PlayerId = socket.id

      console.log(`user ${playerId} connected`)

      // Get player initial location from object layer
      const playersLayer = this.mapIsland.getObjectLayer('Players')
      const playerObj = playersLayer.objects.pop()

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
      socket.broadcast.emit(NetworkEventKeys.PlayersNew, this.playersStates[playerId])

      // Player disconnected handler
      socket.on('disconnect', function () {
        console.log(`user ${playerId} disconnected`)

        // remove player from server
        removePlayer(gameScene, playerId)

        // remove this player from our players object
        delete gameScene.playersStates[playerId]

        // emit a message to all players to remove this player
        io.emit(NetworkEventKeys.PlayersLeft, playerId)
      })

      // Player input handler: when a player moves, update the player data
      socket.on(NetworkEventKeys.PlayersInput, function (inputData) {
        handlePlayerInput(gameScene, playerId, inputData)
      })
    })
  }

  update(t: number, dt: number) {
    this.players.getChildren().forEach((gameObject) => {
      const player = gameObject as Player
      const input = this.playersStates[player.id].movementInput

      player.update(input)

      this.playersStates[player.id].x = player.x
      this.playersStates[player.id].y = player.y
    })

    this.physics.world.wrap(this.players, 5)

    io.emit(NetworkEventKeys.PlayersStatusUpdate, this.playersStates)
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

const handlePlayerInput = (scene: Game, playerId: PlayerId, input: MovementInput) => {
  scene.players.getChildren().forEach((gameObject) => {
    const player = gameObject as Player
    if (playerId === player.id) {
      scene.playersStates[player.id].movementInput = input
    }
  })
}
