import Phaser from 'phaser';

import AvatarAnimationKeys from '../consts/AvatarAnimationKeys';
import NpcKeys from '../consts/NpcKeys';

const createNpcAnims = (anims: Phaser.Animations.AnimationManager) => {
  const getFrameNumber = (row, col) => (row - 1) * 3 + (col - 1);

  anims.create({
    key: `${NpcKeys.COBRA}-${AvatarAnimationKeys.IDLE_UP}`,
    frames: [{ key: NpcKeys.COBRA, frame: getFrameNumber(1, 1) }],
  });

  anims.create({
    key: `${NpcKeys.COBRA}-${AvatarAnimationKeys.IDLE_SIDE}`,
    frames: [{ key: NpcKeys.COBRA, frame: getFrameNumber(2, 1) }],
  });

  anims.create({
    key: `${NpcKeys.COBRA}-${AvatarAnimationKeys.IDLE_DOWN}`,
    frames: [{ key: NpcKeys.COBRA, frame: getFrameNumber(3, 1) }],
  });

  anims.create({
    key: `${NpcKeys.COBRA}-${AvatarAnimationKeys.WALK_UP}`,
    frames: anims.generateFrameNumbers(NpcKeys.COBRA, {
      start: getFrameNumber(1, 1),
      end: getFrameNumber(1, 3),
    }),
    frameRate: 10,
    repeat: -1,
  });

  anims.create({
    key: `${NpcKeys.COBRA}-${AvatarAnimationKeys.WALK_SIDE}`,
    frames: anims.generateFrameNumbers(NpcKeys.COBRA, {
      start: getFrameNumber(2, 1),
      end: getFrameNumber(2, 3),
    }),
    frameRate: 10,
    repeat: -1,
  });

  anims.create({
    key: `${NpcKeys.COBRA}-${AvatarAnimationKeys.WALK_DOWN}`,
    frames: anims.generateFrameNumbers(NpcKeys.COBRA, {
      start: getFrameNumber(3, 1),
      end: getFrameNumber(3, 3),
    }),
    frameRate: 10,
    repeat: -1,
  });
};

export { createNpcAnims };
