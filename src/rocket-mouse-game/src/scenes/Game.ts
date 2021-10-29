import Phaser from 'phaser'
import RocketMouse from '../game/RocketMouse'
import SceneKeys from '../consts/SceneKeys'
import TextureKeys from '../consts/TextureKeys'
// import LaserObstacleDynamic from '../game/LaserObstacleDynamic'
// import LaserObstacleMovementKeys from '~/consts/LaserObstacleMovementKeys'
import AudioKeys from '../consts/AudioKeys'
import LaserObstacle from '~/game/LaserObstacle'

export default class Game extends Phaser.Scene {
  private background!: Phaser.GameObjects.TileSprite

  private ambienceMusic!: Phaser.Sound.BaseSound

  private mouseHole!: Phaser.GameObjects.Image
  private window1!: Phaser.GameObjects.Image
  private window2!: Phaser.GameObjects.Image
  private bookcase1!: Phaser.GameObjects.Image
  private bookcase2!: Phaser.GameObjects.Image

  private windows: Phaser.GameObjects.Image[] = []
  private bookcases: Phaser.GameObjects.Image[] = []

  private mouse!: RocketMouse
  private laserObstacle!: LaserObstacle
  // private laserObstacleDynamic!: LaserObstacleDynamic

  private coins!: Phaser.Physics.Arcade.StaticGroup

  private scoreLabel!: Phaser.GameObjects.Text
  private score = 0

  constructor() {
    super(SceneKeys.Game)
  }

  init() {
    this.score = 0
  }

  create() {
    const width = this.scale.width
    const height = this.scale.height

    // Set background
    this.background = this.add
      .tileSprite(0, 0, width, height, TextureKeys.Background)
      .setOrigin(0, 0)
      .setScrollFactor(0, 0)

    // Set ambience music
    this.ambienceMusic = this.sound.add(AudioKeys.ambience)
    this.ambienceMusic.play('', { volume: 0.6, loop: true })

    // Mouse hole background
    this.mouseHole = this.add.image(
      Phaser.Math.Between(900, 1500),
      501,
      TextureKeys.MouseHole,
    )

    // Windows backgrounds
    this.window1 = this.add.image(
      Phaser.Math.Between(900, 1300),
      200,
      TextureKeys.Window1,
    )
    this.window2 = this.add.image(
      Phaser.Math.Between(1600, 2000),
      200,
      TextureKeys.Window2,
    )
    this.windows = [this.window1, this.window2]

    // Bookcase backgrounds
    this.bookcase1 = this.add
      .image(Phaser.Math.Between(2200, 2700), 580, TextureKeys.Bookcase1)
      .setOrigin(0.5, 1)
    this.bookcase2 = this.add
      .image(Phaser.Math.Between(2900, 3400), 580, TextureKeys.Bookcase2)
      .setOrigin(0.5, 1)
    this.bookcases = [this.bookcase1, this.bookcase2]

    // Create laser obstacle
    this.laserObstacle = new LaserObstacle(this, 900, 100)
    this.add.existing(this.laserObstacle)
    // this.laserObstacleDynamic = new LaserObstacleDynamic(this, width + 200, 300)
    // this.laserObstacleDynamic.setMoveType(LaserObstacleMovementKeys.static)
    // this.add.existing(this.laserObstacleDynamic)

    // Coins
    this.coins = this.physics.add.staticGroup()
    this.spawnCoins()

    // Create mouse player
    this.mouse = new RocketMouse(this, width * 0.5, height - 30)
    this.add.existing(this.mouse)

    // Set player physics
    const body = this.mouse.body as Phaser.Physics.Arcade.Body
    body.setCollideWorldBounds(true)
    body.setVelocityX(250)

    // World bounds
    this.physics.world.setBounds(0, 0, Number.MAX_SAFE_INTEGER, height - 55)

    // Follow the player with the main camera
    this.cameras.main.startFollow(this.mouse)
    this.cameras.main.setBounds(0, 0, Number.MAX_SAFE_INTEGER, height)

    // Overlap mouse with laser
    this.physics.add.overlap(
      this.laserObstacle,
      this.mouse,
      this.handleOverlapLaser,
      undefined,
      this,
    )
    // this.physics.add.overlap(
    //   this.laserObstacleDynamic,
    //   this.mouse,
    //   this.handleOverlapLaser,
    //   undefined,
    //   this,
    // )

    // Overlap mouse with coins
    this.physics.add.overlap(
      this.coins,
      this.mouse,
      this.handleCollectCoin,
      undefined,
      this,
    )

    // Game Over condition
    this.mouse.onDead(() => {
      this.scene.run(SceneKeys.GameOver)

      this.input.keyboard.once('keydown-SPACE', () => {
        this.scene.stop(SceneKeys.GameOver)
        this.scene.restart()
      })
    })

    this.scoreLabel = this.add
      .text(10, 10, `Score ${this.score}`, {
        fontSize: '24px',
        color: '#080808',
        backgroundColor: '#F8E71C',
        shadow: { fill: true, blur: 0, offsetY: 0 },
        padding: { left: 15, right: 15, top: 10, bottom: 10 },
      })
      .setScrollFactor(0)

    this.input.keyboard.on('keydown-S', () => {
      this.sound.mute = !this.sound.mute
    })
  }

  update(t: number, dt: number) {
    // Wrap background decorations
    this.wrapMouseHole()
    this.wrapWindows()
    this.wrapBookcases()

    // Wrap laser obstacle
    this.wrapLaserObstacle()

    // Scroll the background
    this.background.setTilePosition(this.cameras.main.scrollX)

    // Teleport all objects
    this.teleportBackwards()
  }

  private wrapMouseHole() {
    const scrollX = this.cameras.main.scrollX
    const rightEdge = scrollX + this.scale.width

    if (this.mouseHole.x + this.mouseHole.width < scrollX) {
      this.mouseHole.x = Phaser.Math.Between(rightEdge + 100, rightEdge + 1000)
    }
  }

  private wrapWindows() {
    const scrollX = this.cameras.main.scrollX
    const rightEdge = scrollX + this.scale.width

    // multiply by 2 to add some more padding
    let width = this.window1.width * 2
    if (this.window1.x + width < scrollX) {
      this.window1.x = Phaser.Math.Between(
        rightEdge + width,
        rightEdge + width + 800,
      )

      const overlap = this.bookcases.find((bc) => {
        return Math.abs(this.window1.x - bc.x) <= this.window1.width
      })

      this.window1.visible = !overlap
    }

    width = this.window2.width
    if (this.window2.x + width < scrollX) {
      this.window2.x = Phaser.Math.Between(
        this.window1.x + width,
        this.window1.x + width + 800,
      )

      const overlap = this.bookcases.find((bc) => {
        return Math.abs(this.window2.x - bc.x) <= this.window2.width
      })

      this.window2.visible = !overlap
    }
  }

  private wrapBookcases() {
    const scrollX = this.cameras.main.scrollX
    const rightEdge = scrollX + this.scale.width

    // multiply by 2 to add some more padding
    let width = this.bookcase1.width * 2
    if (this.bookcase1.x + width < scrollX) {
      this.bookcase1.x = Phaser.Math.Between(
        rightEdge + width,
        rightEdge + width + 800,
      )

      const overlap = this.windows.find((win) => {
        return Math.abs(this.bookcase1.x - win.x) <= win.width
      })

      this.bookcase1.visible = !overlap
    }

    width = this.bookcase2.width
    if (this.bookcase2.x + width < scrollX) {
      this.bookcase2.x = Phaser.Math.Between(
        this.bookcase1.x + width,
        this.bookcase1.x + width + 800,
      )

      const overlap = this.windows.find((win) => {
        return Math.abs(this.bookcase2.x - win.x) <= win.width
      })

      this.bookcase2.visible = !overlap
    }
  }

  private wrapLaserObstacle() {
    const scrollX = this.cameras.main.scrollX
    const rightEdge = scrollX + this.scale.width

    const body = this.laserObstacle.body as Phaser.Physics.Arcade.StaticBody

    const width = body.width
    if (this.laserObstacle.x + width < scrollX) {
      this.laserObstacle.x = Phaser.Math.Between(
        rightEdge + width,
        rightEdge + width + 1000,
      )
      this.laserObstacle.y = Phaser.Math.Between(0, 300)

      body.position.x = this.laserObstacle.x + body.offset.x
      body.position.y = this.laserObstacle.y
    }
  }

  // private wrapLaserObstacleDynamic() {
  //   if (this.mouse.isDeadOrKilled()) return
  //   const scrollX = this.cameras.main.scrollX
  //   const rightEdge = scrollX + this.scale.width

  //   const body = this.laserObstacle.body as Phaser.Physics.Arcade.StaticBody
  //   // const body = this.laserObstacleDynamic.body as Phaser.Physics.Arcade.Body

  //   const width = body.width

  //   if (this.laserObstacleDynamic.x + width < scrollX) {
  //     console.log('LASER SPAWN - START')
  //     console.log(`Camera at: ${scrollX}`)
  //     this.laserObstacleDynamic.stopMove()

  //     let before = this.laserObstacleDynamic.x // DEBUG

  //     this.laserObstacleDynamic.x = Phaser.Math.Between(
  //       rightEdge + width,
  //       rightEdge + width + 500,
  //     )
  //     console.log(
  //       `this.laserObstacle.x from ${before} to ${this.laserObstacleDynamic.x}`,
  //     )

  //     this.laserObstacleDynamic.y = Phaser.Math.Between(200, 500)

  //     before = body.position.x // DEBUG
  //     body.position.x = this.laserObstacleDynamic.x + body.offset.x
  //     body.position.y = this.laserObstacleDynamic.y

  //     console.log(`body.position.x from ${before} to ${body.position.x}`)

  //     this.laserObstacleDynamic.setMoveType(LaserObstacleMovementKeys.static)

  //     // DEBUG
  //     console.log('LASER SPAWN - END')
  //   }
  // }

  private handleOverlapLaser(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject,
  ) {
    const mouse = obj2 as RocketMouse
    mouse.kill()

    this.ambienceMusic.stop()
  }

  private spawnCoins() {
    // make sure all coins are inactive and hidden
    this.coins.children.each((child) => {
      const coin = child as Phaser.Physics.Arcade.Sprite
      this.coins.killAndHide(coin)
      coin.body.enable = false
    })

    const scrollX = this.cameras.main.scrollX
    const rightEdge = scrollX + this.scale.width

    // start at 100 pixels past the right side of the screen
    let x = rightEdge + 100

    const numCoins = Phaser.Math.Between(10, 20)

    for (let i = 0; i < numCoins; i++) {
      const coin = this.coins.get(
        x,
        Phaser.Math.Between(100, this.scale.height - 100),
        TextureKeys.Coin,
      ) as Phaser.Physics.Arcade.Sprite

      coin.setVisible(true)
      coin.setActive(true)

      // enable and adjust physics body to be a circle
      const body = coin.body as Phaser.Physics.Arcade.StaticBody
      body.setCircle(body.width * 0.5)
      body.enable = true
      body.updateFromGameObject()

      // move x a random amount
      x += coin.width * 1.5
    }
  }

  private handleCollectCoin(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject,
  ) {
    if (!this.mouse.isRunning()) return

    // obj2 will be the coin
    const coin = obj2 as Phaser.Physics.Arcade.Sprite

    this.coins.killAndHide(coin)
    coin.body.enable = false

    this.sound.play(AudioKeys.coin)

    this.score += 1
    this.scoreLabel.text = `Score: ${this.score}`
  }

  private teleportBackwards() {
    const scrollX = this.cameras.main.scrollX
    const maxX = 2380

    // perform a teleport once scrolled beyond 2380
    if (scrollX > maxX) {
      // Teleport mouse and mousehole
      this.mouse.x -= maxX
      this.mouseHole.x -= maxX

      // Teleport windows
      this.windows.forEach((win) => {
        win.x -= maxX
      })

      // Teleport bookcases
      this.bookcases.forEach((bc) => {
        bc.x -= maxX
      })

      // Teleport laser
      this.laserObstacle.x -= maxX
      const laserBody = this.laserObstacle.body as Phaser.Physics.Arcade.StaticBody
      laserBody.x -= maxX

      // Spawn coins
      this.spawnCoins()

      // Teleport spawned coins
      this.coins.children.each((child) => {
        const coin = child as Phaser.Physics.Arcade.Sprite
        if (!coin.active) return

        coin.x -= maxX
        const body = coin.body as Phaser.Physics.Arcade.StaticBody
        body.updateFromGameObject()
      })
    }
  }
}
