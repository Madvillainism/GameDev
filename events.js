const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

//POSICION DE LA BOLA Y PROPIEDADES
let x = canvas.width / 2;
let y = canvas.height - 30;

let dx = 2;
let dy = -2;

let ballRadius = 10;

//PAUSA
let pause = false;

//PLATAFORMA
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

//EVENTOS DE TECLADO
let rightPress = false;
let leftPress = false;
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

//POWER UP 
//ARREGLAR IMAGEN POWERUP
const powerIcon = new Image()
powerIcon.src = "rayo.jpg";

let powerUp= {
  type: null,
  x: 0,
  y: 0,
  dy: 4
}

const ballSpeed = {
  name: "Speed",
  sprite: powerIcon,
  apply: function() {
    dy = -7;
    dx = dx * 2; // increase horizontal speed as well
  },
};

//BLOQUES
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (var r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

//SCORE
let score = 0;
let scoreSound = new Audio("pointSound.mp3");
let winSound = new Audio("winner.mp3");

//FUNCIONES

//PAUSA
document.addEventListener("keydown", function (event) {
  if (event.key === "p" || event.key === "P") {
    // Toggle the paused variable
    pause = !pause;
  }
});

//RESTART
const restartButton = document.getElementById("restart");
restartButton.addEventListener("click", function () {
  resetGame();
});

function resetGame() {
  // Reset the ball position and speed
  x = canvas.width / 2;
  y = canvas.height - 30;
  dx = 2;
  dy = -2;

  // Reset the paddle position
  paddleX = (canvas.width - paddleWidth) / 2;

  // Reset the brick status
  bricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }

  // Reset the score
  score = 0;
  pause = true;
}

function updateScore() {
  score++;
  scoreSound.play();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(
    paddleX,
    canvas.height - paddleHeight - 10,
    paddleWidth,
    paddleHeight
  );
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPress = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPress = false;
  }
}

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPress = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPress = true;
  }
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#7732a8";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

//PINTA BOLITA
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2, false);
  ctx.fillStyle = "#FAFAFA";
  ctx.fill();
  ctx.closePath();
}

//MUESTRA SCORE
function drawScore() {
  ctx.font = "14px Times New Roman";
  ctx.fillStyle = "#000";
  ctx.fillText("Score: " + score, 20, 20);
}

//FIRMA
function drawName() {
  ctx.font = "16px Baskerville";
  ctx.fillStyle = "#000";
  ctx.fillText("Made with love 愛 ", 200, 20);
}

function drawPause() {
  ctx.font = "16px Baskerville";
  ctx.fillStyle = "#000";
  ctx.fillText("PAUSED GAME", canvas.width / 2, canvas.height / 2);
}

//CHEQUEA COLISION CON LOS BLOQUES
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        //let distX = Math.abs(x - b.x - brickWidth / 2);
        //let distY = Math.abs(y - b.y - brickHeight / 2);

        //if (
          //  distX <= ballRadius + brickWidth / 2 &&
          //  distY <= ballRadius + brickHeight / 2
          //) {
            //  // Check if the ball is overlapping with the brick
            //  if (distX >= brickWidth / 2 || distY >= brickHeight / 2) {
              //    // Ball is hitting the border of the brick
              //    if (distX > distY) {
                //      dy = -dy;
                //    } 
                
                // Check if the ball is colliding with the brick
              if (
                x > b.x &&
                x < b.x + brickWidth + ballRadius &&
            
                y > b.y &&
                y < b.y + brickHeight + ballRadius
              ) {
                dy = -dy;
            
            b.status = 0;
            if (Math.random() < 0.5){
               powerUp = {
                type: ballSpeed,
                x: b.x + brickWidth/2,
                y: b.y + brickWidth/2,
                dy: 4,
              }
            }
            updateScore();
            if (score === brickColumnCount * brickRowCount) {
              alert("You're winner!" + "Your score was: " + score);
              setTimeout(resetGame(), 2000);
            }
          }
        }
      }
    }
  }


function getRandomAngle() {
  // Generate a random number between -60 and 60 degrees
  return Math.random() * 120 - 60;
}

//GAMELOOP + RENDERIZADO
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();

  if (pause) {
    drawPause();
  } else {
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
      dx = -dx;
    }

    if(powerUp.type !== null){
      ctx.drawImage(powerUp.type.sprite, powerUp.x - powerUp.type.sprite.width/2, powerUp.y - powerUp.type.sprite.height/2); 
    }

    if (
      powerUp.type !== null &&
      powerUp.x > paddleX &&
      powerUp.x < paddleX + paddleWidth &&
      powerUp.y > canvas.height - paddleHeight
    ) {
      powerUp.type.apply();
      powerUp = {
        type: null,
        x: 0,
        y: 0,
        dy: 4,
      };
    }

    if (y + dy < ballRadius) {
      dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
      if (x > paddleX - ballRadius && x < paddleX + paddleWidth + ballRadius ) {
        let fast = 5;
        let angle = (x - (paddleX + paddleWidth / 2)) * Math.PI / paddleWidth / 2;
        dy = -fast;
        dx = 3 * Math.sin(angle)
      } else {
        alert("GAME OVER");
        //ADD GAME OVER SOUND
        setTimeout(resetGame(), 2000);
        //document.location.reload();
      }
    }

    //PARA DIFICULTAD: LIMITAR O AUMENTAR VELOCIDAD DE LA TABLA
    //AUMENTAR VELOCIDAD DE LA BOLA
    if (rightPress && paddleX < canvas.width - paddleWidth) {
      paddleX = Math.min(paddleX + 5, canvas.width - paddleWidth);
    } else if (leftPress && paddleX > 0) {
      paddleX = Math.max(paddleX - 5, 0);
    }

    //PARA MOVER LA PELOTA
    x += dx;
    y += dy;
  }

  //HACER REBOTAR LA PELOTA

  drawScore();
  drawName();
  //FRAMERATE
  requestAnimationFrame(draw);
}
draw();
