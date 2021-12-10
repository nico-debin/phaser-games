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
}

function create() {
  const self = this
  this.socket = io()
  this.players = this.add.group()

  this.socket.on('currentPlayers', function (players) {
    Object.keys(players).forEach(function (id) {
      if (players[id].playerId === self.socket.id) {
        displayPlayers(self, players[id], 'ship')
      }
    })
  })
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
