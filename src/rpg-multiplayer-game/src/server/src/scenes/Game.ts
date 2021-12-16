import Phaser from 'phaser'
import { Server, Socket } from 'socket.io'

import settings from '../settings'
import { socketIoServerMock } from '../debug/SocketIoServerMock'

import NetworkEventKeys from '../consts/NetworkEventKeys'
import SocketIOEventKeys from '../consts/SocketIOEventKeys'
import SceneKeys from '../consts/SceneKeys'

import {
  MovementInput,
  PlayerId,
  PlayersStates,
  PlayerState,
} from '../types/playerTypes'

import Player, { DEFAULT_SIZE } from '../characters/Player'

declare global {
  interface Window {
    io: Server
  }
}

let io
if (settings.debugMode) {
  io = socketIoServerMock
} else {
  io = window.io || { on: () => {} }
}
export default class Game extends Phaser.Scene {
  // Phaser representation of the players
  players!: Phaser.Physics.Arcade.Group

  // State representation of the players, used to update client
  playersStates: PlayersStates = {}

  mapIsland!: Phaser.Tilemaps.Tilemap

  // For Debugging
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

  constructor() {
    super(SceneKeys.Game)
  }

  create() {
    this.createPlayers()
    this.createTilesets()
    this.createSocketHandlers()

    if (settings.debugMode) {
      // Start new connection
      socketIoServerMock.emit(SocketIOEventKeys.Connection)
    
      this.cursors = this.input.keyboard.createCursorKeys()

      this.cameras.main.setBounds(0, 0, this.mapIsland.widthInPixels, this.mapIsland.heightInPixels);
      this.cameras.main.startFollow(this.players.getChildren().pop()!, true)
    }
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

    if (settings.debugMode) {
      this.mapIsland.createLayer('Ocean', [tilesetIslandShoreline])
    }
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
    if (settings.debugMode) {
      this.mapIsland
        .createLayer('Island 1/Vegetation top', tilesetIslandBeach)
        .setDepth(10)
    }

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
    io.on(SocketIOEventKeys.Connection, (socket: Socket) =>
      handleSocketConnect(socket, gameScene),
    )
  }

  /*** START: Player handlers ***/
  addPlayerFromState(playerState: PlayerState) {
    // add player to our players states object
    this.playersStates[playerState.playerId] = playerState
    
    // Create player object
    const player = new Player(
      this,
      playerState.x,
      playerState.y,
      playerState.playerId,
    )
      // .setOrigin(0.5, 0.5)
      
    // Add player to physics
    this.physics.add.existing(player)
    
    // This setting works only for Fauna character
    // TODO: handle different characters with different sizes
    player.body.setSize(DEFAULT_SIZE.width * 0.41, DEFAULT_SIZE.height * 0.4, false)
    player.body.setOffset(DEFAULT_SIZE.width * 0.31, DEFAULT_SIZE.height * 0.45)
    
    console.log(`body player: `, { width: player.body.width, heigth: player.body.height, originX: player.originX, originY: player.originY })
    

    // Add player to group
    this.players.add(player)
  }

  removePlayer = (playerId: PlayerId) => {
    this.players.getChildren().forEach((gameObject) => {
      const player = gameObject as Player
      if (playerId === player.id) {
        player.destroy()
      }
    })

    // remove this player from our players object
    delete this.playersStates[playerId]
  }

  handlePlayerMovementInput(playerId: PlayerId, input: MovementInput) {
    this.players.getChildren().forEach((gameObject) => {
      const player = gameObject as Player
      if (playerId === player.id) {
        this.playersStates[player.id].movementInput = input
      }
    })
  }

  private handlePlayerMovementUpdate() {
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
  /*** END: Player handlers ***/

  update(t: number, dt: number) {
    this.handlePlayerMovementUpdate()

    if (settings.debugMode) {
      if (this.cursors.up.isDown) {
        this.cameras.main.y += 4
      } else if (this.cursors.down.isDown) {
        this.cameras.main.y -= 4
      }

      if (this.cursors.left.isDown) {
        this.cameras.main.x += 4
      } else if (this.cursors.right.isDown) {
        this.cameras.main.x -= 4
      }

      if (this.cursors.space.isDown) {
        debugger
      }
    }
  }
}

/*** START: Socket Handlers ***/
const handleSocketConnect = (socket: Socket, gameScene: Game) => {
  const playerId: PlayerId = socket.id

  console.log(`user ${playerId} connected`)

  // Get player initial location from object layer
  const playersLayer = gameScene.mapIsland.getObjectLayer('Players')
  const randomPlayerIndex = Phaser.Math.Between(
    0,
    playersLayer.objects.length - 1,
  )
  const playerObj = playersLayer.objects[randomPlayerIndex]

  const newPlayerState: PlayerState = {
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
  gameScene.addPlayerFromState(newPlayerState)

  // send the players object to the new player
  socket.emit(
    NetworkEventKeys.PlayersInitialStatusInfo,
    gameScene.playersStates,
  )

  // update all other players of the new player
  socket.broadcast.emit(
    NetworkEventKeys.PlayersNew,
    gameScene.playersStates[playerId],
  )

  // Player disconnected handler
  socket.on(SocketIOEventKeys.Disconnect, () =>
    handleSocketDisconnect(gameScene, playerId),
  )

  // Player input handler: when a player moves, update the player data
  socket.on(NetworkEventKeys.PlayersInput, (inputData: MovementInput) =>
    gameScene.handlePlayerMovementInput(playerId, inputData),
  )
}

const handleSocketDisconnect = (gameScene: Game, playerId: PlayerId) => {
  console.log(`user ${playerId} disconnected`)

  // remove player from server
  gameScene.removePlayer(playerId)

  // emit a message to all players to remove this player
  io.emit(NetworkEventKeys.PlayersLeft, playerId)
}
/*** END: Socket Handlers ***/
