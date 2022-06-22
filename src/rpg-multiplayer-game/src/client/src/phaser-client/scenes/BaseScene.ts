import Phaser from 'phaser';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

export default class BaseScene extends Phaser.Scene {
  public rexUI!: RexUIPlugin;
}
