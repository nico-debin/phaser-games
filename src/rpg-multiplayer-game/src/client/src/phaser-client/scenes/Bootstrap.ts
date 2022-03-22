import Phaser from "phaser";
import FontKeys from "../consts/FontKeys";
import SceneKeys from "../consts/SceneKeys";

export default class Bootstrap extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Bootstrap);
  }

  preload() {
    this.load.bitmapFont(FontKeys.GEM, 'fonts/bitmap/gem.png', 'fonts/bitmap/gem.xml')
  }

  create() {
    this.cameras.main.setBackgroundColor('#000000');

    const x = this.scale.width * 0.5;
    const y = this.scale.height * 0.5;

    this.add.bitmapText(x, y, FontKeys.GEM, 'Connecting to server...', 34).setTint(0xffffff).setOrigin(0.5, 0.5);

    this.scene.launch(SceneKeys.Preloader)
  }
}
