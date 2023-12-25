export default class Ground {
  constructor(ctx, width, height, speed, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.scaleRatio = scaleRatio;

    this.x = 0;
    this.y = this.canvas.height - this.height;

    this.groundImg = new Image();
    this.groundImg.src = "images/ground.png";
  }

  draw() {
    this.ctx.drawImage(this.groundImg, this.x, this.y, this.width, this.height);
    this.ctx.drawImage(
      this.groundImg,
      this.x + this.width,
      this.y,
      this.width,
      this.height
    );

    if (this.x < -this.width) {
      this.x = 0;
    }
  }

  update(gameSpeed, frameTimeDelta) {
    this.x -= gameSpeed * frameTimeDelta * this.speed * this.scaleRatio;
  }

  reset() {
    this.x = 0;
  }
}
