import Phaser from 'phaser';
import UIButton from './UIButton';

export default class UIAdminButton extends UIButton {
  protected createButton(
    iconTexture: string | Phaser.Textures.Texture,
    iconFrame: string | number | undefined,
  ): void {
    super.createButton(iconTexture, iconFrame);
    this.button.setTint(0xd9534f);
  }

  protected setInteraction(): void {
    super.setInteraction();

    // Remove parent listeners
    this.removeAllListeners();

    this.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
      this.button.setTint(0xae423f);
    })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
        this.button.setTint(0xd9534f);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
        this.button.setTint(0xc34b47);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        this.button.setTint(0xd9534f);
        this.onInteraction();
      });
  }
}
