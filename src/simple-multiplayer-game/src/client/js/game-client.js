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
  this.load.image('otherPlayer', 'assets/enemyBlack5.png');
}

function create() {
  const self = this
  this.socket = io()
  this.players = this.add.group()

  this.socket.on('currentPlayers', function (players) {
    Object.keys(players).forEach(function (id) {
      if (players[id].playerId === self.socket.id) {
        displayPlayers(self, players[id], 'ship')
      } else {
        displayPlayers(self, players[id], 'otherPlayer');
      }
    })
  })

  this.socket.on('newPlayer', function (playerInfo) {
    displayPlayers(self, playerInfo, 'otherPlayer');
  });

  this.socket.on('playerDisconnected', function (playerId) {
    self.players.getChildren().forEach(function (player) {
      if (playerId === player.playerId) {
        player.destroy();
      }
    });
  });
}

function update() {}

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
