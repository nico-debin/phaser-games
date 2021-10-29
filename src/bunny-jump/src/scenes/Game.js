import Phaser from '../lib/phaser.js'
import Carrot from '../game/Carrot.js'

export default class Game extends Phaser.Scene {
  /** @type {Phaser.Physics.Arcade.Sprite} */
  player

  /** @type {Phaser.Physics.Arcade.StaticGroup} */
  platforms

  /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
  cursors

  /** @type {Phaser.Physics.Arcade.Group} */
  carrots

  carrotsCollected = 0

  /** @type {Phaser.GameObjects.Text} */
  carrotsCollectedText

  constructor() {
    super('game')
  }

  init() {
    this.carrotsCollected = 0
  }

  preload() {
    this.load.image('background', 'assets/bg_layer1.png')
    this.load.image('platform', 'assets/ground_grass.png')
    this.load.image('bunny-stand', 'assets/bunny1_stand.png')
    this.load.image('bunny-jump', 'assets/bunny1_jump.png')
    this.load.image('carrot', 'assets/carrot.png')

    this.load.audio('jump', 'assets/sfx/phaseJump1.ogg')
    this.load.audio('carrot', 'assets/sfx/zap1.ogg')

    this.cursors = this.input.keyboard.createCursorKeys()
  }

  create() {
    this.add.image(240, 320, 'background').setScrollFactor(1, 0)

    // Create platforms
    this.platforms = this.physics.add.staticGroup()
    for (let i = 0; i < 5; ++i) {
      const x = Phaser.Math.Between(80, 400)
      const y = 150 * i

      /** @type {Phaser.Physics.Arcade.Sprite} */
      const platform = this.platforms.create(x, y, 'platform')
      platform.scale = 0.5

      /** @type {Phaser.Physics.Arcade.StaticBody} */
      const body = platform.body
      body.updateFromGameObject()
    }

    // Create Player
    this.player = this.physics.add.sprite(240, 320, 'bunny-stand').setScale(0.5)
    this.physics.add.collider(this.platforms, this.player)

    // Player collides only with his feets
    this.player.body.checkCollision.up = false
    this.player.body.checkCollision.left = false
    this.player.body.checkCollision.right = false

    // Follow the player with the camera
    this.cameras.main.startFollow(this.player)
    this.cameras.main.setDeadzone(this.scale.width * 1.5)

    // Create a carrot
    this.carrots = this.physics.add.group({
      classType: Carrot,
    })
    this.physics.add.collider(this.platforms, this.carrots)

    this.physics.add.overlap(
      this.player,
      this.carrots,
      this.handleCollectCarrot,
      undefined,
      this,
    )

    const style = { color: '#000', fontSize: 24 }
    this.carrotsCollectedText = this.add
      .text(240, 10, 'Carrots: 0', style)
      .setScrollFactor(0)
      .setOrigin(0.5, 0)
  }

  update() {
    // Reuse platforms that are left behind at the bottom
    this.platforms.children.iterate((child) => {
      /** @type {Phaser.Physics.Arcade.Sprite} */
      const platform = child

      const scrollY = this.cameras.main.scrollY
      if (platform.y >= scrollY + 700) {
        platform.y = scrollY - Phaser.Math.Between(50, 100)
        platform.body.updateFromGameObject()

        // create a carrot above the platform being reused
        this.addCarrotAbove(platform)
      }
    })

    this.carrots.children.iterate((child) => {
      /** @type {Phaser.Physics.Arcade.Sprite} */
      const carrot = child

      const scrollY = this.cameras.main.scrollY
      if (carrot.y >= scrollY + 700) {
        this.carrots.killAndHide(carrot)
        this.physics.world.disableBody(carrot.body)
      }
    })

    // Bounce the player when tocuhing the ground
    const touchingDown = this.player.body.touching.down
    if (touchingDown) {
      this.player.setVelocityY(-300)
      this.player.setTexture('bunny-jump')
      this.sound.play('jump')
    }

    const playerIsFalling = this.player.body.velocity.y > 0
    if (playerIsFalling && this.player.texture.key !== 'bunny-stand') {
      this.player.setTexture('bunny-stand')
    }

    // Player movement with arrow keys
    if (this.cursors.left.isDown && !touchingDown) {
      this.player.setVelocityX(-200)
    } else if (this.cursors.right.isDown && !touchingDown) {
      this.player.setVelocityX(200)
    } else if (this.cursors.down.isDown && !touchingDown && playerIsFalling) {
      this.player.setVelocityY(this.player.body.velocity.y + 50)
    } else {
      this.player.setVelocityX(0)
    }

    this.horizontalWrap(this.player)

    const bottomPlatform = this.findBottomMostPlatform()
    if (this.player.y > bottomPlatform.y + 200) {
      this.scene.start('game-over')
    }
  }

  /** @param {Phaser.GameObjects.Sprite} sprite */
  horizontalWrap(sprite) {
    const quarterWidth = sprite.displayWidth / 4
    const gameWidth = this.scale.width
    if (sprite.x < -quarterWidth) {
      sprite.x = gameWidth + quarterWidth
    } else if (sprite.x > gameWidth + quarterWidth) {
      sprite.x = -quarterWidth
    }
  }

  /**
   *
   * @param {Phaser.GameObjects.Sprite} sprite
   */
  addCarrotAbove(sprite) {
    const y = sprite.y - sprite.displayHeight

    /** @type {Phaser.Physics.Arcade.Sprite} */
    const carrot = this.carrots.get(sprite.x, y, 'carrot')

    carrot.setActive(true).setVisible(true)

    this.add.existing(carrot)

    // update the physics body size
    carrot.body.setSize(carrot.width, carrot.height)

    // make sure body is enabed in the physics world
    this.physics.world.enable(carrot)

    return carrot
  }

  /**
   * @param {Phaser.Physics.Arcade.Sprite} player
   * @param {Carrot} carrot
   */
  handleCollectCarrot(player, carrot) {
    // hide from display
    this.carrots.killAndHide(carrot)

    this.physics.world.disableBody(carrot.body)

    this.carrotsCollected++
    this.carrotsCollectedText.text = `Carrots: ${this.carrotsCollected}`

    this.sound.play('carrot')
  }

  findBottomMostPlatform() {
    let bottomMostPlatform = this.platforms.getChildren()[0]
    this.platforms.children.iterate((child) => {
      /** @type {Phaser.Physics.Arcade.Sprite} */
      const platform = child

      if (platform.y > bottomMostPlatform.y) {
        bottomMostPlatform = platform
      }
    })
    return bottomMostPlatform
  }
}
