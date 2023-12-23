export default class Player {
  walk_Animation_Timer = 200;
  walkAnimationTimer = this.walk_Animation_Timer;
  dinorumImgs = [];

  constructor(ctx, height, width, minJumpHeight, maxJumpHeight, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.height = height;
    this.width = width;
    this.minJumpHeight = minJumpHeight;
    this.maxJumpHeight = maxJumpHeight;
    this.scaleRatio = scaleRatio;

    this.x = 10 * scaleRatio;
    this.y = this.canvas.height - this.height - 1.5 * scaleRatio;

    this.standingStillPlayer = new Image();
    this.standingStillPlayer.src = "images/standing_still.png";
    this.image = this.standingStillPlayer;
    const dinoRunImgOne = new Image();
    dinoRunImgOne.src = "images/dino_run1.png";
    const dinoRunImgTwo = new Image();
    dinoRunImgTwo.src = "images/dino_run2.png";

    this.dinorumImgs.push(dinoRunImgOne, dinoRunImgTwo);
  }

  draw() {
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  update(gameSpeed, frameTimeDelta) {
    this.run(gameSpeed, frameTimeDelta);
  }

  run(gameSpeed, frameTimeDelta) {
    if (this.walkAnimationTimer <= 0) {
      if (this.image === this.dinorumImgs[0]) {
        this.image = this.dinorumImgs[1];
      } else {
        this.image = this.dinorumImgs[0];
      }
      this.walkAnimationTimer = this.walk_Animation_Timer;
    }

    this.walkAnimationTimer -= frameTimeDelta * gameSpeed;
  }
}
