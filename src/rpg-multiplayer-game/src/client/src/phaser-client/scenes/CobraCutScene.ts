import Phaser from 'phaser';
import SceneKeys from '../consts/SceneKeys';
import TextureKeys from '../consts/TextureKeys';

interface Follower {
  t: number;
  vector: Phaser.Math.Vector2;
}

export default class CobraCutScene extends Phaser.Scene {
  private lightFollower!: Follower;
  private path!: Phaser.Curves.Path;
  private spotlight!: Phaser.GameObjects.Light;

  constructor() {
    super({ key: SceneKeys.CobraCutScene });
  }

  preload() {
    this.load.image(TextureKeys.CobraLogo, [
      'effects/cobra-logo-372x500.png',
      'effects/cobra-logo-372x500_n.png',
    ]);
  }

  create() {
    this.startNextScene(); return;
    if (this.renderer.type !== Phaser.WEBGL) {
      this.startNextScene();
      return;
    }

    const x = this.scale.width * 0.5;
    const y = this.scale.height * 0.5;

    // Camera starts black and fades in
    this.cameras.main.fadeIn(3000);

    // Cobra logo
    this.add
      .sprite(x, y, TextureKeys.CobraLogo)
      .setOrigin(0.5)
      .setPipeline('Light2D');

    // Enable light plugin
    this.lights.enable();
    this.lights.setAmbientColor(0x202020);

    // Main light
    this.spotlight = this.lights.addLight(0, 0, 280).setIntensity(3);

    // Eyes light
    const leftEyeLight = this.lights
      .addLight(322, 252, 32, 0xff0000)
      .setIntensity(0);
    const rightEyeLight = this.lights
      .addLight(392, 252, 32, 0xff0000)
      .setIntensity(0);

    // Red light
    const cobraRedLight = this.lights
      .addLight(350, 580, 280, 0xff0000)
      .setIntensity(0);

    // Create path to be followed by the light
    this.createLightPath();

    // Tween for the main light to follow the path
    this.tweens.add({
      targets: this.lightFollower,
      t: 1,
      ease: Phaser.Math.Easing.Sine.InOut,
      duration: 6000,
      onComplete: () => {
        fadeOutCobraLightTween.play();
        redLightsFadeInTween.play();
      },
    });

    // Fade in red lights tween
    const redLightsFadeInTween = this.tweens.addCounter({
      from: 0,
      to: 25,
      duration: 3000,
      ease: Phaser.Math.Easing.Expo.InOut,
      onUpdate: (tween) => {
        const value = Math.floor(tween.getValue());
        leftEyeLight.setIntensity(value);
        rightEyeLight.setIntensity(value);
        cobraRedLight.setIntensity(value / 10);
      },
      onComplete: () => {
        this.time.delayedCall(2000, this.startNextScene, undefined, this);
      },
      paused: true,
    });

    // Fade out main light tween
    const fadeOutCobraLightTween = this.tweens.addCounter({
      from: 100,
      to: 0,
      duration: 3000,
      ease: Phaser.Math.Easing.Expo.Out,
      onUpdate: (tween) => {
        const value = Math.floor(tween.getValue());
        this.spotlight.setIntensity(3 * (value / 100));
      },
      paused: true,
    });
  }

  update(): void {
    this.updateLightPosition();
  }

  private createLightPath(): void {
    this.lightFollower = { t: 0, vector: new Phaser.Math.Vector2() };

    this.path = new Phaser.Curves.Path();
    this.path.add(new Phaser.Curves.Ellipse(400, 300, 250, 300, 45, 360 + 45));
    this.path.add(new Phaser.Curves.Ellipse(400, 300, 250, 300, 45, 180));
  }

  private updateLightPosition(): void {
    this.path.getPoint(this.lightFollower.t, this.lightFollower.vector);
    this.spotlight.setPosition(
      this.lightFollower.vector.x,
      this.lightFollower.vector.y,
    );
  }

  private startNextScene(): void {
    this.scene.start(SceneKeys.Bootstrap);
    this.lights.destroy();
  }
}
