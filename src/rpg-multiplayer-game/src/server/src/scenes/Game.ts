import Phaser, { GameObjects } from 'phaser'
import { Server, Socket } from 'socket.io'

import settings from '../settings'
import { socketIoServerMock } from '../debug/SocketIoServerMock'

import NetworkEventKeys from '../consts/NetworkEventKeys'
import SocketIOEventKeys from '../consts/SocketIOEventKeys'
import SceneKeys from '../consts/SceneKeys'

import {
  MovementInput,
  PlayerId,
  PlayersInputQueue,
  PlayersStates,
  PlayerState,
} from '../types/playerTypes'

import Player from '../characters/Player'
import { noOpAvatar } from '../characters/AvatarSetting'
import Queue from '../classes/queue'

declare global {
  interface Window {
    io: Server
  }
}

const io = settings.debugMode ? socketIoServerMock : window.io

export default class Game extends Phaser.Scene {
  // Phaser representation of the players
  players!: Phaser.Physics.Arcade.Group

  // State representation of the players, used to update client
  playersStates: PlayersStates = {}

  // Queue to process movement inputs in order
  movementInputQueue: PlayersInputQueue = {};

  mapIsland!: Phaser.Tilemaps.Tilemap

  constructor() {
    super(SceneKeys.Game)
  }

  create() {
    this.createPlayers()
    this.createTilesets()
    this.createSocketHandlers()

    if (settings.debugMode) {
      this.scene.run(SceneKeys.GameDebug)
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
    const islandsLayerGroup = this.add.layer([
      this.mapIsland.createLayer('Island 1/Main Island', [tilesetIslandBeach, tilesetIslandShoreline]),
      this.mapIsland.createLayer('Island 1/Voting Islands', [tilesetIslandBeach, tilesetIslandShoreline]),
    ])
    const pathsLayer = this.mapIsland.createLayer('Island 1/Paths', [
      tilesetIslandBeach,
    ])
    const vegetationBottomLayer = this.mapIsland.createLayer(
      'Island 1/Vegetation bottom',
      tilesetIslandBeach,
    )

    // Tileset colliders
    islandsLayerGroup.getChildren().map((islandLayer) => {
      const tilemapLayer = islandLayer as Phaser.Tilemaps.TilemapLayer
      tilemapLayer.setCollisionByProperty({ collides: true })
    })
    pathsLayer.setCollisionByProperty({ collides: true })
    vegetationBottomLayer.setCollisionByProperty({ collides: true })

    // Collide players with tiles
    this.physics.add.collider(this.players, [
      ...islandsLayerGroup.getChildren(),
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
    // Create player object
    const player = this.add.playerFromState(playerState)
    // .setOrigin(0.5, 0.5)

    playerState.avatar = player.avatarSetting

    // add player to our players states object
    this.playersStates[playerState.playerId] = playerState

    // Start a new input queue for the player
    this.movementInputQueue[playerState.playerId] = new Queue<MovementInput>()


    // Add player to physics
    // this.physics.add.existing(player)

    // const avatarSetting = player.avatarSetting

    // This setting works only for Fauna character
    // TODO: handle different characters with different sizes
    // player.body.setSize(DEFAULT_SIZE.width * 0.41, DEFAULT_SIZE.height * 0.4, false)
    // player.body.setOffset(DEFAULT_SIZE.width * 0.31, DEFAULT_SIZE.height * 0.45)

    // player.body.setSize(avatarSetting.body.sizeFactor * avatarSetting.body.size.width, avatarSetting.body.sizeFactor * avatarSetting.body.size.height, avatarSetting.body.size.center)
    // player.body.setOffset(avatarSetting.body.sizeFactor * avatarSetting.body.offset.width, avatarSetting.body.sizeFactor * avatarSetting.body.offset.height)

    console.log(`body player: `, {
      width: player.body.width,
      heigth: player.body.height,
      originX: player.originX,
      originY: player.originY,
    })

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
    delete this.movementInputQueue[playerId]
  }

  handlePlayerMovementInput(playerId: PlayerId, input: MovementInput) {
    this.players.getChildren().forEach((gameObject) => {
      const player = gameObject as Player
      if (playerId === player.id) {
        this.playersStates[player.id].movementInput = input
        this.movementInputQueue[player.id].enqueue(input)
      }
    })
  }

  private handlePlayerMovementInputUpdate() {
    for (const playerId in this.movementInputQueue) {
      const player = (this.players.getChildren() as Player[]).find(player => player.id === playerId);
      const movementInput = this.movementInputQueue[playerId].dequeue()

      if (!player || !movementInput) continue;

      player?.update(movementInput)
    }
  }

  private handlePlayerUpdate() {
    let somePlayerHasMoved = false
    this.players.getChildren().forEach((gameObject) => {
      const player = gameObject as Player

      if (!somePlayerHasMoved) {
        somePlayerHasMoved =
          this.playersStates[player.id].x != player.x ||
          this.playersStates[player.id].y != player.y
      }

      this.playersStates[player.id].x = player.x
      this.playersStates[player.id].y = player.y
    })

    if (somePlayerHasMoved) {
      io.emit(NetworkEventKeys.PlayersStatusUpdate, this.playersStates)
    }
  }
  /*** END: Player handlers ***/

  update(t: number, dt: number) {
    this.handlePlayerMovementInputUpdate()
    this.handlePlayerUpdate()
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
    avatar: noOpAvatar
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
