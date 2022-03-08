import Phaser from 'phaser'
import { Server, Socket } from 'socket.io'

import { objectMap, omit } from '../utils'
import settings from '../settings'
import Queue from '../classes/queue'
import { socketIoServerMock } from '../debug/SocketIoServerMock'

import { gameFightState } from '../states/GameFightState'

import Player, { FULL_HEALTH, HEALTH_DAMAGE_DECREASE } from '../characters/Player'
import { noOpAvatar } from '../characters/AvatarSetting'
import ThrowableWeapon from '../classes/ThrowableWeapon'

import NetworkEventKeys from '../consts/NetworkEventKeys'
import SocketIOEventKeys from '../consts/SocketIOEventKeys'
import SceneKeys from '../consts/SceneKeys'

import {
  MovementInput,
  PlayerDead,
  PlayerFightAction,
  PlayerHurt,
  PlayerId,
  PlayerInitialState,
  PlayerSettings,
  PlayersInitialStates,
  PlayersInputQueue,
  PlayersStates,
  PlayerState,
  Position,
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

  // Tilemap
  mapIsland!: Phaser.Tilemaps.Tilemap

  // Timed event for fight waiting room
  fightWaitingRoomTimerEvent: Phaser.Time.TimerEvent | undefined;

  // Available throwable weapons for all players
  private throwableWeapons!: Phaser.Physics.Arcade.Group

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
    this.createWeapons()
    this.createSocketHandlers()

    if (settings.debugMode) {
      this.scene.run(SceneKeys.GameDebug)
    }
  }

  private createPlayers() {
    this.players = this.physics.add.group({
      classType: Player,
      createCallback: (gameObject: Phaser.GameObjects.GameObject) => {
        const player = gameObject as Player;
        player.setThrowableWeapon(this.throwableWeapons);
      },
    })
    // this.physics.add.collider(this.players, this.players)
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
      this.mapIsland.createLayer('Island 2/Island', [tilesetIslandBeach, tilesetIslandShoreline]),
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

  private createWeapons() {
    this.throwableWeapons = this.physics.add.group({
      classType: ThrowableWeapon,
    })

    this.physics.add.overlap(this.throwableWeapons, this.players, this.handleThrowableWeaponPlayerOverlap, undefined, this)
  }

  private createSocketHandlers() {
    const gameScene: Game = this
    io.on(SocketIOEventKeys.Connection, (socket: Socket) =>
      handleSocketConnect(socket, gameScene),
    )
  }

  handleThrowableWeaponPlayerOverlap(
    obj1: Phaser.GameObjects.GameObject, // Weapon
    obj2: Phaser.GameObjects.GameObject, // Player
  ) {
    const throwable = obj1 as ThrowableWeapon
    const player = obj2 as Player

    if (player.id === undefined) {
      console.log({ obj1, obj2 })
    }

    // Avoid collisions with the player who thrown the weapon
    if (player.id === throwable.thrownBy) {
      return;
    }

    // Player is dead
    if (this.playersStates[player.id].health <= 0) return;

    // Update health status
    this.playersStates[player.id].health -= HEALTH_DAMAGE_DECREASE

    console.log(`New health: ${this.playersStates[player.id].health}`)

    if (this.playersStates[player.id].health === 0) {
      // Brodcast event to all players indicating that a player died
      const data: PlayerDead = {
        playerId: player.id,
      }
      console.log(`[${NetworkEventKeys.PlayerDead}]: ${player.id}`)
      io.emit(NetworkEventKeys.PlayerDead, data);
    } else {
      // Disable weapon
      throwable.disableBody();

      // Brodcast event to all players indicating that an arrow impacted to a player
      const data: PlayerHurt = {
        playerId: player.id,
        health: this.playersStates[player.id].health,
        damage: HEALTH_DAMAGE_DECREASE,
      }
      io.emit(NetworkEventKeys.PlayerHurt, data);
    }
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

  getPlayerById(playerId: PlayerId): Player | undefined {
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
        // @ts-ignore
        const { playerSettings, ...playerState } = this.playersStates[player.id]
        playersStatesThatChanged[player.id] = playerState;
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

  private getPositionFromObjectLayer(layer: Phaser.Tilemaps.ObjectLayer): Position {
    const randomPlayerIndex = Phaser.Math.Between(
      0,
      layer.objects.length - 1,
    )
    const playerObj = layer.objects[randomPlayerIndex]
    
    return {
      x: playerObj?.x!,
      y: playerObj?.y!,
    }
  }

  getPlayerRandomInitialPosition(): Position {
    const playersLayer = this.mapIsland.getObjectLayer('Players')
    return this.getPositionFromObjectLayer(playersLayer);
  }

  getFighterRandomInitialPosition(): Position {
    const playersLayer = this.mapIsland.getObjectLayer('Island 2/Players')
    return this.getPositionFromObjectLayer(playersLayer);
  }

  // Set a new random position to every player
  resetPlayersPosition(useFightingPosition = false): void {
    this.players.getChildren().forEach((gameObject) => {
      const player = gameObject as Player
      const randomPosition = useFightingPosition ? this.getFighterRandomInitialPosition() : this.getPlayerRandomInitialPosition();
      player.setPosition(randomPosition.x, randomPosition.y).setUserLeftVotingZone()
    })
  }

  // Set full health to all players
  resetPlayersHealth(): void {
    this.players.getChildren().forEach((gameObject) => {
      const player = gameObject as Player
      this.playersStates[player.id].health = FULL_HEALTH;
    })
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

  // Get random position
  const randomPosition = gameScene.getPlayerRandomInitialPosition()

  const newPlayerInitialState: PlayerInitialState = {
    playerId,
    x: randomPosition.x,
    y: randomPosition.y,
    avatar: noOpAvatar,
    votingZone: undefined,
    playerSettings,
    health: FULL_HEALTH,
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

  // Player has updated his settings
  socket.on(NetworkEventKeys.PlayerSettingsUpdate, (playerSettings: PlayerSettings) => {
    // Save new settings in players states object
    // gameScene.playersStates[playerId].playerSettings = playerSettings

    // Update the rest of the players
    socket.broadcast.emit(
      NetworkEventKeys.PlayerSettingsUpdate,
      playerSettings
    )
  })

  // Send player to main island
  socket.on(NetworkEventKeys.PlayerRestartPosition, () => {
    const randomPosition = gameScene.getPlayerRandomInitialPosition()
    const player = gameScene.getPlayerById(playerId)
    if (player) {
      player.setPosition(randomPosition.x, randomPosition.y)
    }
  })

  // Restart game: send all players to main island
  socket.on(NetworkEventKeys.RestartGame, () => {
    gameScene.resetPlayersPosition()
    gameScene.resetPlayersHealth()
    io.emit(NetworkEventKeys.RestartGame)
    gameFightState.fightMode = false;
  })

  socket.on(NetworkEventKeys.PlayerJoinFight, () => {
    console.log('Recieved: ' + NetworkEventKeys.PlayerJoinFight)
    gameFightState.addFighter(playerId);
    if (gameFightState.fightMode === false) {
      gameFightState.fightMode = true;
      console.log('Sending: ' + NetworkEventKeys.StartFightWaitingRoom)
      io.emit(NetworkEventKeys.StartFightWaitingRoom)

      // Start countdown to start the fight if +1 fighters has joined
      const delayTime = 10 * 1000 // TODO: Remove hardcoded value
      gameScene.fightWaitingRoomTimerEvent = gameScene.time.delayedCall(delayTime, () => {
        if (gameFightState.fightersCount >= 2) {
          gameScene.resetPlayersPosition(true)
          console.log('Sending: ' + NetworkEventKeys.StartFight)
          io.emit(NetworkEventKeys.StartFight)

          // DEBUG - REMOVE THIS!
          gameScene.time.delayedCall(delayTime, () => {
            gameScene.resetPlayersPosition()
            console.log('[DEBUG] Sending: ' + NetworkEventKeys.RestartGame)
            io.emit(NetworkEventKeys.RestartGame)
            gameFightState.fightMode = false;
          }, [], this)
        } else {
          // No enough fighters - restart game
          gameScene.resetPlayersPosition()
          console.log('Sending: ' + NetworkEventKeys.RestartGame)
          io.emit(NetworkEventKeys.RestartGame)
          gameFightState.fightMode = false;
        }
      }, [], this);
    } else if (gameFightState.fightersCount === gameScene.players.countActive()) {
      gameScene.fightWaitingRoomTimerEvent?.remove(true);
      gameScene.fightWaitingRoomTimerEvent = undefined;
    }
  });

  socket.on(NetworkEventKeys.PlayerFightAction, () => {
    const player = gameScene.getPlayerById(playerId);
    if (!player) {
      console.error("Couldn't find player with id " + playerId);
      return;
    }

    // Throw an arrow
    player.fight();

    // Broadcast the event to the rest of the players to render the arrow
    const action: PlayerFightAction = {
      playerId,
      x: player.x,
      y: player.y,
      orientation: player.orientation,
    };    
    socket.broadcast.emit(NetworkEventKeys.PlayerFightAction, action);
  });
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
