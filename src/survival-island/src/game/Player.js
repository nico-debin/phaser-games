import Phaser from '../lib/phaser.js'

export default class Player extends Phaser.Physics.Matter.Sprite {
  constructor(data) {
    const { name, scene, x, y } = data
    const texture = name
    const frame = `${name}_idle_1`
    super(scene.matter.world, x, y, texture, frame)
    this.setScale(2)
    this.scene.add.existing(this)
    this.name = name
    this.firstLoop = true

    /** @type {{Body: MatterJS.BodyFactory, Bodies: MatterJS.BodiesFactory}} */
    const { Body, Bodies } = Phaser.Physics.Matter.Matter

    let playerCollider = Bodies.rectangle(
      this.x + 0,
      this.y - 3,
      10 * this.scaleX,
      16 * this.scaleY,
      {
        isSensor: false,
        label: `${name}Collider`,
      },
    )
    let playerSensor = Bodies.circle(this.x, this.y, 24, {
      isSensor: true,
      label: `${name}Sensor`,
    })
    const compoundBody = Body.create({
      parts: [playerCollider, playerSensor],
      frictionAir: 0.35,
    })
    this.setExistingBody(compoundBody)
    this.setFixedRotation()
  }

  static preload(scene, players = []) {
    players.map((playerName) => {
      scene.load.atlas(
        playerName,
        `assets/images/${playerName}.png`,
        `assets/images/${playerName}_atlas.json`,
      )
      scene.load.animation(
        `${playerName}_anim`,
        `assets/images/${playerName}_anim.json`,
      )
    })
  }

  get velocity() {
    return this.body.velocity
  }

  update() {
    const speed = 4

    // Initialize animation
    if (this.firstLoop) {
      this.anims.play(`${this.name}_idle`, true)
      this.firstLoop = false
    }

    let playerVelocity = new Phaser.Math.Vector2()
    if (this.inputKeys.left.isDown) {
      playerVelocity.x = -1
    } else if (this.inputKeys.right.isDown) {
      playerVelocity.x = 1
    }
    if (this.inputKeys.up.isDown) {
      playerVelocity.y = -1
    } else if (this.inputKeys.down.isDown) {
      playerVelocity.y = 1
    }
    playerVelocity.normalize()
    playerVelocity.scale(speed)
    this.setVelocity(playerVelocity.x, playerVelocity.y)

    if (Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1) {
      this.anims.play(`${this.name}_walk`, true)
    } else {
      this.anims.play(`${this.name}_idle`, true)
    }
  }
}
