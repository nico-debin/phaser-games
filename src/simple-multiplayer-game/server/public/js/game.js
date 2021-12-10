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
function preload() {}

function create() {
  this.socket = io()
}

function update() {}

const game = new Phaser.Game(config)
