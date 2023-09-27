import Phaser from 'phaser';
import { gameState } from '../states/GameState';
import UIButton from './UIButton';

export default class UIAdminButton extends UIButton {
  protected createButton(
    iconTexture: string | Phaser.Textures.Texture,
    iconFrame: string | number | undefined,
  ): void {
    super.createButton(iconTexture, iconFrame);

    // Red tint
    this.button.setTint(0xd9534f);

    // Hide if not in admin mode
    if (!gameState.isAdminMode()) {
      super.setVisible(false);
    }
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

  /**
   * Enables visibility only if game is running in admin mode (force hide if not in admin mode)
   * @param visible
   * @returns
   */
  public setVisible(visible: boolean): this {
    if (gameState.isAdminMode()) {
      super.setVisible(visible);
    } else {
      super.setVisible(false);
    }
    return this;
  }
}
