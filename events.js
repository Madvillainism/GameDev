const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const titleScreen = document.getElementById("title-screen");
const instructionsDialog = document.getElementById("how-to");
const instructionsButton = document.getElementById("instructions-button");
const closeInstructions = document.getElementById("close-instructions");
const carSelect = document.getElementById("carousel");
const gameWrapper = document.getElementById("game-wrapper");
const gameOverOverlay = document.getElementById("game-over-overlay");
const gameOverTitle = document.getElementById("game-over-title");
const gameOverScore = document.getElementById("game-over-score");
const gameOverRestart = document.getElementById("game-over-restart");

const btnLeft = document.getElementById("btn-left");
const btnRight = document.getElementById("btn-right");
const btnUp = document.getElementById("btn-up");
const btnDown = document.getElementById("btn-down");
const btnPause = document.getElementById("btn-pause");

const inputState = { up: false, down: false, left: false, right: false };

function stopAudio(audio) {
  audio.pause();
  audio.currentTime = 0;
}

function triggerGameOver(title, message) {
  pause = true;
  bgMusic.pause();
  gameOverTitle.textContent = title;
  gameOverScore.textContent = message;
  gameOverOverlay.style.display = "flex";
}

function goSelect() {
  titleScreen.style.display = "none";
  carSelect.style.display = "block";
  garageMusic.play();
}

function goInstructions() {
  ;
}

instructionsButton.addEventListener("click", () => {
  instructionsDialog.showModal();
});

closeInstructions.addEventListener("click", () => {
  instructionsDialog.close();
});

function startGame(car) {
  carSelect.style.display = "none";
  garageMusic.pause();
  Carro.src = car;
  gameWrapper.style.display = "block";
  canvas.style.display = "block";
  bgMusic.play();
}

gameOverRestart.addEventListener("click", () => {
  gameOverOverlay.style.display = "none";
  resetGame();
});

const gameOver = new Audio("explosion.wav");
const holeFall = new Audio("holefall.wav");
const bgMusic = new Audio("bg-music.mp3");
const garageMusic = new Audio("garage-music.mp3");
bgMusic.currentTime = 3;

let redCar = "redcar.png";
let altheus = "A.png";
let matiz = "matiz.png"
let moto = "moto.png"

let xCarro = canvas.width / 4;
let yCarro = canvas.height - 250;
let carWidth = 80;
let carHeight = 90;
let ySpeed = 0;
let acceleration = -0.1;
let steeringAngle = 0;
let maxSteeringAngle = Math.PI / 6;
const Carro = new Image();

let pause = true;

document.addEventListener("keydown", function (event) {
  if (event.key === "p" || event.key === "P") {
    pause = !pause;
    start = null;
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" || event.key === "ESCAPE") {
    pause = true;
    titleScreen.style.display = "block";
    carSelect.style.display = "none";
    canvas.style.display = "none";
    gameWrapper.style.display = "none";
    stopAudio(bgMusic);
  }
});

let holeWidth = 70;
let holeHeight = 70;
let holeSpeed = 5;
let xHole = Math.random() * (canvas.width - holeWidth);
let yHole = -70;
const Hole = new Image();
Hole.src = "hole.png";

let poleWidth = 80;
let poleHeight = 70;
let poleSpeed = 6;
let xPost = Math.random() * (canvas.width - poleWidth + 5);
let yPost = -80;
const Pole = new Image();
Pole.src = "pole.png";

function drawPause() {
  ctx.font = "16px Baskerville";
  ctx.fillStyle = "#000";
  ctx.fillText("PAUSED GAME", 50, canvas.height / 2);
}

let start = true;

function drawStart() {
  ctx.font = "16px Baskerville";
  ctx.fillStyle = "#000";
  ctx.fillText("PRESS P TO START ROLLING", 70, canvas.height / 2);
}

function resetGame() {
  xCarro = canvas.width / 4;
  yCarro = canvas.height - 250;
  carWidth = 80;
  carHeight = 90;
  ySpeed = 0;
  acceleration = -0.1;
  steeringAngle = 0;
  maxSteeringAngle = Math.PI / 6;

  holeWidth = 80;
  holeHeight = 70;
  holeSpeed = 5;
  xHole = Math.random() * (canvas.width - holeWidth);
  yHole = -70;

  poleWidth = 70;
  poleHeight = 70;
  poleSpeed = 5;
  xPost = Math.random() * (canvas.width - holeWidth);
  yPost = -70;

  score = 0;

  bgMusic.currentTime = 3;
  bgMusic.play();
}

function vroom() {
  if (inputState.up) {
    acceleration = -0.2;
  } else if (inputState.down) {
    acceleration = 0.2;
  } else {
    acceleration = -0.1;
  }

  if (inputState.left) {
    steeringAngle = maxSteeringAngle;
  } else if (inputState.right) {
    steeringAngle = -maxSteeringAngle;
  } else {
    steeringAngle = 0;
  }

  ySpeed += acceleration;
  yCarro += ySpeed;
  if (yCarro > canvas.height - carHeight) {
    ySpeed = 0;
    acceleration = -0.1;
    yCarro = canvas.height - carHeight;
    triggerGameOver("CUTUPLUN!", "You crashed into the bottom!");
    resetGame();
  } else if (yCarro < 0) {
    ySpeed = 0;
    acceleration = -0.1;
    yCarro = 0;
    bgMusic.pause();
    gameOver.play();
    triggerGameOver("GAME OVER", "You crashed PIMPUMPAM!");
    resetGame();
  }
  xCarro += ySpeed * Math.tan(steeringAngle);
  xCarro = Math.max(xCarro, 0);
  xCarro = Math.min(xCarro, canvas.width - carWidth);

  stripePosition -= ySpeed;
  if (stripePosition < -40) {
    stripePosition += 40;
  }
}

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") {
    inputState.up = true;
    vroom();
  } else if (event.key === "ArrowDown") {
    inputState.down = true;
  } else if (event.key === "ArrowLeft") {
    inputState.left = true;
  } else if (event.key === "ArrowRight") {
    inputState.right = true;
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key === "ArrowUp") {
    inputState.up = false;
  } else if (event.key === "ArrowDown") {
    inputState.down = false;
  } else if (event.key === "ArrowLeft") {
    inputState.left = false;
  } else if (event.key === "ArrowRight") {
    inputState.right = false;
  }
});

function bindTouchButton(btn, stateKey) {
  btn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    inputState[stateKey] = true;
    if (stateKey === "up") vroom();
  }, { passive: false });

  btn.addEventListener("touchend", (e) => {
    e.preventDefault();
    inputState[stateKey] = false;
  }, { passive: false });

  btn.addEventListener("touchcancel", (e) => {
    e.preventDefault();
    inputState[stateKey] = false;
  }, { passive: false });
}

bindTouchButton(btnUp, "up");
bindTouchButton(btnDown, "down");
bindTouchButton(btnLeft, "left");
bindTouchButton(btnRight, "right");

btnPause.addEventListener("touchstart", (e) => {
  e.preventDefault();
  pause = !pause;
  start = null;
}, { passive: false });

let score = 0;
let holeTouched = false;
let setScore = false;

function drawScore() {
  if (holeTouched) {
    ctx.font = "45px Baskerville";
    ctx.fillStyle = "#fafafa";
    ctx.fillText("+100", 20, 20);
    setTimeout(() => {
      ctx.clearRect(20, 20, 50, 35);
      holeTouched = false;
    }, 1000);
  }
  ctx.font = "45px Baskerville";
  ctx.fillStyle = "#fff";
  ctx.fillText("Score: " + score, 150, 30);
}

let stripePosition = 0;

function drawStripes() {
  ctx.fillStyle = "#fff";
  for (let i = stripePosition; i < canvas.height; i += 40) {
    ctx.fillRect(canvas.width / 2 - 5, i, 10, 20);
  }
  ctx.fillStyle = "#bdbf24";
  for (let i = stripePosition; i < canvas.height; i += 120) {
    ctx.fillRect(canvas.width / 2 - 5, i, 10, 60);
  }
}

function holeSpawn() {
  yHole += holeSpeed;
  if (yHole > canvas.height - holeHeight) {
    yHole = -holeHeight;
    xHole = Math.random() * (canvas.width - holeWidth);
    if (score > 500) {
      holeWidth = 50;
      holeSpeed = 7;
    }
  }
}

function poleSpawn() {
  yPost += poleSpeed;
  if (yPost > canvas.height - poleHeight) {
    yPost = -poleHeight;
    xPost = Math.random() * (canvas.width - holeWidth);
    if (score > 500) {
      poleWidth = 90;
      poleSpeed = 4;
    }
  }
}

function detectPole() {
  if (
    score > 500 &&
    xCarro < xPost + poleWidth / 1.5 &&
    xCarro + carWidth / 2 > xPost &&
    yCarro < yPost + poleHeight / 2 &&
    yCarro + carHeight / 2 > yPost
  ) {
    bgMusic.pause();
    holeFall.play();
    triggerGameOver("CRASHHHH!!!!", "Quedaste a pie :C");
    resetGame();
  } else if (
    xCarro < xPost + poleWidth / 2 &&
    xCarro + carWidth / 2 > xPost &&
    yCarro < yPost + poleHeight / 2 &&
    yCarro + carHeight / 2 > yPost
  ) {
    bgMusic.pause();
    holeFall.play();
    triggerGameOver("CRASHHHH!!!!", "Quedaste a pie :C");
    resetGame();
  }
}

function detectHole() {
  if (
    score > 500 &&
    xCarro < xHole + holeWidth / 1.5 &&
    xCarro + carWidth / 2 > xHole &&
    yCarro < yHole + holeHeight / 2 &&
    yCarro + carHeight / 2 > yHole
  ) {
    if (!setScore) {
      score += 100;
      setScore = true;
      holeTouched = true;
      drawScore();
      yHole = -holeHeight;
      xHole = Math.random() * (canvas.width - holeWidth);
    }

    setScore = false;
  } else if (
    xCarro < xHole + holeWidth / 2 &&
    xCarro + carWidth / 2 > xHole &&
    yCarro < yHole + holeHeight / 2 &&
    yCarro + carHeight / 2 > yHole
  ) {
    if (!setScore) {
      score += 100;
      setScore = true;
      yHole = -holeHeight;
      xHole = Math.random() * (canvas.width - holeWidth);
    }
    holeTouched = true;
    drawScore();
    setScore = false;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (pause === start) {
    drawStart();
    bgMusic.pause();
  } else if (pause) {
    drawPause();
    bgMusic.pause();
  } else {
    bgMusic.play();

    stripePosition -= ySpeed;
    if (stripePosition < -40) {
      stripePosition += 40;
    }

    drawStripes();

    ctx.drawImage(Carro, xCarro, yCarro, carWidth, carHeight);
    ctx.drawImage(Hole, xHole, yHole, holeWidth, holeHeight);
    ctx.drawImage(Pole, xPost, yPost, poleWidth, poleHeight);

    poleSpawn();
    holeSpawn();
    drawScore();

    vroom();

    detectPole();
    detectHole();
  }
  requestAnimationFrame(draw);
}

draw();
