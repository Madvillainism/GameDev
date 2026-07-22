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

const VEHICLES = {
  redCar: { src: "redcar.png", name: "Carro rojo de Ramon", width: 80, height: 90, accel: -0.2, maxSpeed: 8, handling: Math.PI / 6 },
  altheus: { src: "A.png", name: "Altheus", width: 75, height: 85, accel: -0.25, maxSpeed: 10, handling: Math.PI / 5 },
  matiz: { src: "matiz.png", name: "Matiz Bumblebee", width: 85, height: 95, accel: -0.15, maxSpeed: 6, handling: Math.PI / 4 },
  moto: { src: "moto.png", name: "La Motora", width: 60, height: 70, accel: -0.3, maxSpeed: 12, handling: Math.PI / 3 }
};

let gameState = "title";
let currentVehicle = null;

function stopAudio(audio) {
  audio.pause();
  audio.currentTime = 0;
}

function triggerGameOver(title, message) {
  gameState = "gameover";
  bgMusic.pause();
  gameOverTitle.textContent = title;
  gameOverScore.textContent = "Score: " + score;
  gameOverOverlay.style.display = "flex";
}

function showScreen(screen) {
  const screens = [titleScreen, carSelect, gameWrapper];
  screens.forEach(s => { s.style.display = "none"; s.classList.remove("fade-in"); });
  if (screen) {
    screen.style.display = screen === gameWrapper ? "block" : screen === titleScreen ? "flex" : "block";
    void screen.offsetWidth;
    screen.classList.add("fade-in");
  }
}

function goSelect() {
  showScreen(carSelect);
  garageMusic.play();
}

function backToTitle() {
  stopAudio(garageMusic);
  stopAudio(bgMusic);
  gameOverOverlay.style.display = "none";
  showScreen(titleScreen);
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

function startGame(carKey) {
  currentVehicle = VEHICLES[carKey];
  if (!currentVehicle) return;

  carSelect.style.display = "none";
  garageMusic.pause();

  Carro.src = currentVehicle.src;
  carWidth = currentVehicle.width;
  carHeight = currentVehicle.height;
  maxSteeringAngle = currentVehicle.handling;

  gameState = "waiting";
  showScreen(gameWrapper);
  canvas.style.display = "block";
  bgMusic.currentTime = 3;
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

const Carro = new Image();
const Hole = new Image();
Hole.src = "hole.png";
const Pole = new Image();
Pole.src = "pole.png";

let xCarro = canvas.width / 4;
let yCarro = canvas.height - 250;
let carWidth = 80;
let carHeight = 90;
let ySpeed = 0;
let acceleration = -0.1;
let steeringAngle = 0;
let maxSteeringAngle = Math.PI / 6;

let holeWidth = 70;
let holeHeight = 70;
let holeSpeed = 5;
let xHole = Math.random() * (canvas.width - holeWidth);
let yHole = -70;

let poleWidth = 80;
let poleHeight = 70;
let poleSpeed = 6;
let xPost = Math.random() * (canvas.width - poleWidth + 5);
let yPost = -80;

function drawPause() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = "22px Baskerville";
  ctx.fillStyle = "#fff";
  ctx.fillText("PAUSED", canvas.width / 2 - 50, canvas.height / 2 - 10);
  ctx.font = "14px Baskerville";
  ctx.fillText("Press P or tap ⏸ to resume", canvas.width / 2 - 100, canvas.height / 2 + 20);
}

function drawStart() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = "18px Baskerville";
  ctx.fillStyle = "#fff";
  ctx.fillText("PRESS P OR TAP ⏸ TO START", 50, canvas.height / 2);
}

function resetGame() {
  if (currentVehicle) {
    carWidth = currentVehicle.width;
    carHeight = currentVehicle.height;
    maxSteeringAngle = currentVehicle.handling;
  }
  xCarro = canvas.width / 4;
  yCarro = canvas.height - 250;
  ySpeed = 0;
  acceleration = -0.1;
  steeringAngle = 0;

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
  holeTouched = false;
  setScore = false;

  gameState = "waiting";
  gameOverOverlay.style.display = "none";
  bgMusic.currentTime = 3;
  bgMusic.play();
}

function vroom() {
  if (inputState.up) {
    acceleration = currentVehicle ? currentVehicle.accel : -0.2;
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

  if (currentVehicle) {
    if (ySpeed < -currentVehicle.maxSpeed) ySpeed = -currentVehicle.maxSpeed;
    if (ySpeed > currentVehicle.maxSpeed * 0.5) ySpeed = currentVehicle.maxSpeed * 0.5;
  }

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
    if (gameState === "playing" || gameState === "waiting") vroom();
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

document.addEventListener("keydown", function (event) {
  if (event.key === "p" || event.key === "P") {
    if (gameState === "waiting") {
      gameState = "playing";
    } else if (gameState === "playing") {
      gameState = "paused";
      bgMusic.pause();
    } else if (gameState === "paused") {
      gameState = "playing";
      bgMusic.play();
    }
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" || event.key === "ESCAPE") {
    if (gameState === "gameover") {
      gameOverOverlay.style.display = "none";
    }
    backToTitle();
  }
});

function bindTouchButton(btn, stateKey) {
  btn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    inputState[stateKey] = true;
    if (stateKey === "up" && (gameState === "playing" || gameState === "waiting")) vroom();
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
  if (gameState === "waiting") {
    gameState = "playing";
  } else if (gameState === "playing") {
    gameState = "paused";
    bgMusic.pause();
  } else if (gameState === "paused") {
    gameState = "playing";
    bgMusic.play();
  }
}, { passive: false });

let score = 0;
let holeTouched = false;
let setScore = false;

function drawScore() {
  if (holeTouched) {
    ctx.font = "45px Baskerville";
    ctx.fillStyle = "#fafafa";
    ctx.fillText("+100", 20, 60);
    setTimeout(() => {
      ctx.clearRect(20, 20, 100, 50);
      holeTouched = false;
    }, 1000);
  }
  ctx.font = "22px Baskerville";
  ctx.fillStyle = "#fff";
  ctx.fillText("Score: " + score, 150, 40);
}

let stripePosition = 0;

function drawStripes() {
  ctx.fillStyle = "#3a3a3a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#fff";
  ctx.fillRect(4, 0, 6, canvas.height);
  ctx.fillRect(canvas.width - 10, 0, 6, canvas.height);

  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 4;
  ctx.setLineDash([24, 16]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, stripePosition);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);
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

  if (gameState === "waiting") {
    drawStripes();
    ctx.drawImage(Carro, xCarro, yCarro, carWidth, carHeight);
    ctx.drawImage(Hole, xHole, yHole, holeWidth, holeHeight);
    ctx.drawImage(Pole, xPost, yPost, poleWidth, poleHeight);
    drawStart();
  } else if (gameState === "paused") {
    drawStripes();
    ctx.drawImage(Carro, xCarro, yCarro, carWidth, carHeight);
    ctx.drawImage(Hole, xHole, yHole, holeWidth, holeHeight);
    ctx.drawImage(Pole, xPost, yPost, poleWidth, poleHeight);
    drawPause();
  } else if (gameState === "playing") {
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
