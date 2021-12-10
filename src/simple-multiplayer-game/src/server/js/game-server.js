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

  io.on('connection', function (socket) {
    console.log(`user ${socket.id} connected`)

    // create a new player and add it to our players object
    players[socket.id] = {
      rotation: 0,
      x: Math.floor(Math.random() * 700) + 50,
      y: Math.floor(Math.random() * 500) + 50,
      playerId: socket.id,
      team: Math.floor(Math.random() * 2) == 0 ? 'red' : 'blue',
    }

    // add player to server
    addPlayer(self, players[socket.id])

    // send the players object to the new player
    socket.emit('currentPlayers', players)

    // update all other players of the new player
    socket.broadcast.emit('newPlayer', players[socket.id])

    socket.on('disconnect', function () {
      console.log(`user ${socket.id} disconnected`)

      // remove player from server
      removePlayer(self, socket.id)

      // remove this player from our players object
      delete players[socket.id]

      // emit a message to all players to remove this player
      io.emit('playerDisconnected', socket.id)
    })
  })
}

function update() {}

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

const game = new Phaser.Game(config)

window.gameLoaded()
