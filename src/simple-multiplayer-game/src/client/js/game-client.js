const config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
}
function preload() {
  this.load.image('ship', 'assets/spaceShips_001.png')
  this.load.image('otherPlayer', 'assets/enemyBlack5.png')
}

function create() {
  const self = this
  this.socket = io()
  this.players = this.add.group()

  // All players in the game - used when joining a game that already has players
  this.socket.on('currentPlayers', function (players) {
    Object.keys(players).forEach(function (id) {
      if (players[id].playerId === self.socket.id) {
        displayPlayers(self, players[id], 'ship')
      } else {
        displayPlayers(self, players[id], 'otherPlayer')
      }
    })
  })

  // A new player has joined the game
  this.socket.on('newPlayer', function (playerInfo) {
    displayPlayers(self, playerInfo, 'otherPlayer')
  })

  // A player has been disconnected
  this.socket.on('playerDisconnected', function (playerId) {
    self.players.getChildren().forEach(function (player) {
      if (playerId === player.playerId) {
        player.destroy()
      }
    })
  })

  // Update players positions
  this.socket.on('playerUpdates', function (players) {
    Object.keys(players).forEach(function (id) {
      self.players.getChildren().forEach(function (player) {
        if (players[id].playerId === player.playerId) {
          player.setRotation(players[id].rotation);
          player.setPosition(players[id].x, players[id].y);
        }
      });
    });
  });

  this.cursors = this.input.keyboard.createCursorKeys()
  this.leftKeyPressed = false
  this.rightKeyPressed = false
  this.upKeyPressed = false
}

function update() {
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

function displayPlayers(scene, playerInfo, sprite) {
  const player = scene.add
    .sprite(playerInfo.x, playerInfo.y, sprite)
    .setOrigin(0.5, 0.5)
    .setDisplaySize(53, 40)
  if (playerInfo.team === 'blue') player.setTint(0x0000ff)
  else player.setTint(0xff0000)
  player.playerId = playerInfo.playerId
  scene.players.add(player)
}

const game = new Phaser.Game(config)
