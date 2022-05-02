import Phaser from "phaser";
import { SceneKeys, TextureKeys } from "../consts";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super({ key: SceneKeys.Preloader });
  }

  preload() {
    this.load.setBaseURL("https://labs.phaser.io");

    this.load.image(TextureKeys.SKY, "assets/skies/space3.png");
    this.load.image(TextureKeys.LOGO, "assets/sprites/phaser3-logo.png");
    this.load.image(TextureKeys.RED, "assets/particles/red.png");
  }

  create() {
    this.scene.start(SceneKeys.HelloWorld);
  }
}
