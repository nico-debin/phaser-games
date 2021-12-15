import Phaser from 'phaser'
import TextureKeys from '../consts/TextureKeys'

export const createCharacterAnims = (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: 'fauna-idle-down',
    frames: [
      {
        key: TextureKeys.Fauna,
        frame: 'walk-down-3.png',
      },
    ],
  })

  anims.create({
    key: 'fauna-idle-up',
    frames: [
      {
        key: TextureKeys.Fauna,
        frame: 'walk-up-3.png',
      },
    ],
  })

  anims.create({
    key: 'fauna-idle-side',
    frames: [
      {
        key: TextureKeys.Fauna,
        frame: 'walk-side-3.png',
      },
    ],
  })

  anims.create({
    key: 'fauna-run-down',
    frames: anims.generateFrameNames(TextureKeys.Fauna, {
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
    frames: anims.generateFrameNames(TextureKeys.Fauna, {
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
    frames: anims.generateFrameNames(TextureKeys.Fauna, {
      start: 1,
      end: 8,
      prefix: 'run-side-',
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 15,
  })

  anims.create({
    key: 'fauna-faint',
    frames: anims.generateFrameNames(TextureKeys.Fauna, {
      start: 1,
      end: 4,
      prefix: 'faint-',
      suffix: '.png',
    }),
    frameRate: 15,

  })
}

export const createLizardAnims = (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: 'lizard-idle',
    frames: anims.generateFrameNames(TextureKeys.Lizard, {
      start: 0,
      end: 3,
      prefix: 'lizard_m_idle_anim_f',
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 10,
  })

  anims.create({
    key: 'lizard-run',
    frames: anims.generateFrameNames(TextureKeys.Lizard, {
      start: 0,
      end: 3,
      prefix: 'lizard_m_run_anim_f',
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 10,
  })
}

