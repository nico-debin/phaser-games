import Phaser from 'phaser'
import { io, Socket } from 'socket.io-client'

import Player, { PlayerId } from '../characters/Player'

interface PlayerState {
  rotation: number
  x: number
  y: number
  playerId: PlayerId
  team: 'red' | 'blue'
  input: {
    left: boolean
    right: boolean
    up: boolean
  }
}

interface PlayersStates {
  [playerId: string]: PlayerState
}

export default class Game extends Phaser.Scene {
  players!: Phaser.GameObjects.Group

  private socket!: Socket
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private leftKeyPressed!: boolean
  private rightKeyPressed!: boolean
  private upKeyPressed!: boolean

  constructor() {
    super('game')
  }

  get currentPlayerId() {
    return this.socket.id
  }

  create() {
    this.socket = io()
    this.players = this.add.group({
      classType: Player,
    })

    const gameScene: Game = this
    
    // All players in the game - used when joining a game that already has players
    this.socket.on('currentPlayers', function (playersStates: PlayersStates) {      
      Object.keys(playersStates).forEach(function (id) {
        if (playersStates[id].playerId === gameScene.currentPlayerId) {
          displayPlayers(gameScene, playersStates[id], 'ship')
        } else {
          displayPlayers(gameScene, playersStates[id], 'otherPlayer')
        }
      })
    })

    // A new player has joined the game
    this.socket.on('newPlayer', function (playerState: PlayerState) {
      displayPlayers(gameScene, playerState, 'otherPlayer')
    })

    // A player has been disconnected
    this.socket.on('playerDisconnected', function (playerId: PlayerId) {
      gameScene.players.getChildren().forEach(function (gameObject) {
        const player = gameObject as Player
        if (playerId === player.id) {
          player.destroy()
        }
      })
    })

    // Update players positions
    this.socket.on('playerUpdates', function (players: PlayersStates) {
      Object.keys(players).forEach(function (id) {
        gameScene.players.getChildren().forEach(function (gameObject) {
          const player = gameObject as Player
          if (players[id].playerId === player.id) {
            player.setRotation(players[id].rotation)
            player.setPosition(players[id].x, players[id].y)
          }
        })
      })
    })

    this.cursors = this.input.keyboard.createCursorKeys()
    this.leftKeyPressed = false
    this.rightKeyPressed = false
    this.upKeyPressed = false
  }

  update(t: number, dt: number) {
    const left = this.leftKeyPressed
    const right = this.rightKeyPressed
    const up = this.upKeyPressed
  
    if (this.cursors.left.isDown) {
      this.leftKeyPressed = true
    } else if (this.cursors.right.isDown) {
      this.rightKeyPressed = true
    } else {
      this.leftKeyPressed = false
      this.rightKeyPressed = false
    }
  
    if (this.cursors.up.isDown) {
      this.upKeyPressed = true
    } else {
      this.upKeyPressed = false
    }
  
    if (
      left !== this.leftKeyPressed ||
      right !== this.rightKeyPressed ||
      up !== this.upKeyPressed
    ) {
      this.socket.emit('playerInput', {
        left: this.leftKeyPressed,
        right: this.rightKeyPressed,
        up: this.upKeyPressed,
      })
    }
  }
}

const displayPlayers = (
  scene: Game,
  playerState: PlayerState,
  sprite: string,
) => {
  console.log(`Adding player with sprite: ${sprite}`)
  const player = new Player(
    scene,
    playerState.x,
    playerState.y,
    sprite,
    playerState.playerId,
  )
    .setOrigin(0.5, 0.5)
    .setDisplaySize(53, 40)
  scene.add.existing(player)

  if (playerState.team === 'blue') player.setTint(0x0000ff)
  else player.setTint(0xff0000)

  scene.players.add(player)
}
