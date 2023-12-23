import Player from "./PlayerClass.js";
import Ground from "./GroundClass.js";

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

// GAME SPEED
const gameStartSpeed = 0.75;
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

// GAME OBJECTS
let player = null;
let ground = null;

let scaleRatio = null;
//variable to calculate the frame time
let previousTime = null;
let gameSpeed = gameStartSpeed;

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

function clearScreen() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// GAME LOOP
function gameLoop(currentTime) {
  if (!previousTime) {
    previousTime = currentTime;
    requestAnimationFrame(gameLoop);
    return;
  }
  const frameTimeDelta = currentTime - previousTime;
  previousTime = currentTime;
  clearScreen();
  //UPDATING THE GAME OBJECTS
  ground.update(gameSpeed, frameTimeDelta);
  player.update(gameSpeed, frameTimeDelta);

  //DRAW GAME OBJECTS
  ground.draw();
  player.draw();
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
