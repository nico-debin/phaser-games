import Phaser from 'phaser';
import SceneKeys from '../consts/SceneKeys';
import TextureKeys from '../consts/TextureKeys';

export default class CobraCutScene extends Phaser.Scene {
  private graphics!: Phaser.GameObjects.Graphics;
  private follower!: any;
  private path!: Phaser.Curves.Path;
  private spotlight!: Phaser.GameObjects.Light

  constructor() {
    super({ key: SceneKeys.CobraCutScene })
  }

  preload() {
    this.load.image(TextureKeys.CobraLogo, ['effects/cobra-logo-372x500.png', 'effects/cobra-logo-372x500_n.png'])
  }

  create() {
    if (this.renderer.type !== Phaser.WEBGL) {
      this.startNextScene();
      return;
    };

    const x = this.scale.width * 0.5;
    const y = this.scale.height * 0.5;

    this.cameras.main.fadeIn(3000);

    this.add.sprite(x, y, TextureKeys.CobraLogo).setOrigin(0.5).setPipeline('Light2D');

    this.lights.enable();
    this.lights.setAmbientColor(0x202020);

    this.spotlight = this.lights.addLight(0, 0, 280).setIntensity(3);

    const leftEyeLight = this.lights.addLight(322, 252, 32, 0xff0000).setIntensity(0);
    const rightEyeLight = this.lights.addLight(392, 252, 32, 0xff0000).setIntensity(0);

    const cobraRedLight = this.lights.addLight(350, 580, 280, 0xff0000).setIntensity(0);
    

    const redLightsFadeInTween = this.tweens.addCounter({
      from: 0,
      to: 25,
      duration: 3000,
      ease: Phaser.Math.Easing.Expo.InOut,
      onUpdate: (tween) => {
        const value = Math.floor(tween.getValue());
        leftEyeLight.setIntensity(value);
        rightEyeLight.setIntensity(value);
        cobraRedLight.setIntensity(value/10);
      },
      onComplete: () => {
        this.time.delayedCall(2000, this.startNextScene, undefined, this);
      },
      paused: true,
    });

    const fadeOutCobraLightTween = this.tweens.addCounter({
      from: 100,
      to: 0,
      duration: 3000,
      ease: Phaser.Math.Easing.Expo.Out,
      onUpdate: (tween) => {
        const value = Math.floor(tween.getValue());
        this.spotlight.setIntensity(3 * (value/100));
      },
      paused: true,
    });
    
    // Create path to be followed by the light
    this.createLightPath();

    this.tweens.add({
      targets: this.follower,
      t: 1,
      ease: Phaser.Math.Easing.Sine.InOut,
      duration: 6000,
      onComplete: () => {
        fadeOutCobraLightTween.play();
        redLightsFadeInTween.play();
      },
    });
  }

  update(): void {
    this.updateLightPosition();
  }

  private createLightPath(): void {
    this.graphics = this.add.graphics();
    this.follower = { t: 0, vec: new Phaser.Math.Vector2() };

    this.path = new Phaser.Curves.Path();
    // this.path.add(new Phaser.Curves.Ellipse(500, 300, 250, 300));
    // this.path.add(new Phaser.Curves.Ellipse(300, 300, 250, 300));
    this.path.add(new Phaser.Curves.Ellipse(400, 300, 250, 300, 45, 360+45));
    // this.path.add(new Phaser.Curves.Ellipse(400, 300, 250, 300, 45, 360+45));
    this.path.add(new Phaser.Curves.Ellipse(400, 300, 250, 300, 45, 180));
  }

  private updateLightPosition(): void {
    this.graphics.clear();
    this.graphics.lineStyle(2, 0xffffff, 1);

    // this.path.draw(this.graphics);

    this.path.getPoint(this.follower.t, this.follower.vec);

    // this.graphics.fillStyle(0xff0000, 1);
    // this.graphics.fillCircle(this.follower.vec.x, this.follower.vec.y, 12);

    this.spotlight.setPosition(this.follower.vec.x, this.follower.vec.y);
  }

  private startNextScene(): void {
    this.scene.start(SceneKeys.Bootstrap)
  }
}