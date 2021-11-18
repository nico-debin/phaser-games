import Phaser from 'phaser'

import { createLizardAnims } from '../anims/EnemyAnims'
import { createCharacterAnims } from '../anims/CharacterAnims'
import { debugDraw } from '../utils/debug'

import Lizard from '../enemies/Lizard'
import '../characters/Fauna'
import Fauna from '../characters/Fauna'

export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private fauna!: Fauna

  private hit = 0

  constructor() {
    super('game')
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  create() {
    createCharacterAnims(this.anims)
    createLizardAnims(this.anims)

    const map = this.make.tilemap({
      key: 'dungeon',
    })
    const tileset = map.addTilesetImage('dungeon', 'tiles', 16, 16, 1, 2)

    map.createLayer('Ground', tileset)
    
    this.fauna = this.add.fauna(128, 128, 'fauna')
    
    const wallsLayer = map.createLayer('Walls', tileset)
    wallsLayer.setCollisionByProperty({ collides: true })
    // debugDraw(wallsLayer, this)

    this.cameras.main.startFollow(this.fauna, true)

    const lizards = this.physics.add.group({
      classType: Lizard,
      createCallback: (gameObject: Phaser.GameObjects.GameObject) => {
        const lizardGameObject = gameObject as Lizard
        lizardGameObject.body
          .setSize(lizardGameObject.width, lizardGameObject.height * 0.6)
          .setOffset(0, 10)
        lizardGameObject.body.onCollide = true
      },
    })
    lizards.get(256, 128, 'lizard')
    lizards.get(80, 80, 'lizard')

    this.physics.add.collider(this.fauna, wallsLayer)
    this.physics.add.collider(lizards, wallsLayer)

    this.physics.add.collider(lizards, this.fauna, this.handlePlayerLizardCollision, undefined, this)
  }

  private handlePlayerLizardCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
    const lizard = obj2 as Lizard

    const dx = this.fauna.x - lizard.x
    const dy = this.fauna.y - lizard.y

    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200)

    // Player gets hit to the opposite direction
    this.fauna.handleDamage(dir)

    this.hit = 1
  }

  update(t: number, dt: number) {
    if (this.hit > 0) {
        if (++this.hit > 10) {
            this.hit = 0
        }
        return
    }

    this.fauna.update(this.cursors)
  }
}
