import { io, Socket } from 'socket.io-client'

import Phaser from 'phaser'
import AnimatedTiles from 'phaser-animated-tiles/dist/AnimatedTiles'

import {
  MovementInput,
  PlayerId,
  PlayersStates,
  PlayerState,
} from '../types/playerTypes'

import FontKeys from '../consts/FontKeys'
import NetworkEventKeys from '../consts/NetworkEventKeys'
import SceneKeys from '../consts/SceneKeys'

import { createCharacterAnims, createLizardAnims } from '../anims'

import Fauna from '../characters/Fauna'
import Lizard from '../characters/Lizard'
import Player from '../characters/Player'
import PlayerFactory from '../characters/PlayerFactory'

export default class Game extends Phaser.Scene {
  // All players in the game
  players!: Phaser.GameObjects.Group

  // Current player from this client
  currentPlayer!: Player


  // SocketIO client
  private socket!: Socket
  // Flag to check if it was previosly connected (to check reconnections)
  private disconnectedFromServer = false

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private lastMovementInput!: MovementInput

  constructor() {
    super(SceneKeys.Game)
  }

  get currentPlayerId() {
    return this.socket.id
  }

  preload() {
    this.load.scenePlugin('animatedTiles', AnimatedTiles, 'animatedTiles', 'animatedTiles');
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
    mapIsland.createLayer('Island 1/Main Island', [tilesetIslandBeach, tilesetIslandShoreline]),
    mapIsland.createLayer('Island 1/Voting Islands', [tilesetIslandBeach, tilesetIslandShoreline]),
    mapIsland.createLayer('Island 1/Paths', [tilesetIslandBeach])
    mapIsland.createLayer('Island 1/Vegetation bottom', tilesetIslandBeach)
    mapIsland.createLayer('Island 1/Vegetation top', tilesetIslandBeach).setDepth(10)

    // Voting Zones
    const votingZonesLayer = mapIsland.getObjectLayer('Voting Zones')
    votingZonesLayer.objects.forEach((tiledObject) => {
        const {x, y, height, width, properties } = tiledObject
        const votingValue = properties[0]['value'] as string

        const rectangle = this.add.rectangle(x!, y!, width, height, 0x9966ff, 0.5).setStrokeStyle(4, 0xefc53f).setOrigin(0);
        this.add.bitmapText(x! + width!/2 , y! + height!/2, FontKeys.DESYREL, votingValue, 64).setOrigin(0.5).setCenterAlign();
    })

    // @ts-ignore
    this.sys.animatedTiles.init(mapIsland);

    // Camara limited to the map
    this.cameras.main.setBounds(0, 0, mapIsland.widthInPixels, mapIsland.heightInPixels);

    const gameScene: Game = this

    // All players in the game - used when joining a game that already has players
    this.socket.on(NetworkEventKeys.PlayersInitialStatusInfo, function (
      playersStates: PlayersStates,
    ) {
      gameScene.handleServerReconnect()

      Object.keys(playersStates).forEach(function (id) {
        const isMainPlayer = playersStates[id].playerId === gameScene.currentPlayerId;
        gameScene.addPlayer(playersStates[id], isMainPlayer)
        // displayPlayers(gameScene, playersStates[id], isMainPlayer)
      })

      gameScene.cameras.main.startFollow(gameScene.currentPlayer, true)
    })

    // A new player has joined the game
    this.socket.on(NetworkEventKeys.PlayersNew, function (
      playerState: PlayerState,
    ) {
      gameScene.addPlayer(playerState, false)
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
            // UNCAUGHT BUG: For some reason I couldn't find yet, the player
            // rendering needs to be moved by 16 pixels in X and Y. 
            // Remove this when the bug is fixed
            const errorOffset = 16;

            player.setPosition(players[id].x + errorOffset, players[id].y + errorOffset)
            player.update(players[id].movementInput)
          }
        })
      })
    })

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

  handleServerReconnect() {
    const isServerReconnect = this.disconnectedFromServer
    if (isServerReconnect) {
      console.log('Reconnecting - Destroying players')
      this.disconnectedFromServer = false
      this.players.clear(true, true)
    }
  }

  addPlayer(playerState: PlayerState, isMainPlayer = true) {
    const player = PlayerFactory.fromPlayerState(this, playerState)

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
  }
}
