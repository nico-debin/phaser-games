import { io, Socket } from 'socket.io-client'
import { autorun } from 'mobx'
import { useStore } from '../../store/useStore'

import Phaser from 'phaser'
import AnimatedTiles from 'phaser-animated-tiles/dist/AnimatedTiles'

import {
  MovementInput,
  PlayerFightAction,
  PlayerId,
  PlayerInitialState,
  PlayerSettings,
  PlayersInitialStates,
  PlayersStates,
  PlayerState,
} from '../types/playerTypes'
import { VotingZone, VotingZoneValue } from '../types/gameObjectsTypes'

import { gameVotingManager } from '../classes/GameVotingManager'
import { gameState } from '../states/GameState'

// Keys
import AvatarKeys from '../consts/AvatarKeys'
import FontKeys from '../consts/FontKeys'
import NetworkEventKeys from '../consts/NetworkEventKeys'
import SceneKeys from '../consts/SceneKeys'

// Animations
import { createCharacterAnims, createLizardAnims, createNpcAnims } from '../anims'

// Characters
import Player from '../characters/Player'
import PlayerFactory from '../characters/PlayerFactory'

// NPC Characters
import Cobra from '../characters/npc/Cobra'
import Hud from './Hud'
import { ThrowableWeaponArrow } from '../classes/ThrowableWeaponArrow'
import AbstractThrowableWeapon from '../classes/AbstractThrowableWeapon'

export default class Game extends Phaser.Scene {
  // All players in the game
  players!: Phaser.GameObjects.Group

  // Current player from this client
  currentPlayer!: Player

  // Available arrows for current player
  private currentPlayerThrowableWeapons!: Phaser.Physics.Arcade.Group
  private restOfPlayersThrowableWeapons!: Phaser.Physics.Arcade.Group

  // Settings selected in the login page
  playerSettings: PlayerSettings;

  // SocketIO client
  private socket!: Socket
  // Flag to check if it was previosly connected (to check reconnections)
  private disconnectedFromServer = false

  // Flag to prevent sending player settings when it was already sent when first connected
  private preventDuplicateInitialSettingsEvent = true

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private lastMovementInput!: MovementInput


  // Voting zones rectangles
  private votingZones: VotingZone[] = []
  private currentVotingZoneValue: VotingZoneValue

  constructor() {
    super(SceneKeys.Game)

    // Login page settings
    const { getState } = useStore
    const { username, avatar: avatarName, isVoter } = getState()
    this.playerSettings = {
      username,
      avatarName: avatarName as AvatarKeys,
      isVoter,
      hidePlayersWhileVoting: true,
    }
  }

  get currentPlayerId() {
    return this.socket.id
  }

  preload() {
    this.load.scenePlugin('animatedTiles', AnimatedTiles, 'animatedTiles', 'animatedTiles');
  }

  init() {
    this.scene.launch(SceneKeys.Hud)
  }

  create() {
    // Socket to communicate with the server
    this.socket = io({
      query: {
        playerSettings: JSON.stringify(this.playerSettings),
      }
    })

    // Players will be stored in this group
    this.players = this.add.group({
      classType: Player,
    })


    // Round pixels to prevent sub-pixel aliasing
    this.cameras.main.setRoundPixels(true)

    // Create animations
    createCharacterAnims(this.anims)
    createLizardAnims(this.anims)
    createNpcAnims(this.anims)

    this.currentPlayerThrowableWeapons = this.physics.add.group({
      classType: ThrowableWeaponArrow,
      maxSize: 5, // TODO: Remove hardcoded value
    })

    this.restOfPlayersThrowableWeapons = this.physics.add.group({
      classType: ThrowableWeaponArrow,
    })

    // Create tilemap and layers
    const mapIsland = this.make.tilemap({
      key: 'islands',
    })

    const tilesetIslandBeach = mapIsland.addTilesetImage('tf_beach_tileB', 'tiles-islands-beach', 32, 32, 0, 0)
    const tilesetIslandShoreline = mapIsland.addTilesetImage('tf_beach_tileA1', 'tiles-islands-shoreline', 32, 32, 0, 0)

    mapIsland.createLayer('Ocean', [tilesetIslandShoreline])
    // Group all tilset layers
    const islandsTilesLayerGroup = this.add.layer([
      mapIsland.createLayer('Island 1/Main Island', [tilesetIslandBeach, tilesetIslandShoreline]),
      mapIsland.createLayer('Island 1/Voting Islands', [tilesetIslandBeach, tilesetIslandShoreline]),
      mapIsland.createLayer('Island 2/Island', [tilesetIslandBeach, tilesetIslandShoreline]),
      mapIsland.createLayer('Island 1/Paths', [tilesetIslandBeach]),
      mapIsland.createLayer('Island 1/Vegetation bottom', tilesetIslandBeach),
    ])
    mapIsland.createLayer('Island 1/Vegetation top', tilesetIslandBeach).setDepth(10)

    // Voting Zones
    const votingZonesLayer = mapIsland.getObjectLayer('Voting Zones')
    votingZonesLayer.objects.forEach((tiledObject) => {
        const {x, y, height, width, properties } = tiledObject
        const votingValue = properties[0]['value'] as string

        const rectangle = this.add.rectangle(x!, y!, width, height, 0x9966ff, 0.5).setStrokeStyle(4, 0xefc53f).setOrigin(0);
        this.add.bitmapText(x! + width!/2 , y! + height!/2, FontKeys.DESYREL, votingValue, 64).setOrigin(0.5).setCenterAlign();

        this.votingZones.push({ value: votingValue, zone: rectangle});
    })

    // Voting Frontier: border that tells if a player is in voting islands or not
    const thresholdsLayer = mapIsland.getObjectLayer('Thresholds')
    const votingFrontier = thresholdsLayer.objects.find((tiledObject) => tiledObject.name === 'Voting Frontier')!
    if (votingFrontier) {
      gameState.votingFrontierY = votingFrontier.y;
    }

    // Cobra NPC
    const playersLayer = mapIsland.getObjectLayer('Players')
    const randomPlayerIndex = Phaser.Math.Between(0, playersLayer.objects.length - 1)
    const playerObj = playersLayer.objects[randomPlayerIndex]
    const cobra = new Cobra(this, playerObj?.x!, playerObj?.y!)
    cobra.setDepth(3)
    this.add.existing(cobra)
    this.physics.add.existing(cobra)
    cobra.body.onCollide = true

    // Enable collision by property on all layers
    islandsTilesLayerGroup.getChildren().forEach((islandTileLayer) => {
      const tilemapLayer = islandTileLayer as Phaser.Tilemaps.TilemapLayer
      tilemapLayer.setCollisionByProperty({ collides: true })
    })

    // Enable collission between Cobra and map tiles
    this.physics.add.collider(cobra, [...islandsTilesLayerGroup.getChildren()])

    // Enable collider between arrows and players
    this.physics.add.overlap([this.currentPlayerThrowableWeapons, this.restOfPlayersThrowableWeapons], this.players, this.handleThrowableWeaponPlayerOverlap, undefined, this)


    // Animated Tiles (like sea water in the shore)
    // @ts-ignore
    this.sys.animatedTiles.init(mapIsland);

    // Camara limited to the map
    this.cameras.main.setBounds(0, 0, mapIsland.widthInPixels, mapIsland.heightInPixels);

    // Create cursor keys and initial movement input
    this.cursors = this.input.keyboard.createCursorKeys()
    this.lastMovementInput = {
      left: false,
      right: false,
      up: false,
      down: false,
    }

    // All players in the game - used when joining a game that already has players (or not)
    this.socket.on(NetworkEventKeys.PlayersInitialStatusInfo, (
      playersInitialStates: PlayersInitialStates,
    ) => {
      this.handleServerReconnect()

      Object.keys(playersInitialStates).forEach((id) => {
        const isMainPlayer = playersInitialStates[id].playerId === this.currentPlayerId;
        this.addPlayer(playersInitialStates[id], isMainPlayer)
      })

      this.cameras.main.startFollow(this.currentPlayer, true)
    })

    // A new player has joined the game
    this.socket.on(NetworkEventKeys.PlayersNew, (
      playerInitialState: PlayerInitialState,
    ) => {
      this.addPlayer(playerInitialState, false)
    })

    // A player has been disconnected
    this.socket.on(NetworkEventKeys.PlayersLeft, (playerId: PlayerId) => {
      this.removePlayer(playerId)
    })

    // Update players positions
    this.socket.on(NetworkEventKeys.PlayersStatusUpdate, (
      newPlayerStates: PlayersStates,
    ) => {
      Object.keys(newPlayerStates).forEach((id) => this.updatePlayerState(newPlayerStates[id]))
    })

    // An error happened in the server
    this.socket.on(NetworkEventKeys.ServerError, (errorMsg: string) => {
      console.error(`Server error: ${errorMsg}`);

      this.add.text(10, 10, `Server error: ${errorMsg}`, {
        fontSize: '16px',
        color: '#ffffff',
        backgroundColor: '#333333'
      })
    });

    // Server offline or internet went down
    this.socket.on(NetworkEventKeys.ServerOffline, () => {
      console.error('Disconnected from server')
      this.disconnectedFromServer = true
      
      // Paint all players in color red
      this.players.setTint(0xff0000)
    })

    // Send an event when the current player changes it's voting setting (or any other setting)
    // Update voting manager accordingly
    autorun(() => {
      if (gameState.currentPlayer !== undefined) {
        if (this.preventDuplicateInitialSettingsEvent) {
          // Prevent sending player settings when it was already sent with NetworkEventKeys.PlayersInitialStatusInfo
          this.preventDuplicateInitialSettingsEvent = false;
        } else {
          const currentPlayerSettings: PlayerSettings = {
            id: gameState.currentPlayer.id,
            username: gameState.currentPlayer.username,
            avatarName: gameState.currentPlayer.avatarName,
            isVoter: gameState.currentPlayer.isVoter,
            hidePlayersWhileVoting: gameState.currentPlayer.hidePlayersWhileVoting,
          }
          this.socket.emit(NetworkEventKeys.PlayerSettingsUpdate, currentPlayerSettings)

          if (gameState.currentPlayer.isVoter) {
            gameVotingManager.addPlayer(gameState.currentPlayer.id)
          } else {
            gameVotingManager.removePlayer(gameState.currentPlayer.id)
            this.updateVotingZoneRender(undefined) // disable voting zone highlight if the player is standing on it
          }
  
          // Trigger a player update to reflect any rendering update
          this.players.getChildren().map((gameObject) => this.handlePlayerVisibilityWhileVoting(gameObject as Player))
        }
      }
    })

    // Prevent player to keep moving by inertia on hard stop
    autorun(() => {
      if (!gameState.playerCanMove) {
        this.hardStopCurrentPlayerMovement()
      }
    })

    // Send respawn event to server
    autorun(() => {
      // Respawn player to main island
      if (gameState.respawnFlagEnabled) {
        gameState.disableRespawnFlag();
        this.socket.emit(NetworkEventKeys.PlayerRestartPosition)
      }

      // RESET GAME
      if (gameState.restartGame) {
        gameState.disableRestartGameFlag();
        this.socket.emit(NetworkEventKeys.RestartGame);
      }
    })

    // Send event to server to join fight
    autorun(() => {
      if (gameState.gameFight.playerWantsToFight) {
        this.socket.emit(NetworkEventKeys.PlayerJoinFight);
      }
    })

    // Another player has updated it's settings
    this.socket.on(NetworkEventKeys.PlayerSettingsUpdate, (playerSettings: PlayerSettings) => {
      if (playerSettings.id) {
        const playerId: PlayerId = playerSettings.id;
        gameState.updatePlayerSettings(playerId, playerSettings)
        playerSettings.isVoter ? gameVotingManager.addPlayer(playerId) : gameVotingManager.removePlayer(playerId)
      } else {
        console.error("Can't update remote player settings without player's id: ", playerSettings)
      }
    })

    this.socket.on(NetworkEventKeys.RestartGame, () => {
      // Stop fight mode
      gameState.gameFight.clear();

      // Close open menus
      const hudScene = this.scene.get(SceneKeys.Hud) as Hud
      hudScene.closeMenus()
    })

    this.socket.on(NetworkEventKeys.StartFightWaitingRoom, () => {
      // Start fight mode
      gameState.gameFight.onWaitingRoom = true;

      // Close open menus
      const hudScene = this.scene.get(SceneKeys.Hud) as Hud
      hudScene.closeMenus()
    })

    this.socket.on(NetworkEventKeys.StartFight, () => {
      // Start fight mode
      gameState.gameFight.fightMode = true;

      // Close open menus
      const hudScene = this.scene.get(SceneKeys.Hud) as Hud
      hudScene.closeMenus()
    })

    this.socket.on(NetworkEventKeys.PlayerFightAction, (action: PlayerFightAction) => {
      // DEBUG: Uncomment line below
      // if (!gameState.gameFight.fightMode) return

      console.log(`[${NetworkEventKeys.PlayerFightAction}]: `, { action })

      const player = this.getPlayerById(action.playerId);
      if (!player) {
        console.error("Couldn't find player with id " + action.playerId);
        return;
      }

      player.fight()
      
    })
  }

  private getPlayerById(playerId: PlayerId): Player | undefined {
    return (this.players.getChildren() as Player[]).find(player => player.id === playerId);
  }

  updatePlayerState(newPlayerState: PlayerState): void {
    const { playerId } = newPlayerState;
    const player = this.getPlayerById(playerId);
    if (!player) return;

    // UNCAUGHT BUG: For some reason I couldn't find yet, the player
    // rendering needs to be moved by 16 pixels in X and Y. 
    // Remove this when the bug is fixed
    const errorOffset = 16;
    const isCurrentPlayer = newPlayerState.playerId === this.currentPlayerId

    player.setPosition(newPlayerState.x + errorOffset, newPlayerState.y + errorOffset)
    player.update(newPlayerState.movementInput)

    if (gameState.getPlayer(player.id)?.isVoter) {
      gameVotingManager.setVote(player.id, newPlayerState.votingZone)

      if (isCurrentPlayer) {
        this.updateVotingZoneRender(newPlayerState.votingZone)
      }
    }

    this.handlePlayerVisibilityWhileVoting(player)
  }

  handlePlayerVisibilityWhileVoting(player: Player): void {
    const isCurrentPlayer = player.id === this.currentPlayerId
    if (!isCurrentPlayer && gameState.votingFrontierY) {
      const playerIsVoting = player.y < gameState.votingFrontierY
      const isHidden = gameState.hidePlayersWhileVoting && playerIsVoting
      player.setVisible(!isHidden)
    }
  }

  handleThrowableWeaponPlayerOverlap(
    obj1: Phaser.GameObjects.GameObject, // Weapon
    obj2: Phaser.GameObjects.GameObject, // Player
  ) {
    const player = obj1 as Player
    const throwable = obj2 as AbstractThrowableWeapon

    // Avoid collisions with the player who thrown the weapon
    if (player.id === throwable.thrownBy) return;

    throwable.disableBody();
    throwable.setVisible(false);
  }

  update(t: number, dt: number) {
    this.handleMovementInput()
    this.handleFightInput()
  }

  private handleMovementInput(): void {
    if (!gameState.playerCanMove) return

    const newMovementInput: MovementInput = { ...this.lastMovementInput }

    if (this.cursors.left.isDown) {
      newMovementInput.left = true
    } else if (this.cursors.right.isDown) {
      newMovementInput.right = true
    } else {
      newMovementInput.left = false
      newMovementInput.right = false
    }

    if (this.cursors.up.isDown) {
      newMovementInput.up = true
    } else if (this.cursors.down.isDown) {
      newMovementInput.down = true
    } else {
      newMovementInput.up = false
      newMovementInput.down = false
    }

    this.updateLastMovementInput(newMovementInput)
  }

  private updateLastMovementInput(movementInput: MovementInput): void {
    // Capture last movement to compare what changed
    const { left, right, up, down } = this.lastMovementInput
    if (
      left !== movementInput.left ||
      right !== movementInput.right ||
      up !== movementInput.up ||
      down !== movementInput.down
    ) {
      this.lastMovementInput = movementInput
      this.socket.emit(NetworkEventKeys.PlayersInput, this.lastMovementInput)

      this.currentPlayer.update(this.lastMovementInput)
    }
  }

  private handleFightInput(): void {
    // DEBUG: Uncomment line below
    // if (!gameState.gameFight.fightMode) return

    if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
      this.socket.emit(NetworkEventKeys.PlayerFightAction)
      this.currentPlayer.fight();
    }
  }

  hardStopCurrentPlayerMovement() {
    this.updateLastMovementInput({
      left: false,
      right: false,
      up: false,
      down: false,
    })
  }

  updateVotingZoneRender(newVotingZoneValue: VotingZoneValue) {
    const getVotingZone = (value: VotingZoneValue) => this.votingZones.find((votingZone) => votingZone.value === value)
    if (this.currentVotingZoneValue === undefined) {
      if (newVotingZoneValue) {
        this.currentVotingZoneValue = newVotingZoneValue
        const votingZone = getVotingZone(newVotingZoneValue)
        votingZone?.zone.setFillStyle(0x9966ff, 0.8)
      }
    } else {
      if (newVotingZoneValue === undefined) {
        const votingZone = getVotingZone(this.currentVotingZoneValue)
        this.currentVotingZoneValue = undefined
        votingZone?.zone.setFillStyle(0x9966ff, 0.5)
      }
    }
  }

  handleServerReconnect() {
    const isServerReconnect = this.disconnectedFromServer
    if (isServerReconnect) {
      console.log('Reconnecting - Destroying players')
      this.disconnectedFromServer = false
      this.players.clear(true, true)
    }
  }

  addPlayer(playerInitialState: PlayerInitialState, isMainPlayer = true) {
    const player = PlayerFactory.fromPlayerInitialState(this, playerInitialState)

    player.setDepth(5)

    if (isMainPlayer) {
      this.currentPlayer = player
      this.currentPlayer.setThrowableWeapon(this.currentPlayerThrowableWeapons);
    } else {
      player.setThrowableWeapon(this.restOfPlayersThrowableWeapons);
    }
    
    // Add player to physics engine
    this.physics.add.existing(player)
    const avatarSetting = playerInitialState.avatar
    const { sizeFactor } = avatarSetting.body

    // Set player's shape in physics engine
    const playerBody = player.body as Phaser.Physics.Arcade.Body
    playerBody.setSize(
      sizeFactor * avatarSetting.body.size.width,
      sizeFactor * avatarSetting.body.size.height,
      avatarSetting.body.size.center,
    )
    playerBody.setOffset(
      sizeFactor * avatarSetting.body.offset.x,
      sizeFactor * avatarSetting.body.offset.y,
    )

    // Add player to scene
    this.add.existing(player)

    // Add player to players group
    this.players.add(player)

    if (playerInitialState.playerSettings.isVoter) {
      gameVotingManager.addPlayer(player.id, playerInitialState.votingZone)
    }
    gameState.addPlayer(player.id, playerInitialState.playerSettings, isMainPlayer)

    // Hide the player if it's on voting islands
    this.handlePlayerVisibilityWhileVoting(player)
  }

  removePlayer(playerId: PlayerId) {
    const player = this.getPlayerById(playerId);
    if (player) {
      player.destroy()
      gameVotingManager.removePlayer(playerId)
      gameState.removePlayer(playerId)
    }
  }
}
