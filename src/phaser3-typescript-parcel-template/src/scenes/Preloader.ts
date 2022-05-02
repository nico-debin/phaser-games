import Phaser from "phaser";
import { SceneKeys, TextureKeys } from "../consts";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super({ key: SceneKeys.Preloader });
  }

  preload() {
    this.load.image(TextureKeys.LOGO, "./phaser3-logo.png");
    this.load.image(TextureKeys.SKY, "https://labs.phaser.io/assets/skies/space3.png");
    this.load.image(TextureKeys.RED, "https://labs.phaser.io/assets/particles/red.png");
  }

  create() {
    this.scene.start(SceneKeys.HelloWorld);
  }
}
