import Phaser from "phaser";
import { SceneKeys, TextureKeys } from "../consts/";

export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    super({ key: SceneKeys.HelloWorld });
  }

  create() {
    this.add.image(400, 300, TextureKeys.SKY);

    const particles = this.add.particles(TextureKeys.RED);

    const emitter = particles.createEmitter({
      speed: 100,
      scale: { start: 1, end: 0 },
      blendMode: "ADD"
    });

    const logo = this.physics.add.image(400, 100, TextureKeys.LOGO);

    logo.setVelocity(100, 200);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);

    emitter.startFollow(logo);
  }
}
