//Juego de carro vertical esquivando huecos
//(cada hueco que llegue al fondo de la pantalla son +10 puntos)

const canvas = document.getElementById("myCanvas");

const ctx = canvas.getContext("2d");

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
Carro.src = "A.png";

//Pause
let pause = true;

//PAUSA
document.addEventListener("keydown", function (event) {
  if (event.key === "p" || event.key === "P") {
    // Toggle the paused variable
    pause = !pause;
  }
});

//Obstaculo
//DIFICULTAD; AUMENTAR TAMAÑO DEL HUECO O VELOCIDAD
let holeWidth = 70;
let holeHeight = 70;
let holeSpeed = 5;
let xHole = Math.random() * (canvas.width - holeWidth);
let yHole = -70;
const Hole = new Image();
Hole.src = "hole.png";

//Sonidos
const gameOver = new Audio("explosion.wav");
//const engineStart = new Audio("car-start.wav");
const holeFall = new Audio("holefall.wav");
const bgMusic = new Audio("bg-music.mp3");

//PAUSA
function drawPause() {
  ctx.font = "16px Baskerville";
  ctx.fillStyle = "#000";
  ctx.fillText("PAUSED GAME", 50, canvas.height / 2);
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

  score = 0;

  bgMusic.currentTime = 0; // reset audio to start
  bgMusic.play();}

//Aceleracion y frenado
function vroom() {
  ySpeed += acceleration;
  yCarro += ySpeed;
  if (yCarro > canvas.height - carHeight) {
    ySpeed = 0;
    acceleration = -0.1;
    yCarro = canvas.height - carHeight;
    alert("Chocaste! CUTUPLUN!")
    resetGame()
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
//Chequea si el hueco llegó al final de la pantalla
let holeReachedBottom = false;

function drawScore() {
  if (holeReachedBottom) {
    ctx.font = "40px, Baskerville";
    ctx.fillStyle = "#ff000";
    ctx.fillText("+100", 20, 20);
    setTimeout(() => {
      ctx.clearRect(20, 20, 50, 35); // Clear previous +100 string
    }, 1000);
  }
  ctx.font = "40px, Baskerville";
  ctx.fillStyle = "#ff000";
  ctx.fillText("Score: " + score, 150, 30);
}

function holeSpawn() {
  //xHole = Math.random() * (canvas.width-holeWidth)
  yHole += holeSpeed;
  if (yHole > canvas.height - holeHeight) {
    if (!holeReachedBottom) {
      score += 100;
      holeReachedBottom = true;
      drawScore();
      console.log("Should draw score");
      console.log(holeReachedBottom); // reset flag
    }
    yHole = -holeHeight;
    xHole = Math.random() * (canvas.width - holeWidth);
    if (score > 500) {
      holeWidth = 120;
      holeSpeed = 7
    }
    holeReachedBottom = false;
    console.log(holeReachedBottom);
    console.log("Should reset"); // reset flag
  }
}

function detectHole() {

  if(score > 500 && xCarro < xHole + holeWidth / 1.5 &&
    xCarro + carWidth/2 > xHole &&
    yCarro < yHole + holeHeight / 2 &&
    yCarro + carHeight/2 > yHole){
   
    holeFall.play();
    bgMusic.pause();
    alert("Caiste en un hueco, colabora pa los frescos");
    resetGame();
  }  else if(xCarro < xHole + holeWidth / 2 &&
    xCarro + carWidth/2 > xHole &&
    yCarro < yHole + holeHeight / 2 &&
    yCarro + carHeight/2 > yHole) {
    holeFall.play();
    bgMusic.pause();
    alert("Caiste en un hueco, colabora pa los frescos");
    resetGame();
  }
}

const titleScreen = document.getElementById("title-screen");

function startGame() {
  titleScreen.style.display = "none";

  // Display the game canvas
  canvas.style.display = "block";
  bgMusic.play();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (pause) {
    drawPause();
    bgMusic.pause();
  } else {
    Carro.onload = () => {
      console.log("aqui hay un carro");
    };

    Hole.onload = () => {
      console.log("obstacle loaded");
    };
    ctx.drawImage(Carro, xCarro, yCarro, carWidth, carHeight);


    ctx.drawImage(Hole, xHole, yHole, holeWidth, holeHeight);

    holeSpawn();
    drawScore();

    vroom();

    detectHole();

    if (!bgMusic.paused) {
      bgMusic.play();
    }
  }
  requestAnimationFrame(draw);
}

draw();
