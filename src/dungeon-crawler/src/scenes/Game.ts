import Phaser from 'phaser'

import { createLizardAnims } from '../anims/EnemyAnims'
import { createCharacterAnims } from '../anims/CharacterAnims'
import { createChestAnims } from '../anims/TreasureAnims'
import { debugDraw } from '../utils/debug'

import Lizard from '../enemies/Lizard'
import '../characters/Fauna'
import Fauna from '../characters/Fauna'

import { sceneEvents } from '../events/EventCenter'
import Chest from '../items/Chest'

export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private fauna!: Fauna
  private knives!: Phaser.Physics.Arcade.Group
  private lizards!: Phaser.Physics.Arcade.Group

  private playerLizardsCollider?: Phaser.Physics.Arcade.Collider

  constructor() {
    super('game')
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  create() {
    this.scene.run('game-ui')

    createCharacterAnims(this.anims)
    createLizardAnims(this.anims)
    createChestAnims(this.anims)

    const map = this.make.tilemap({
      key: 'dungeon',
    })
    const tileset = map.addTilesetImage('dungeon', 'tiles', 16, 16, 1, 2)

    map.createLayer('Ground', tileset)

    this.knives = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
    })

    this.fauna = this.add.fauna(256, 128, 'fauna')
    this.fauna.setKnives(this.knives)

    const wallsLayer = map.createLayer('Walls', tileset)
    wallsLayer.setCollisionByProperty({ collides: true })
    // debugDraw(wallsLayer, this)

    const chests = this.physics.add.staticGroup({
      classType: Chest
    })
    const chestsLayer = map.getObjectLayer('Chests')
    chestsLayer.objects.forEach(chestObj => {
      chests.get(chestObj.x! - chestObj.height!, chestObj.y! - chestObj.height! * 0.5, 'treasure')
    })

    this.cameras.main.startFollow(this.fauna, true)

    this.lizards = this.physics.add.group({
      classType: Lizard,
      createCallback: (gameObject: Phaser.GameObjects.GameObject) => {
        const lizardGameObject = gameObject as Lizard
        lizardGameObject.body
          .setSize(lizardGameObject.width, lizardGameObject.height * 0.6)
          .setOffset(0, 10)
        lizardGameObject.body.onCollide = true
      },
    })
    const lizardsLayer = map.getObjectLayer('Lizards')
    lizardsLayer.objects.forEach(lizardObj => {
      this.lizards.get(lizardObj.x! + lizardObj.width! * 0.5, lizardObj.y! + lizardObj.height! * 0.5, 'lizards')
    })

    this.physics.add.collider(this.fauna, wallsLayer)
    this.physics.add.collider(this.lizards, wallsLayer)
    this.physics.add.collider(this.fauna, chests, this.handlePlayerChestCollision, undefined, this)
    this.physics.add.collider(this.lizards, chests)
    this.physics.add.collider(this.knives, wallsLayer, this.handleKnifeWallCollision, undefined, this)
    this.physics.add.collider(
      this.knives,
      this.lizards,
      this.handleKnifeLizardCollision,
      undefined,
      this,
    )

    this.playerLizardsCollider = this.physics.add.collider(
      this.lizards,
      this.fauna,
      this.handlePlayerLizardCollision,
      undefined,
      this,
    )
  }

  private handlePlayerChestCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject,
  ) {
    const chest = obj2 as Chest
    this.fauna.setChest(chest)
  }

  private handleKnifeWallCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject,
  ) {
    const knife = obj1 as Phaser.Physics.Arcade.Image
    this.knives.killAndHide(knife)
  }

  private handleKnifeLizardCollision(
    obj1: Phaser.GameObjects.GameObject, // Knife
    obj2: Phaser.GameObjects.GameObject, // Lizard
  ) {
    const knife = obj1 as Phaser.Physics.Arcade.Image
    this.knives.killAndHide(knife)

    const lizard = obj2 as Lizard
    lizard.disableBody(true, true)
    // this.lizards.killAndHide(lizard)
  }

  private handlePlayerLizardCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject,
  ) {
    const lizard = obj2 as Lizard

    const dx = this.fauna.x - lizard.x
    const dy = this.fauna.y - lizard.y

    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200)

    // Player gets hit to the opposite direction
    this.fauna.handleDamage(dir)

    sceneEvents.emit('player-health-changed', this.fauna.health)

    if (this.fauna.health <= 0) {
      this.playerLizardsCollider?.destroy()
    }
  }

  update(t: number, dt: number) {
    if (this.fauna) {
      this.fauna.update(this.cursors)
    }
  }
}
