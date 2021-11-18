import Phaser from 'phaser'

const createCharacterAnims = (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: 'fauna-idle-down',
    frames: [
      {
        key: 'fauna',
        frame: 'walk-down-3.png',
      },
    ],
  })

  anims.create({
    key: 'fauna-idle-up',
    frames: [
      {
        key: 'fauna',
        frame: 'walk-up-3.png',
      },
    ],
  })

  anims.create({
    key: 'fauna-idle-side',
    frames: [
      {
        key: 'fauna',
        frame: 'walk-side-3.png',
      },
    ],
  })

  anims.create({
    key: 'fauna-run-down',
    frames: anims.generateFrameNames('fauna', {
      start: 1,
      end: 8,
      prefix: 'run-down-',
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 15,
  })

  anims.create({
    key: 'fauna-run-up',
    frames: anims.generateFrameNames('fauna', {
      start: 1,
      end: 8,
      prefix: 'run-up-',
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 15,
  })

  anims.create({
    key: 'fauna-run-side',
    frames: anims.generateFrameNames('fauna', {
      start: 1,
      end: 8,
      prefix: 'run-side-',
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 15,
  })
}

export { createCharacterAnims }
