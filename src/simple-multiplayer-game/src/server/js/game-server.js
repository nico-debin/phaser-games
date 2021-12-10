const players = {}

const config = {
  type: Phaser.HEADLESS,
  autoFocus: false,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 },
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
}

function preload() {
  this.load.image('ship', 'assets/spaceShips_001.png')
}

function create() {
  const self = this
  this.players = this.physics.add.group()

  this.physics.add.collider(this.players)

  io.on('connection', function (socket) {
    console.log(`user ${socket.id} connected`)

    // create a new player and add it to our players object
    players[socket.id] = {
      rotation: 0,
      x: Math.floor(Math.random() * 700) + 50,
      y: Math.floor(Math.random() * 500) + 50,
      playerId: socket.id,
      team: Math.floor(Math.random() * 2) == 0 ? 'red' : 'blue',
      input: {
        left: false,
        right: false,
        up: false,
      },
    }

    // add player to server
    addPlayer(self, players[socket.id])

    // send the players object to the new player
    socket.emit('currentPlayers', players)

    // update all other players of the new player
    socket.broadcast.emit('newPlayer', players[socket.id])

    // Player disconnected handler
    socket.on('disconnect', function () {
      console.log(`user ${socket.id} disconnected`)

      // remove player from server
      removePlayer(self, socket.id)

      // remove this player from our players object
      delete players[socket.id]

      // emit a message to all players to remove this player
      io.emit('playerDisconnected', socket.id)
    })

    // Player input handler: when a player moves, update the player data
    socket.on('playerInput', function (inputData) {
      handlePlayerInput(self, socket.id, inputData)
    })
  })
}

function update() {
  this.players.getChildren().forEach((player) => {
    const input = players[player.playerId].input

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
        player.body.acceleration,
      )
    } else {
      player.setAcceleration(0)
    }

    players[player.playerId].x = player.x
    players[player.playerId].y = player.y
    players[player.playerId].rotation = player.rotation
  })

  this.physics.world.wrap(this.players, 5)

  io.emit('playerUpdates', players)
}

function addPlayer(scene, playerInfo) {
  const player = scene.physics.add
    .image(playerInfo.x, playerInfo.y, 'ship')
    .setOrigin(0.5, 0.5)
    .setDisplaySize(53, 40)
  player.setDrag(100)
  player.setAngularDrag(100)
  player.setMaxVelocity(200)
  player.playerId = playerInfo.playerId
  scene.players.add(player)
}

function removePlayer(scene, playerId) {
  scene.players.getChildren().forEach((player) => {
    if (playerId === player.playerId) {
      player.destroy()
    }
  })
}

function handlePlayerInput(scene, playerId, input) {
  scene.players.getChildren().forEach((player) => {
    if (playerId === player.playerId) {
      players[player.playerId].input = input
    }
  })
}

const game = new Phaser.Game(config)

window.gameLoaded()
