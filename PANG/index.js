//ASSETS : https://github.com/mkmik/pang
//https://www.spriters-resource.com/snes/superbusterbros/
//Todo o resto do código é autoria própria

let canvas = null;
let context = null;
let timer = null;
//ASSETS
let ballImage = new Image();
ballImage.src = "assets/baloon1.png";
let background = new Image();
background.src = "assets/background.png";
canvas = document.getElementById("myCanvas");
context = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 800;

//Bola vermelha
function redBall(x, y, r, vel) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.vel = vel;
  this.k = 0.7; //Elasticidade
  this.acell = 0.1; //Aceleraçao
  this.friction = 0.001; //Fricção
  this.dirX = Math.random() * 2 * Math.PI;
  this.dirY = Math.random() * 2 * Math.PI;
  this.vx = Math.cos(this.dirX) * this.vel;
  this.vy = Math.sin(this.dirY) * this.vel;

  this.draw = function() {
    context.drawImage(
      ballImage,
      0,
      0,
      41,
      41,
      this.x - this.r,
      this.y - this.r,
      40,
      40
    );

    //    context.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
  };

  this.update = function() {
    this.vy += this.acell;
    this.vx -= this.vx * this.friction;
    console.log(this.vx);
    this.y += this.vy;
    this.x += this.vx;
  };

  this.walls = function() {
    if (this.y - this.r < 0) {
      this.vy = -this.k * this.vy;
    }
    if (this.y + this.r > canvas.height) {
      this.vy = -this.k * this.vy;
      if (this.vy < 1) {
        this.y = canvas.height - this.r;
      }
    }
    if (this.x - this.r < 0) {
      this.vx *= -1;
      if (Math.abs(this.vx) <= 3) {
        this.x = this.r;
      }
    }
    if (this.x + this.r > canvas.width) {
      this.vx *= -1;
    }
  };
}
let newredBall = new redBall(canvas.width / 2, canvas.height / 2, 20, 10);
//Funções sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function demo() {
  console.log("Taking a break...");
  await sleep(2000);
  console.log("Two seconds later");
}

//Fazer PANG(Jogador)
let player = new Image();
player.src = "assets/pang.png";
let playerWidth = 30; //Width de cada frame do sprite
let playerHeight = 30; //Height de cada frame do sprite
//O asset começa parado coordenada (205,02)
let moveRight = false;
let moveLeft = false;
let currentFrameRight = 0;
let currentFrameLeft = 17;
function Player(x, y) {
  this.x = x;
  this.y = y;
  this.speed = 0;
  this.draw = function() {
    if (!moveRight && !moveLeft) {
      context.drawImage(
        player,
        205,
        2,
        playerWidth,
        playerHeight,
        this.x,
        this.y,
        playerWidth * 2,
        playerHeight * 2
      );
      currentFrameRight = 0;
      currentFrameLeft = 17;
    }

    if (moveRight) {
      moveLeft = false;
      currentFrameLeft = 17;
      context.drawImage(
        player,
        currentFrameRight * (playerWidth + 4),
        2,
        playerWidth,
        playerHeight,
        this.x,
        this.y,
        playerWidth * 2,
        playerHeight * 2
      );
      demo();
      currentFrameRight++;
      if (currentFrameRight > 6) {
        currentFrameRight = 0;
      }
    }
    //O sprite ir para a esquerda começa em 511
    if (moveLeft) {
      moveRight = false;
      currentFrameRight = 0;
      context.drawImage(
        player,
        currentFrameLeft * (playerWidth + 4),
        2,
        playerWidth,
        playerHeight,
        this.x,
        this.y,
        playerWidth * 2,
        playerHeight * 2
      );
      demo();
      currentFrameLeft--;

      if (currentFrameLeft < 12) {
        currentFrameLeft = 17;
      }
    }
  };
  this.update = function() {
    this.x += this.speed;
    this.speed = 0;
    if (moveRight) this.speed = 5;
    if (moveLeft) this.speed = -5;
  };
  this.walls = function() {};
}
function ArrowPressed(evt) {
  if (evt.keyCode == 39) moveRight = true;
  if (evt.keyCode == 37) moveLeft = true;
}
function ArrowReleased(evt) {
  if (evt.keyCode == 39) moveRight = false;
  if (evt.keyCode == 37) moveLeft = false;
}
let newPlayer = new Player(canvas.width / 2, canvas.height - playerHeight * 2);
let Animate = function() {
  //Atualizar background
  context.drawImage(
    background,
    16,
    16,
    240,
    176,
    0,
    0,
    canvas.width,
    canvas.height
  );

  newredBall.draw();
  newredBall.update();
  newredBall.walls();
  newPlayer.draw();
  newPlayer.update();
  newPlayer.walls();

  window.addEventListener("keydown", ArrowPressed);
  window.addEventListener("keyup", ArrowReleased);
  window.requestAnimationFrame(Animate);
};

Animate();
