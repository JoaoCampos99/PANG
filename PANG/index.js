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

  this.acell = 0.2; //Aceleraçao
  this.vx = vel;
  this.vy = vel;

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
    this.y += this.vy;
    this.x += this.vx;
  };

  this.walls = function() {
    if (this.y - this.r < 0) {
      this.vy = -this.k * this.vy;
    }
    if (this.y + this.r > canvas.height) {
      this.vy *= -1;
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
let newredBall = new redBall(canvas.width / 2, canvas.height / 2, 20, 5);

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
let count = 0;
let facingRight = false;
function Player(x, y) {
  this.x = x;
  this.y = y;
  this.speed = 0;
  this.draw = function() {
    if (!moveRight && !moveLeft) {
      if (facingRight) {
        context.drawImage(
          player,
          5 * (playerWidth + 4.1),
          2,
          playerWidth,
          playerHeight,
          this.x,
          this.y,
          playerWidth * 2,
          playerHeight * 2
        );
      } else {
        context.drawImage(
          player,
          16 * (playerWidth + 4.1),
          2,
          playerWidth,
          playerHeight,
          this.x,
          this.y,
          playerWidth * 2,
          playerHeight * 2
        );
      }

      currentFrameRight = 0;
      currentFrameLeft = 16;
    }

    if (moveRight) {
      moveLeft = false;
      facingRight = true;
      currentFrameLeft = 16;
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
      count++;
      if (count == 5) {
        currentFrameRight++;
        count = 0;
      }
      if (currentFrameRight > 4) {
        currentFrameRight = 0;
      }
    }
    //O sprite ir para a esquerda começa em 511
    if (moveLeft) {
      moveRight = false;
      facingRight = false;
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
      count++;
      if (count == 5) {
        currentFrameLeft--;
        count = 0;
      }

      if (currentFrameLeft < 12) {
        currentFrameLeft = 15;
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
let newPlayer = new Player(canvas.width / 2, canvas.height - playerHeight * 2);

//ARPÃO
let shoot = false;
let arrayHarpoons = []
//Carregar Imagem
let harpImg = new Image();
harpImg.src = "./assets/pang2.png";
//O x e o y vão ser o centro do boneco no a partir do chão
function Harpoon(x, y) {
  this.x = x;
  this.y = y;
  this.speed = 5;
  this.height = 0;
  this.draw = function() {
    context.drawImage(harpImg,18,0,16,this.height+50,this.x,this.y,16,this.height)
  };
  this.update = function() {
    this.y -= this.speed
    this.height += this.speed

    //colisoes arpão

  };
}

function ArrowPressed(evt) {
  if (evt.keyCode == 39) moveRight = true;
  if (evt.keyCode == 37) moveLeft = true;
  if (evt.keyCode == 32){
    let newHarpoon = new Harpoon(newPlayer.x, newPlayer.y)
    arrayHarpoons.push(newHarpoon)
  }   
} 

function ArrowReleased(evt) {
  if (evt.keyCode == 39) moveRight = false;
  if (evt.keyCode == 37) moveLeft = false;
  if (evt.keyCode == 32) shoot = false;
}

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
  // let newArpoon = new arpoon(
  //   newPlayer.x + playerWidth / 2,
  //   newPlayer.y + playerHeight
  // );
  // newArpoon.draw();
  // newArpoon.update();
  for(let i = 0; i< arrayHarpoons.length; i++){
    arrayHarpoons[i].draw()
    arrayHarpoons[i].update()
  }

  window.addEventListener("keydown", ArrowPressed);
  window.addEventListener("keyup", ArrowReleased);
  window.requestAnimationFrame(Animate);
};

Animate();
