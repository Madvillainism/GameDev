//Juego de carro vertical agarrando huecos
//(cada hueco que se agarre son +100 puntos)

//HACER ESCAPE PARA VOLVER A TITLE SCREEN

document.onload = () => {};

const canvas = document.getElementById("myCanvas");

const ctx = canvas.getContext("2d");

const titleScreen = document.getElementById("title-screen");
const instructions = document.getElementById("how-to");
const carSelect = document.getElementById("carousel");

function goSelect() {
  titleScreen.style.display = "none";
  instructions.style.display = "none";
  carSelect.style.display = "block";
  garageMusic.play();
}

function startGame(car) {
  carSelect.style.display = "none";
  garageMusic.pause();
  console.log(car);
  //alert("The car is: " + car)
  Carro.src = car;
  // Display the game canvas
  canvas.style.display = "block";
  bgMusic.play();
}

//Sonidos
const gameOver = new Audio("explosion.wav");
//const engineStart = new Audio("car-start.wav");
const holeFall = new Audio("holefall.wav");
const bgMusic = new Audio("bg-music.mp3");
const garageMusic = new Audio("garage-music.mp3");
bgMusic.currentTime = 3; // audio at perfect point

//CARROS DEL GARAGE
let redCar = "redcar.png";
let altheus = "A.png";
let matiz = "matiz.png"
//AÑADIR CARROS

//Carro
let xCarro = canvas.width / 4;
let yCarro = canvas.height - 250;
let carWidth = 80;
let carHeight = 90;
let ySpeed = 0;
let acceleration = -0.1; // constant acceleration
let steeringAngle = 0; // initial steering angle
let maxSteeringAngle = Math.PI / 6; // maximum steering angle in radians
const Carro = new Image();

//Pause
let pause = true;

//PAUSA
document.addEventListener("keydown", function (event) {
  if (event.key === "p" || event.key === "P") {
    // Toggle the paused variable
    pause = !pause;
    start = null;
  }
});

//Hueco para puntuar (uyqrico)
//DIFICULTAD; AUMENTAR TAMAÑO DEL HUECO O VELOCIDAD
let holeWidth = 70;
let holeHeight = 70;
let holeSpeed = 5;
let xHole = Math.random() * (canvas.width - holeWidth);
let yHole = -70;
const Hole = new Image();
Hole.src = "hole.png";

//Poste de luz (obstaculo)
let poleWidth = 80;
let poleHeight = 70;
let poleSpeed = 6;
let xPost = Math.random() * (canvas.width - poleWidth + 5);
let yPost = -80;
const Pole = new Image();
Pole.src = "pole.png";

//PAUSA
function drawPause() {
  ctx.font = "16px Baskerville";
  ctx.fillStyle = "#000";
  ctx.fillText("PAUSED GAME", 50, canvas.height / 2);
}

//Press Start

let start = true;

function drawStart() {
  ctx.font = "16px Baskerville";
  ctx.fillStyle = "#000";
  ctx.fillText("PRESS P TO START ROLLING", 70, canvas.height / 2);
}

//RESETEA EL JUEGO
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

  bgMusic.currentTime = 3; // reset audio to start
  bgMusic.play();
}

//Aceleracion y frenado
function vroom() {
  ySpeed += acceleration;
  yCarro += ySpeed;
  if (yCarro > canvas.height - carHeight) {
    ySpeed = 0;
    acceleration = -0.1;
    yCarro = canvas.height - carHeight;
    alert("Chocaste! CUTUPLUN!");
    resetGame();
  } else if (yCarro < 0) {
    ySpeed = 0; // reset speed and acceleration when car hits top
    acceleration = -0.1;
    yCarro = 0;
    bgMusic.pause();
    gameOver.play();
    alert("GAME OVER, you crashed PIMPUMPAM");
    resetGame();
  }
  xCarro += ySpeed * Math.tan(steeringAngle); // update x position based on steering angle and y speed
  xCarro = Math.max(xCarro, 0); // prevent car from going off the left edge of the canvas
  xCarro = Math.min(xCarro, canvas.width - carWidth); // prevent car from going off the right edge of the canvas

  stripePosition -= ySpeed; // update stripe position based on car speed
  if (stripePosition < -40) {
    stripePosition += 40; // wrap around when the stripes go off the top of the canvas
  }
}

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") {
    acceleration = -0.2;
    //engineStart.play(); // increase acceleration when up key is pressed
    vroom();
  } else if (event.key === "ArrowDown") {
    acceleration = 0.2; // increase acceleration when up key is pressed
  } else if (event.key === "ArrowLeft") {
    steeringAngle = maxSteeringAngle;
  } else if (event.key === "ArrowRight") {
    steeringAngle = -maxSteeringAngle;
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    acceleration = -0.1; // reset acceleration when key is released
  } else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    steeringAngle = 0; // reset steering angle when key is released
  }
});

//Score
let score = 0;
//Chequea si el hueco tocó el carro
let holeTouched = false;
//Setea +100 de score
let setScore = false;

function drawScore() {
  if (holeTouched) {
    ctx.font = "45px, Baskerville";
    ctx.fillStyle = "#fafafa";
    ctx.fillText("+100", 20, 20);
    setTimeout(() => {
      ctx.clearRect(20, 20, 50, 35); // Clear previous +100 string
      holeTouched = false;
    }, 1000);
  }
  ctx.font = "45px, Baskerville";
  ctx.fillStyle = "#fff";
  ctx.fillText("Score: " + score, 150, 30);
}

//Rayas de la calle

let stripePosition = 0;

function drawStripes() {
  ctx.fillStyle = "#fff"; // set the fill color to white
  for (let i = stripePosition; i < canvas.height; i += 40) {
    ctx.fillRect(canvas.width / 2 - 5, i, 10, 20); // draw a white rectangle
  }
  ctx.fillStyle = "#bdbf24"; // set the fill color to red
  for (let i = stripePosition; i < canvas.height; i += 120) {
    ctx.fillRect(canvas.width / 2 - 5, i, 10, 60); // draw a red rectangle
  }
}

function holeSpawn() {
  //xHole = Math.random() * (canvas.width-holeWidth)
  yHole += holeSpeed;
  if (yHole > canvas.height - holeHeight) {
    yHole = -holeHeight;
    xHole = Math.random() * (canvas.width - holeWidth);
    if (score > 500) {
      holeWidth = 50;
      holeSpeed = 7;
    }
    //holeTouched = false;
    //console.log(holeTouched);
    //console.log("Should reset"); // reset flag
  }
}

function poleSpawn() {
  //xHole = Math.random() * (canvas.width-holeWidth)
  yPost += poleSpeed;
  if (yPost > canvas.height - poleHeight) {
    yPost = -poleHeight;
    xPost = Math.random() * (canvas.width - holeWidth);
    if (score > 500) {
      poleWidth = 90;
      poleSpeed = 4;
    }
    //holeTouched = false;
    //console.log(holeTouched);
    //console.log("Should reset"); // reset flag
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
    alert("CRASHHHH!!!! Quedaste a pie :C");
    resetGame();
  } else if (
    xCarro < xPost + poleWidth / 2 &&
    xCarro + carWidth / 2 > xPost &&
    yCarro < yPost + poleHeight / 2 &&
    yCarro + carHeight / 2 > yPost
  ) {
    bgMusic.pause();
    holeFall.play();
    alert("CRASHHHH!!!! Quedaste a pie :C");
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

    console.log("Should draw score");
    setScore = false;
    //console.log(holeTouched);
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
    console.log("Should draw score");
    setScore = false;
    //console.log(holeTouched);
  }
}

//GAMELOOP
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

    Carro.onload = () => {
      console.log("aqui hay un carro");
    };

    Hole.onload = () => {
      console.log("objective loaded");
    };
    Pole.onload = () => {
      console.log("Obstacle loaded");
    };

    stripePosition -= ySpeed; // update stripe position based on car speed
    if (stripePosition < -40) {
      stripePosition += 40; // wrap around when the stripes go off the top of the canvas
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

    //if (!bgMusic.paused) {
    //  bgMusic.play();
    //}
  }
  requestAnimationFrame(draw);
}

draw();
