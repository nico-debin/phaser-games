import { io, Socket } from 'socket.io-client'
import { useStore } from '../../store/useStore'

import Phaser from 'phaser'
import AnimatedTiles from 'phaser-animated-tiles/dist/AnimatedTiles'

import {
  MovementInput,
  PlayerId,
  PlayerInitialState,
  PlayerSettings,
  PlayersInitialStates,
  PlayersStates,
} from '../types/playerTypes'
import { VotingZone, VotingZoneValue } from '../types/gameObjectsTypes'

import { gameVotingManager } from '../classes/GameVotingManager'

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

export default class Game extends Phaser.Scene {
  // All players in the game
  players!: Phaser.GameObjects.Group

  // Current player from this client
  currentPlayer!: Player

  // Settings selected in the login page
  playerSettings: PlayerSettings;

  // SocketIO client
  private socket!: Socket
  // Flag to check if it was previosly connected (to check reconnections)
  private disconnectedFromServer = false

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private lastMovementInput!: MovementInput


  // Voting zones rectangles
  private votingZones: VotingZone[] = []
  private currentVotingZoneValue: VotingZoneValue

  constructor() {
    super(SceneKeys.Game)

    // Login page settings
    const { getState } = useStore
    const { username, avatar: avatarName } = getState()
    this.playerSettings = {
      username,
      avatarName: avatarName as AvatarKeys,
    }
  }

  get currentPlayerId() {
    return this.socket.id
  }

  preload() {
    this.load.scenePlugin('animatedTiles', AnimatedTiles, 'animatedTiles', 'animatedTiles');
  }

  init() {
    this.scene.launch('hud')
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

    // Create animations
    createCharacterAnims(this.anims)
    createLizardAnims(this.anims)
    createNpcAnims(this.anims)

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


    // Animated Tiles (like sea water in the shore)
    // @ts-ignore
    this.sys.animatedTiles.init(mapIsland);

    // Camara limited to the map
    this.cameras.main.setBounds(0, 0, mapIsland.widthInPixels, mapIsland.heightInPixels);

    const gameScene: Game = this

    // All players in the game - used when joining a game that already has players (or not)
    this.socket.on(NetworkEventKeys.PlayersInitialStatusInfo, function (
      playersInitialStates: PlayersInitialStates,
    ) {
      gameScene.handleServerReconnect()

      Object.keys(playersInitialStates).forEach(function (id) {
        const isMainPlayer = playersInitialStates[id].playerId === gameScene.currentPlayerId;
        gameScene.addPlayer(playersInitialStates[id], isMainPlayer)
        // displayPlayers(gameScene, playersStates[id], isMainPlayer)
      })

      gameScene.cameras.main.startFollow(gameScene.currentPlayer, true)
    })

    // A new player has joined the game
    this.socket.on(NetworkEventKeys.PlayersNew, function (
      playerInitialState: PlayerInitialState,
    ) {
      gameScene.addPlayer(playerInitialState, false)
    })

    // A player has been disconnected
    this.socket.on(NetworkEventKeys.PlayersLeft, function (playerId: PlayerId) {
      gameScene.players.getChildren().forEach(function (gameObject) {
        const player = gameObject as Player
        if (playerId === player.id) {
          player.destroy()
          gameVotingManager.removePlayer(playerId)
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
            // UNCAUGHT BUG: For some reason I couldn't find yet, the player
            // rendering needs to be moved by 16 pixels in X and Y. 
            // Remove this when the bug is fixed
            const errorOffset = 16;

            player.setPosition(players[id].x + errorOffset, players[id].y + errorOffset)
            player.update(players[id].movementInput)
            gameVotingManager.setVote(player.id, players[id].votingZone)
          }
          
          // if (players[id].votingZone) {
          // }
          // if (players[id].playerId === gameScene.currentPlayerId) {
          //   gameScene.updateVotingZoneRender(players[id].votingZone)
          //   playerVotingState.setVote(players[id].votingZone)
          // }
        })
      })
    })

    this.socket.on(NetworkEventKeys.ServerError, (errorMsg: string) => {
      console.error(`Server error: ${errorMsg}`);

      this.add.text(10, 10, `Server error: ${errorMsg}`, {
        fontSize: '16px',
        color: '#ffffff',
        backgroundColor: '#333333'
      })
    });

    this.socket.on('disconnect', () => {
      console.error('Disconnected from server')
      this.disconnectedFromServer = true
      
      // Paint all players in color red
      this.players.setTint(0xff0000)
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
    } else {
      // const randomTint = Math.random() * 0xffffff
      // player.setTint(randomTint)
    }

    /******************** DEBUG ********************/
    // scene.physics.add.existing(player)
  
    // const avatarSetting = playerState.avatar
    // const { sizeFactor } = avatarSetting.body
  
    // const playerBody = player.body as Phaser.Physics.Arcade.Body
    // playerBody.setSize(
    //   sizeFactor * avatarSetting.body.size.width,
    //   sizeFactor * avatarSetting.body.size.height,
    //   avatarSetting.body.size.center,
    // )
    // playerBody.setOffset(
    //   sizeFactor * avatarSetting.body.offset.x,
    //   sizeFactor * avatarSetting.body.offset.y,
    // )
    // console.log(`body player: `, { width: playerBody.width, heigth: playerBody.height, originX: player.originX, originY: player.originY })
    /****************** END DEBUG ******************/

    this.add.existing(player)
    this.players.add(player)

    gameVotingManager.addPlayer(player.id)
  }
}
