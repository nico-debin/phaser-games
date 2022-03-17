import Phaser from 'phaser'
import AvatarAnimationKeys from '../consts/AvatarAnimationKeys';
import AvatarKeys from "../consts/AvatarKeys";

const getFrameNumber = (row, col): number => (row - 1) * 13 + (col - 1);

export class AnimationHandler {
  private static readonly frameRate: number = 10;
	private static avatars: Set<AvatarKeys> = new Set();
	
	public static add(scene: Phaser.Scene, avatar: AvatarKeys): void {
		// add animations for each avatar only once
		if (this.avatars.has(avatar)) {
			return;
		}
		this.avatars.add(avatar);

    scene.anims.create({
      key: `${avatar}-${AvatarAnimationKeys.IDLE_DOWN}`,
      frames: [{ key: avatar, frame: getFrameNumber(3, 1) }],
    })

    scene.anims.create({
      key: `${avatar}-${AvatarAnimationKeys.IDLE_UP}`,
      frames: [{ key: avatar, frame: getFrameNumber(5, 1) }],
    })
  
    scene.anims.create({
      key: `${avatar}-${AvatarAnimationKeys.IDLE_SIDE}`,
      frames: [{ key: avatar, frame: getFrameNumber(4, 1) }],
    })

    scene.anims.create({
      key: `${avatar}-${AvatarAnimationKeys.WALK_DOWN}`,
      frames: scene.anims.generateFrameNumbers(avatar, { start: getFrameNumber(11, 2), end: getFrameNumber(11, 9) }),
      frameRate: 10,
      repeat: -1
    })
  
    scene.anims.create({
      key: `${avatar}-${AvatarAnimationKeys.WALK_UP}`,
      frames: scene.anims.generateFrameNumbers(avatar, { start: getFrameNumber(9, 2), end: getFrameNumber(9, 9) }),
      frameRate: 10,
      repeat: -1
    })
  
    scene.anims.create({
      key: `${avatar}-${AvatarAnimationKeys.WALK_SIDE}`,
      frames: scene.anims.generateFrameNumbers(avatar, { start: getFrameNumber(12, 2), end: getFrameNumber(12, 9) }),
      frameRate: 10,
      repeat: -1
    })

    scene.anims.create({
      key: `${avatar}-${AvatarAnimationKeys.SHOOT_DOWN}`,
      frames: scene.anims.generateFrameNumbers(avatar, { start: getFrameNumber(19, 1), end: getFrameNumber(19, 11) }),
      frameRate: 40,
    })
  
    scene.anims.create({
      key: `${avatar}-${AvatarAnimationKeys.SHOOT_UP}`,
      frames: scene.anims.generateFrameNumbers(avatar, { start: getFrameNumber(17, 1), end: getFrameNumber(17, 11) }),
      frameRate: 40,
    })
  
    scene.anims.create({
      key: `${avatar}-${AvatarAnimationKeys.SHOOT_SIDE}`,
      frames: scene.anims.generateFrameNumbers(avatar, { start: getFrameNumber(20, 1), end: getFrameNumber(20, 11) }),
      frameRate: 40,
    })
  
    scene.anims.create({
      key: `${avatar}-${AvatarAnimationKeys.WINNER}`,
      frames: scene.anims.generateFrameNumbers(avatar, { start: getFrameNumber(3, 1), end: getFrameNumber(3, 7) }),
      frameRate: 7,
      repeat: -1,
    })
  
    scene.anims.create({
      key: `${avatar}-${AvatarAnimationKeys.DIE}`,
      frames: scene.anims.generateFrameNumbers(avatar, { start: getFrameNumber(21, 1), end: getFrameNumber(21, 6) }),
      frameRate: 10,
    })
  }
}