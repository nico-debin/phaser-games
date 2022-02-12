import Phaser from 'phaser'
import { Server, Socket } from 'socket.io'

import { objectMap, omit } from '../utils'
import settings from '../settings'
import Queue from '../classes/queue'
import { socketIoServerMock } from '../debug/SocketIoServerMock'

import Player from '../characters/Player'
import { noOpAvatar } from '../characters/AvatarSetting'

import NetworkEventKeys from '../consts/NetworkEventKeys'
import SocketIOEventKeys from '../consts/SocketIOEventKeys'
import SceneKeys from '../consts/SceneKeys'

import {
  MovementInput,
  PlayerId,
  PlayerInitialState,
  PlayerSettings,
  PlayersInitialStates,
  PlayersInputQueue,
  PlayersStates,
  PlayerState,
} from '../types/playerTypes'

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

  get playersInitialStates(): PlayersInitialStates {
    // Create an initial states object with current players state
    return objectMap(this.playersStates, (playerState) => {
      return {
        ...omit(playerState, ['movementInput']),
        avatar: this.getPlayerById(playerState.playerId)!.avatarSetting
      }
    })
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

    // Voting Zones
    const votingZonesLayer = this.mapIsland.getObjectLayer('Voting Zones')
    votingZonesLayer.objects.forEach((tiledObject) => {
      const {x, y, height, width, properties } = tiledObject
      const votingValue = properties[0]['value'] as string

      const zone = this.add.zone(x!, y!, width!, height!).setOrigin(0);
      
      this.physics.world.enable(zone);
      this.physics.add.overlap(zone, this.players, (obj1, obj2) => {
        const player = obj2 as Player;
        this.playersStates[player.id].votingZone = votingValue
        player.setVotingZone(zone, () => {
          this.playersStates[player.id].votingZone = undefined
        })
      }, (obj1, obj2) => !(obj2 as Player).isOnVotingZone())
    })

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
  addPlayerFromInitialState(playerInitialState: PlayerInitialState) {
    // Create player object
    const player = this.add.playerFromInitialState(playerInitialState)

    playerInitialState.avatar = player.avatarSetting

    // add player to our players states object
    const playerState: PlayerState = omit({
      ...playerInitialState,

      // initialize movment input
      movementInput: {
        up: false,
        down: false,
        left: false,
        right: false,
      },
    }, ['avatar']) as PlayerState;
    this.playersStates[playerInitialState.playerId] = playerState

    // Start a new input queue for the player
    this.movementInputQueue[playerInitialState.playerId] = new Queue<MovementInput>()

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

  private getPlayerById(playerId: PlayerId): Player | undefined {
    return (this.players.getChildren() as Player[]).find(player => player.id === playerId);
  }

  private handlePlayerMovementInputUpdate() {
    for (const playerId in this.movementInputQueue) {
      const player = this.getPlayerById(playerId);
      const movementInput = this.movementInputQueue[playerId].dequeue()

      if (!player || !movementInput) continue;

      player?.update(movementInput)
    }
  }

  private handlePlayerUpdate() {
    const playersStatesThatChanged: PlayersStates = {}

    this.players.getChildren().forEach((gameObject) => {
      const player = gameObject as Player
      
      let playerHasMoved = this.playersStates[player.id].x != player.x || this.playersStates[player.id].y != player.y

      // Update new player position      
      this.playersStates[player.id].x = player.x
      this.playersStates[player.id].y = player.y

      if (playerHasMoved) {
        playersStatesThatChanged[player.id] = {
          ...this.playersStates[player.id]
        }
      }
    })

    const somePlayerHasMoved = Object.entries(playersStatesThatChanged).length > 0
    if (somePlayerHasMoved) {
      // Emit only player states that has been updated to optimize network usage
      io.emit(NetworkEventKeys.PlayersStatusUpdate, playersStatesThatChanged)
    }
  }
  /*** END: Player handlers ***/

  update(t: number, dt: number) {
    this.handlePlayerMovementInputUpdate()
    this.handlePlayerUpdate()
  }
}

const sendErrorMesage = (socket: Socket, msg: string, broadcast = false) => {
  if (broadcast) {
    socket.broadcast.emit(NetworkEventKeys.ServerError, msg);
  } else {
    socket.emit(NetworkEventKeys.ServerError, msg);
  }
  console.error(msg)
}

/*** START: Socket Handlers ***/
const handleSocketConnect = (socket: Socket, gameScene: Game) => {
  const playerId: PlayerId = socket.id

  console.log(`user ${playerId} connected`)

  // Check for player settings
  const playerSettings = handlePlayerSettings(socket, gameScene, playerId)
  if (!playerSettings) return

  // Get player initial location from object layer
  const playersLayer = gameScene.mapIsland.getObjectLayer('Players')
  const randomPlayerIndex = Phaser.Math.Between(
    0,
    playersLayer.objects.length - 1,
  )
  const playerObj = playersLayer.objects[randomPlayerIndex]

  const newPlayerInitialState: PlayerInitialState = {
    playerId,
    x: playerObj?.x!,
    y: playerObj?.y!,
    avatar: noOpAvatar,
    votingZone: undefined,
    playerSettings
  }

  // add player to server
  gameScene.addPlayerFromInitialState(newPlayerInitialState)

  // send the players object to the new player
  socket.emit(
    NetworkEventKeys.PlayersInitialStatusInfo,
    gameScene.playersInitialStates,
  )

  // update all other players of the new player
  socket.broadcast.emit(
    NetworkEventKeys.PlayersNew,
    gameScene.playersInitialStates[playerId],
  )

  // Player disconnected handler
  socket.on(SocketIOEventKeys.Disconnect, () =>
    handleSocketDisconnect(gameScene, playerId),
  )

  // Player input handler: when a player moves, update the player data
  socket.on(NetworkEventKeys.PlayersInput, (inputData: MovementInput) =>
    gameScene.handlePlayerMovementInput(playerId, inputData),
  )

  socket.on(NetworkEventKeys.PlayerSettingsUpdate, (playerSettings: PlayerSettings) => {
    // Save new settings in players states object
    gameScene.playersStates[playerId].playerSettings = playerSettings

    // Update the rest of the players
    socket.broadcast.emit(
      NetworkEventKeys.PlayerSettingsUpdate,
      playerSettings
    )
  })
}

const handlePlayerSettings = (socket: Socket, gameScene: Game, playerId: PlayerId): PlayerSettings | undefined => {
  let errorMessage = '';

  if (socket.handshake.query.playerSettings) {
    try {
      return JSON.parse(socket.handshake.query.playerSettings as string) as PlayerSettings
    } catch(e) {
      errorMessage = 'Invalid playerSettings'
    }
  } else {
    errorMessage = 'Missing playerSettings'
  }

  if (errorMessage) {
    sendErrorMesage(socket, 'Missing playerSettings')
    socket.disconnect(true)
    handleSocketDisconnect(gameScene, playerId)
    return undefined
  }
}

const handleSocketDisconnect = (gameScene: Game, playerId: PlayerId) => {
  console.log(`user ${playerId} disconnected`)

  // remove player from server
  gameScene.removePlayer(playerId)

  // emit a message to all players to remove this player
  io.emit(NetworkEventKeys.PlayersLeft, playerId)
}
/*** END: Socket Handlers ***/
