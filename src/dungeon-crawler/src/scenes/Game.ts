import Phaser from 'phaser'

export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private faune!: Phaser.Physics.Arcade.Sprite

  constructor() {
    super('game')
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  create() {
    const map = this.make.tilemap({
      key: 'dungeon',
    })
    const tileset = map.addTilesetImage('dungeon', 'tiles')

    map.createLayer('Ground', tileset)
    const wallsLayer = map.createLayer('Walls', tileset)

    wallsLayer.setCollisionByProperty({ collides: true })

    const debugGraphics = this.add.graphics().setAlpha(0.7)
    wallsLayer.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
      faceColor: new Phaser.Display.Color(40, 39, 37, 255),
    })

    this.faune = this.physics.add.sprite(128, 128, 'faune', 'walk-down-3.png')
    this.faune.body.setSize(this.faune.width * 0.5, this.faune.height * 0.8)

    this.anims.create({
      key: 'faune-idle-down',
      frames: [
        {
          key: 'faune',
          frame: 'walk-down-3.png',
        },
      ],
    })

    this.anims.create({
      key: 'faune-idle-up',
      frames: [
        {
          key: 'faune',
          frame: 'walk-up-3.png',
        },
      ],
    })

    this.anims.create({
      key: 'faune-idle-side',
      frames: [
        {
          key: 'faune',
          frame: 'walk-side-3.png',
        },
      ],
    })

    this.anims.create({
      key: 'faune-run-down',
      frames: this.anims.generateFrameNames('faune', {
        start: 1,
        end: 8,
        prefix: 'run-down-',
        suffix: '.png',
      }),
      repeat: -1,
      frameRate: 15,
    })

    this.anims.create({
      key: 'faune-run-up',
      frames: this.anims.generateFrameNames('faune', {
        start: 1,
        end: 8,
        prefix: 'run-up-',
        suffix: '.png',
      }),
      repeat: -1,
      frameRate: 15,
    })

    this.anims.create({
      key: 'faune-run-side',
      frames: this.anims.generateFrameNames('faune', {
        start: 1,
        end: 8,
        prefix: 'run-side-',
        suffix: '.png',
      }),
      repeat: -1,
      frameRate: 15,
    })

    this.faune.anims.play('faune-down-side')

    this.physics.add.collider(this.faune, wallsLayer)

    this.cameras.main.startFollow(this.faune, true)
  }

  update(t: number, dt: number) {
    if (!this.cursors || !this.faune) {
      return
    }

    const speed = 100

    if (this.cursors.left.isDown) {
      this.faune.anims.play('faune-run-side', true)
      this.faune.setVelocity(-speed, 0)

      // Flip sprite to the left
      this.faune.setFlipX(true)
    } else if (this.cursors.right.isDown) {
      this.faune.anims.play('faune-run-side', true)
      this.faune.setVelocity(speed, 0)

      // Flip sprite to the right
      this.faune.setFlipX(false)
    } else if (this.cursors.up.isDown) {
      this.faune.anims.play('faune-run-up', true)
      this.faune.setVelocity(0, -speed)
    } else if (this.cursors.down.isDown) {
      this.faune.anims.play('faune-run-down', true)
      this.faune.setVelocity(0, speed)
    } else {
      if (this.faune.anims.currentAnim) {
        const parts = this.faune.anims.currentAnim.key.split('-')
        parts[1] = 'idle'
        this.faune.anims.play(parts.join('-'))
      } else {
        this.faune.anims.play('faine-idle-down')
      }

      this.faune.setVelocity(0, 0)
    }
  }
}
