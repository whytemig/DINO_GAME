import Player from "./PlayerClass.js";
import Ground from "./GroundClass.js";
import CactusController from "./CactusController.js";
import Score from "./Score.js";

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

// GAME SPEED
const gameStartSpeed = 1;
const gameSpeedIncrement = 0.0001;

// GAME SCREEN
const GAMEHEIGHT = 200;
const GAMEWIDTH = 800;
// PLAYER DINO IMAGE
const playerWidth = 88 / 1.5;
const playerHeight = 94 / 1.5;
const playerMaxJumpHeight = GAMEHEIGHT;
const playerMinJumpHeight = 150;
// ground width and height
const groundWidth = 2400;
const groundHeight = 24;
const groundAndCatusSpeed = 0.5;

// Catcus images
const CACTUS_CONFIG = [
  {
    width: 48 / 1.5,
    height: 100 / 1.5,
    image: "images/cactus_1.png",
  },
  {
    width: 98 / 1.5,
    height: 100 / 1.5,
    image: "images/cactus_2.png",
  },
  {
    width: 68 / 1.5,
    height: 70 / 1.5,
    image: "images/cactus_3.png",
  },
];

// GAME OBJECTS******************
let player = null;
let ground = null;
let cactcontroller = null;
let scaleRatio = null;
//variable to calculate the frame time
let previousTime = null;
let gameSpeed = gameStartSpeed;
let gameOver = false;
let addAnEventListener = false;
let waitingToStart = true;
let score = null;

//FUNCTIONS*********************************************************

//CREATE ITEMS ON CANVAS FUNCTION*****************************************
function createSprites() {
  const playerIngameWidth = playerWidth * scaleRatio;
  const playerIngameheight = playerHeight * scaleRatio;
  const minJumpHeightInGame = playerMinJumpHeight * scaleRatio;
  const maxJumpHeightInGame = playerMaxJumpHeight * scaleRatio;

  const groundWidthInGame = groundWidth * scaleRatio;
  const groundHeightInGame = groundHeight * scaleRatio;

  player = new Player(
    ctx,
    playerIngameheight,
    playerIngameWidth,
    minJumpHeightInGame,
    maxJumpHeightInGame,
    scaleRatio
  );
  ground = new Ground(
    ctx,
    groundWidthInGame,
    groundHeightInGame,
    groundAndCatusSpeed,
    scaleRatio
  );

  const cactImages = CACTUS_CONFIG.map((cacti) => {
    const image = new Image();
    image.src = cacti.image;

    return {
      image,
      width: cacti.width * scaleRatio,
      height: cacti.height * scaleRatio,
    };
  });

  cactcontroller = new CactusController(
    ctx,
    cactImages,
    scaleRatio,
    groundAndCatusSpeed
  );

  score = new Score(ctx, scaleRatio);
}

function setScreen() {
  scaleRatio = getScaleRatio();
  canvas.width = GAMEWIDTH * scaleRatio;
  canvas.height = GAMEHEIGHT * scaleRatio;
  createSprites();
}

setScreen();
//use a setTimeout for Safari mobile rotation
window.addEventListener("resize", () => setTimeout(setScreen, 300));

//screen orientation
if (screen.orientation) {
  screen.orientation.addEventListener("change", setScreen);
}

// function adjust the size of the game reqardless of the view screen of the window.
function getScaleRatio() {
  const screenHeight = Math.min(
    window.innerHeight,
    document.documentElement.clientHeight
  );
  const screenWidth = Math.min(
    window.innerWidth,
    document.documentElement.clientWidth
  );

  if (screenWidth / screenHeight < GAMEWIDTH / GAMEHEIGHT) {
    return screenWidth / GAMEWIDTH;
  } else {
    screenHeight / GAMEHEIGHT;
  }
}
// DRAW ON CANVAS FUNCTION*********************************************
function clearScreen() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// GAME OVER FUNCTION****************************************************
function showGameOver() {
  const fontSize = 70 * scaleRatio;
  ctx.font = `${fontSize}px Roboto`;
  ctx.fillStyle = "grey";
  const x = canvas.width / 4.5;
  const y = canvas.height / 2;
  ctx.fillText("Game Over 😭", x, y);
}

// RESET GAME************************************************************
function gameResetFunc() {
  if (!addAnEventListener) {
    addAnEventListener = true;

    setTimeout(() => {
      window.addEventListener("keyup", resetGame, { once: true });
      window.addEventListener("touchstart", resetGame, { once: true });
    }, 1500);
  }
}
//RESET GAME FUNCTION *****************************************************
function resetGame() {
  addAnEventListener = false;
  gameOver = false;
  waitingToStart = false;
  ground.reset();
  cactcontroller.reset();
  score.reset();
  gameSpeed = gameStartSpeed;
}
//SHOW GAME TEXT ***********************************************************
function showStartGameText() {
  const fontSize = 40 * scaleRatio;
  ctx.font = `${fontSize}px Roboto`;
  ctx.fillStyle = "grey";
  const x = canvas.width / 5;
  const y = canvas.height / 2;
  ctx.fillText("Press Space or Screen to Start", x, y);
}
//CHANGE GAME SPEED AS YOU PLAY*********************************************

function changeGameSpeed(frameTimeDelta) {
  gameSpeed += frameTimeDelta * gameSpeedIncrement;
}

// GAME LOOP*************************************************************
function gameLoop(currentTime) {
  if (!previousTime) {
    previousTime = currentTime;
    requestAnimationFrame(gameLoop);
    return;
  }
  const frameTimeDelta = currentTime - previousTime;
  previousTime = currentTime;
  clearScreen();
  //UPDATING THE GAME OBJECTS******* if statement for game over using a boolean
  if (!gameOver && !waitingToStart) {
    ground.update(gameSpeed, frameTimeDelta);
    cactcontroller.update(gameSpeed, frameTimeDelta);
    player.update(gameSpeed, frameTimeDelta);
    score.update(frameTimeDelta);
    changeGameSpeed(frameTimeDelta);
  }

  if (!gameOver && cactcontroller.collide(player)) {
    gameOver = true;
    gameResetFunc();
    score.setHighScore();
  }

  //DRAW GAME OBJECTS**********************************************************
  ground.draw();
  cactcontroller.draw();
  player.draw();
  score.draw();

  if (gameOver) {
    showGameOver();
  }

  if (waitingToStart) {
    showStartGameText();
  }

  // GAME LOOP FUNCTION TRICK**************************************************
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

window.addEventListener("keyup", resetGame, { once: true });
window.addEventListener("touchstart", resetGame, { once: true });
