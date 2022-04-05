import Phaser from 'phaser';

export default class SpeechBubble {
  private bubble!: Phaser.GameObjects.Graphics;
  private bubbleWidth!: number;
  private bubbleHeight!: number;
  private content!: Phaser.GameObjects.Text;
  private textStyle: Phaser.Types.GameObjects.Text.TextStyle;

  public offsetX = 0;
  public offsetY = 0;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    quote: string,
    textStyle: Phaser.Types.GameObjects.Text.TextStyle = {},
  ) {
    this.bubbleWidth = width;
    this.bubbleHeight = height;

    const defaultTextStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#000000',
      align: 'center',
    };
    this.textStyle = {
      ...defaultTextStyle,
      ...textStyle,
    };
    this.createSpeechBubble(scene, x, y, width, height, quote);
  }

  private createSpeechBubble(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    quote: string,
  ) {
    const bubbleWidth = width;
    const bubbleHeight = height;
    const bubblePadding = 10;
    const arrowHeight = bubbleHeight / 4;

    this.bubble = scene.add.graphics({
      x: x + this.offsetX,
      y: y + this.offsetY,
    });

    //  Bubble shadow
    this.bubble.fillStyle(0x222222, 0.5);
    this.bubble.fillRoundedRect(6, 6, bubbleWidth, bubbleHeight, 16);

    //  Bubble color
    this.bubble.fillStyle(0xffffff, 1);

    //  Bubble outline line style
    this.bubble.lineStyle(4, 0x565656, 1);

    //  Bubble shape and outline
    this.bubble.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);
    this.bubble.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);

    //  Calculate arrow coordinates
    const point1X = Math.floor(bubbleWidth / 7);
    const point1Y = bubbleHeight;
    const point2X = Math.floor((bubbleWidth / 7) * 2);
    const point2Y = bubbleHeight;
    const point3X = Math.floor(bubbleWidth / 7);
    const point3Y = Math.floor(bubbleHeight + arrowHeight);

    //  Bubble arrow shadow
    this.bubble.lineStyle(4, 0x222222, 0.5);
    this.bubble.lineBetween(point2X - 1, point2Y + 6, point3X + 2, point3Y);

    //  Bubble arrow fill
    this.bubble.fillTriangle(
      point1X,
      point1Y,
      point2X,
      point2Y,
      point3X,
      point3Y,
    );
    this.bubble.lineStyle(2, 0x565656, 1);
    this.bubble.lineBetween(point2X, point2Y, point3X, point3Y);
    this.bubble.lineBetween(point1X, point1Y, point3X, point3Y);

    this.content = scene.add.text(0, 0, quote, {
      wordWrap: { width: bubbleWidth - bubblePadding * 2 },
      ...this.textStyle,
    });

    this.setPosition(x, y);
  }

  setPosition(x: number, y: number): this {
    this.bubble.setPosition(x + this.offsetX, y + this.offsetY);

    const b = this.content.getBounds();
    this.content.setPosition(
      this.bubble.x + this.bubbleWidth / 2 - b.width / 2,
      this.bubble.y + this.bubbleHeight / 2 - b.height / 2,
    );
    return this;
  }

  setOffset(offsetX: number, offsetY: number): this {
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    return this;
  }

  setDepth(depth: number): this {
    this.bubble.setDepth(depth);
    this.content.setDepth(depth);
    return this;
  }

  destroy(): void {
    this.bubble.destroy();
    this.content.destroy();
  }

  setVisible(visible: boolean): this {
    this.bubble.setVisible(visible);
    this.content.setVisible(visible);
    return this;
  }
}
