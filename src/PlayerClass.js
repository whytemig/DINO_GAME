export default class Player {
  walk_Animation_Timer = 200;
  walkAnimationTimer = this.walk_Animation_Timer;
  dinorumImgs = [];

  // JUMPING PHYSICS
  jumpPressed = false;
  jumpProgress = false;
  falling = false;
  JUMP_SPEED = 0.6;
  GRAVITY = 0.4;

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
    this.ystandingPosition = this.y;

    //DINO IMAGES 1.STANDING, 2.WALKING****************************
    this.standingStillPlayer = new Image();
    this.standingStillPlayer.src = "images/standing_still.png";
    this.image = this.standingStillPlayer;
    const dinoRunImgOne = new Image();
    dinoRunImgOne.src = "images/dino_run1.png";
    const dinoRunImgTwo = new Image();
    dinoRunImgTwo.src = "images/dino_run2.png";

    this.dinorumImgs.push(dinoRunImgOne, dinoRunImgTwo);

    // PRESSING THE SPACE BAR TO JUMP THE DINO******************
    window.removeEventListener("keydown", this.keydown);
    window.removeEventListener("keyup", this.keyup);

    window.addEventListener("keydown", this.keydown);
    window.addEventListener("keyup", this.keyup);

    //TOUCH START TOUCHING FOR PHONES***************************
    window.removeEventListener("touchstart", this.touchstart);
    window.removeEventListener("touchend", this.touchend);

    window.addEventListener("touchstart", this.touchstart);
    window.addEventListener("touchend", this.touchend);
  }

  touchstart = () => (this.jumpPressed = true);
  touchend = () => (this.jumpPressed = false);

  keydown = (e) => {
    e.code === "Space" ? (this.jumpPressed = true) : "";
  };
  keyup = (e) => {
    e.code === "Space" ? (this.jumpPressed = false) : "";
  };

  draw() {
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  update(gameSpeed, frameTimeDelta) {
    // console.log(this.jumpPressed);
    this.run(gameSpeed, frameTimeDelta);
    if (this.jumpProgress) {
      this.image = this.standingStillPlayer;
    }

    this.jump(frameTimeDelta);
  }

  jump(frameTimeDelta) {
    if (this.jumpPressed) this.jumpProgress = true;

    if (this.jumpPressed && !this.falling) {
      if (
        this.y > this.canvas.height - this.minJumpHeight ||
        (this.y > this.canvas.height - this.maxJumpHeight && this.jumpPressed)
      ) {
        this.y -= this.JUMP_SPEED * frameTimeDelta * this.scaleRatio;
      } else {
        this.falling = true;
      }
    } else {
      if (this.y < this.ystandingPosition) {
        this.y += this.GRAVITY * frameTimeDelta * this.scaleRatio;
        if (this.y + this.height > this.canvas.height) {
          this.y = this.ystandingPosition;
        }
      } else {
        this.falling = false;
        this.jumpProgress = false;
      }
    }
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
