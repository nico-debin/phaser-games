import Phaser from 'phaser'
import { Server } from 'socket.io'
import Player, { PlayerId } from '../characters/Player';
declare global {
	interface Window { io: Server; }
}

interface PlayerState {
  rotation: number;
  x: number;
  y: number;
  playerId: PlayerId;
  team: 'red' | 'blue';
  input: {
    left: boolean;
    right: boolean;
    up: boolean;
  }
}

interface PlayersStates {
  [playerId: string]: PlayerState
}

const io = window.io;
export default class Game extends Phaser.Scene {

  // Phaser representation of the players
  players!: Phaser.Physics.Arcade.Group

  // State representation of the players, used to update client
  playersStates: PlayersStates = {}

  constructor() {
    super('game')
  }

  create() {
    this.players = this.physics.add.group({
      classType: Player
    })

    this.physics.add.collider(this.players, this.players)

    const gameScene: Game = this

    console.log(io)

    io.on('connection', (socket) => {
      const playerId: PlayerId = socket.id

      console.log(`user ${playerId} connected`)

      // create a new player and add it to our players object
      this.playersStates[playerId] = {
        playerId,
        rotation: 0,
        x: Math.floor(Math.random() * 700) + 50,
        y: Math.floor(Math.random() * 500) + 50,
        team: Math.floor(Math.random() * 2) == 0 ? 'red' : 'blue',
        input: {
          left: false,
          right: false,
          up: false,
        },
      }

      // add player to server
      addPlayer(this, this.playersStates[playerId])

      // send the players object to the new player
      socket.emit('currentPlayers', this.playersStates)

      // update all other players of the new player
      socket.broadcast.emit('newPlayer', this.playersStates[playerId])

      // Player disconnected handler
      socket.on('disconnect', function () {
        console.log(`user ${playerId} disconnected`)
  
        // remove player from server
        removePlayer(gameScene, playerId)
  
        // remove this player from our players object
        delete gameScene.playersStates[playerId]
  
        // emit a message to all players to remove this player
        io.emit('playerDisconnected', playerId)
      })

      // Player input handler: when a player moves, update the player data
      socket.on('playerInput', function (inputData) {
        handlePlayerInput(gameScene, playerId, inputData)
      })
    })
  }

  update(t: number, dt: number) {
    this.players.getChildren().forEach((gameObject) => {
      const player = gameObject as Player
      const input = this.playersStates[player.id].input
  
      if (input.left) {
        player.setAngularVelocity(-300)
      } else if (input.right) {
        player.setAngularVelocity(300)
      } else {
        player.setAngularVelocity(0)
      }
  
      if (input.up) {
        this.physics.velocityFromRotation(
          player.rotation + 1.5,
          200,
          // @ts-ignore
          player.body.acceleration,
        )
      } else {
        player.setAcceleration(0)
      }
  
      this.playersStates[player.id].x = player.x
      this.playersStates[player.id].y = player.y
      this.playersStates[player.id].rotation = player.rotation
    })
  
    this.physics.world.wrap(this.players, 5)
  
    io.emit('playerUpdates', this.playersStates)
  }
}

const addPlayer = (scene: Game, playerState: PlayerState) => {
  const player = new Player(scene, playerState.x, playerState.y, 'ship', playerState.playerId).setOrigin(0.5, 0.5).setDisplaySize(53, 40)
  scene.physics.add.existing(player)
  
  player.setDrag(100)
  player.setAngularDrag(100)
  player.setMaxVelocity(200)

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

const handlePlayerInput = (scene: Game, playerId: PlayerId, input) => {
  scene.players.getChildren().forEach((gameObject) => {
    const player = gameObject as Player
    if (playerId === player.id) {
      scene.playersStates[player.id].input = input
    }
  })
}
