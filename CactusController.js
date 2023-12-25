import Cactus from "./Cactus.js";

export default class CactusController {
  CACTUS_INTERVAL_MIN = 500;
  CACTUS_INTERVAL_MAX = 2000;

  nextCactus = null;

  cacti = [];

  constructor(ctx, cactImage, scaleRatio, speed) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.cactImage = cactImage;
    this.scaleRatio = scaleRatio;
    this.speed = speed;

    this.setNextCactus();
  }

  setNextCactus() {
    let num = this.getRandomNum(
      this.CACTUS_INTERVAL_MIN,
      this.CACTUS_INTERVAL_MAX
    );

    this.nextCactus = num;
  }

  getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  createCactus() {
    let index = this.getRandomNum(0, this.cactImage.length - 1);
    let cactusImageFromArray = this.cactImage[index];

    const x = this.canvas.width * 1.5;
    const y = this.canvas.height - cactusImageFromArray.height;
    const cactusFromClass = new Cactus(
      this.ctx,
      x,
      y,
      cactusImageFromArray.width,
      cactusImageFromArray.height,
      cactusImageFromArray.image
    );

    this.cacti.push(cactusFromClass);
  }

  update(gameSpeed, frameTimeDelta) {
    if (this.nextCactus <= 0) {
      // create a cactus
      this.createCactus();
      this.setNextCactus();
    }
    this.nextCactus -= frameTimeDelta;

    this.cacti.forEach((cactus) =>
      cactus.update(this.speed, gameSpeed, frameTimeDelta, this.scaleRatio)
    );

    this.cacti = this.cacti.filter((cactus) => cactus.x > -cactus.width);
  }

  draw() {
    this.cacti.forEach((cactus) => cactus.draw());
  }

  collide(player) {
    return this.cacti.some((cactus) => cactus.collide(player));
  }

  reset() {
    this.cacti = [];
  }
}
