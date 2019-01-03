//ASSETS : https://github.com/mkmik/pang
//https://www.spriters-resource.com/snes/superbusterbros/
//https://www.spriters-resource.com/arcade/pangbusterbrospompingworld/sheet/109438/
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
canvas.height = 600;
let gameheight = 500;

let ballexploding = new Image();
ballexploding.src = "./assets/baloons.png";
//Array de Bolas
let arrayBalls = [];
let arrayExplosion = [];
function Explosion(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.lifespan = 0;
  this.count = 0;
  this.right = 3;
  this.draw = function() {
    context.drawImage(
      ballexploding,
      47 * this.right,
      0,
      47,
      47,
      this.x,
      this.y,
      this.width,
      this.height
    );
    this.count++;
    if (this.count <= 5) {
      this.right++;
    } else {
      this.right = 3;
    }
  };

  this.update = function() {
    if (this.lifespan < 20) {
      this.lifespan++;
    } else {
      arrayExplosion.splice(arrayExplosion.indexOf(this), 1);
    }
  };
}
//Bola vermelha
function redBall(x, y, r, vx, vy) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.vx = vx;
  this.vy = vy;

  this.acell = 0.2; //Aceleraçao

  this.draw = function() {
    context.drawImage(
      ballImage,
      0,
      0,
      41,
      41,
      this.x - this.r,
      this.y - this.r,
      this.r * 2,
      this.r * 2
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
    if (this.y + this.r > gameheight) {
      this.vy *= -1;
      if (this.vy < 1) {
        this.y = gameheight - this.r;
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
  this.pop = function() {
    if (this.r > 10) {
      let explosion = new Explosion(
        this.x - this.r,
        this.y - this.r,
        this.r * 2,
        this.r * 2
      );
      arrayExplosion.push(explosion);
      let redBall1 = new redBall(this.x + this.r, this.y, this.r * 0.5, 5, -5);
      let redBall2 = new redBall(this.x - this.r, this.y, this.r * 0.5, -5, -5);
      arrayBalls.push(redBall1);
      arrayBalls.push(redBall2);
    }
    arrayBalls.splice(arrayBalls.indexOf(this), 1);
  };
}
let newredBall = new redBall(canvas.width / 2, canvas.height / 2, 40, 5, 5);
arrayBalls.push(newredBall);

//Fazer PANG(Jogador)
let player = new Image();
player.src = "assets/pang.png";
let playerWidth = 30; //Width de cada frame do sprite
let playerHeight = 30; //Height de cada frame do sprite
//O asset começa parado coordenada (205,02)

function Player(x, y) {
  this.x = x;
  this.y = y;
  this.moveRight = false;
  this.moveLeft = false;
  this.facingRight = false;
  this.speed = 0;
  this.canFire = true;
  this.shoot = false;
  this.Right = 0;
  this.Left = 17;
  this.count = 0;
  this.lives = 3;
  this.score = 0;

  this.draw = function() {
    if (!this.moveRight && !this.moveLeft) {
      if (this.facingRight) {
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

      this.Right = 0;
      this.Left = 16;
    }

    if (this.moveRight) {
      this.moveLeft = false;
      this.facingRight = true;
      this.Left = 16;
      context.drawImage(
        player,
        this.Right * (playerWidth + 4),
        2,
        playerWidth,
        playerHeight,
        this.x,
        this.y,
        playerWidth * 2,
        playerHeight * 2
      );
      this.count++;
      if (this.count == 5) {
        this.Right++;
        this.count = 0;
      }
      if (this.Right > 4) {
        this.Right = 0;
      }
    }
    //O sprite ir para a esquerda começa em 511
    if (this.moveLeft) {
      this.moveRight = false;
      this.facingRight = false;
      this.Right = 0;
      context.drawImage(
        player,
        this.Left * (playerWidth + 4),
        2,
        playerWidth,
        playerHeight,
        this.x,
        this.y,
        playerWidth * 2,
        playerHeight * 2
      );
      this.count++;
      if (this.count == 5) {
        this.Left--;
        this.count = 0;
      }

      if (this.Left < 12) {
        this.Left = 15;
      }
    }
  };
  this.update = function() {
    this.x += this.speed;
    this.speed = 0;
    if (this.moveRight) this.speed = 5;
    if (this.moveLeft) this.speed = -5;
  };
  this.walls = function() {
    if (this.x < 0) this.x = 0;
    if (this.x + playerWidth * 2 > canvas.width)
      this.x = canvas.width - playerWidth * 2;
  };
  this.ballColision = function() {
    //Isto esta mal
    for (let i = 0; i < arrayBalls.length; i++) {
      if (
        arrayBalls[i].x >= this.x.playerWidth * 2 &&
        arrayBalls[i].y >= this.y
      ) {
        console.log("a bola bateu pela direita"); //Remove Live e volta tudo ao inicio
      } else if (arrayBalls[i] <= this.x && arrayBalls[i].y >= this.y) {
        console.log("A bola bateu pela esquerda"); //Remove Live e volta tudo ao inicio
      }
    }
  };
}
let p1 = new Player(canvas.width / 2, gameheight - playerHeight * 2);
let p2 = new Player(canvas.width / 2 + 10, gameheight - playerHeight * 2);
//ARPÃO
let arrayHarpoons = [];
//Carregar Imagem
let harpImg = new Image();
harpImg.src = "./assets/pang2.png";
//O x e o y vão ser o centro do boneco no a partir do chão
function Harpoon(player, x, y) {
  this.player = player;
  this.x = x;
  this.y = y;
  this.speed = 5;
  this.height = playerHeight * 2;
  this.state = 0;
  this.draw = function() {
    context.drawImage(
      harpImg,
      18,
      0,
      16,
      this.height,
      this.x + playerWidth,
      this.y,
      16,
      this.height
    );
  };
  this.update = function() {
    this.y -= this.speed;
    this.height += this.speed;

    //colisoes arpão
    //topo canvas
    if (this.y < 0) {
      this.player.canFire = true;
      arrayHarpoons.splice(arrayHarpoons.indexOf(this), 1);
    }
    //bolas
    for (let i = 0; i < arrayBalls.length; i++) {
      if (
        this.y <= arrayBalls[i].y + arrayBalls[i].r * 2 &&
        arrayBalls[i].x + arrayBalls[i].r * 2 >= this.x &&
        this.x >= arrayBalls[i].x
      ) {
        this.player.canFire = true;
        arrayHarpoons.splice(arrayHarpoons.indexOf(this), 1);
        arrayBalls[i].pop();
        this.player.score += 10;
        break;
      }
    }
  };
}

function ArrowPressed(evt) {
  if (evt.keyCode == 68) p1.moveRight = true; //P1
  if (evt.keyCode == 65) p1.moveLeft = true; //P1
  if (evt.keyCode == 32) {
    //P1
    if (p1.canFire) {
      let harpoonP1 = new Harpoon(p1, p1.x, p1.y);
      arrayHarpoons.push(harpoonP1);
      p1.canFire = false;
    }
  }
  //Player 2 Commands
  if (evt.keyCode == 39) p2.moveRight = true;
  if (evt.keyCode == 37) p2.moveLeft = true;
  if (evt.keyCode == 16) {
    if (p2.canFire) {
      let harpoonP2 = new Harpoon(p2, p2.x, p2.y);
      arrayHarpoons.push(harpoonP2);
      p2.canFire = false;
    }
  }
}

function ArrowReleased(evt) {
  if (evt.keyCode == 68) p1.moveRight = false; //P1
  if (evt.keyCode == 65) p1.moveLeft = false; //P1
  if (evt.keyCode == 32) p1.shoot = false; //P1

  if (evt.keyCode == 39) p2.moveRight = false; //P2
  if (evt.keyCode == 37) p2.moveLeft = false; //P2
  if (evt.keyCode == 16) p2.shoot = false; //P2
}
function ScoreBoard() {
  let count = 30;
  context.fillStyle = "black";
  context.fillRect(0, gameheight, canvas.width, canvas.height - gameheight);
  let lifeSprite = new Image();
  lifeSprite.src = "./assets/othersprites.png";
  context.fillStyle = "white";
  context.font = "20px arial";
  context.fillText("Player 1", 10, gameheight + 30, 80);
  context.fillText("Player 2", canvas.width - 90, gameheight + 30, 80);
  context.fillText("Score", 100, gameheight + 30, 80);
  context.fillText("Score", canvas.width - 150, gameheight + 30, 80);
  context.fillText(p1.score, 100, gameheight + 60, 80);
  //Ver Quantas casa é que tem o score do player 2 e mudar a posição conforme isso
  let length = Math.ceil(Math.log10(p2.score + 1)) + 1;
  let pos = 10;
  console.log(length);
  context.fillText(
    p2.score,
    canvas.width - 100 - pos * length,
    gameheight + 60,
    80
  );
  for (let i = 0; i < p1.lives; i++) {
    context.drawImage(
      lifeSprite,
      0,
      185,
      20,
      20,
      count * i + 5,
      gameheight + 40,
      30,
      30
    );
  }
  for (let i = 0; i < p2.lives; i++) {
    context.drawImage(
      lifeSprite,
      0,
      185,
      20,
      20,
      canvas.width - count * i - 30,
      gameheight + 40,
      30,
      30
    );
  }
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
    gameheight
  );
  for (let i = 0; i < arrayBalls.length; i++) {
    arrayBalls[i].draw();
    arrayBalls[i].update();
    arrayBalls[i].walls();
  }

  for (let i = 0; i < arrayHarpoons.length; i++) {
    arrayHarpoons[i].draw();
    arrayHarpoons[i].update();
  }
  for (let i = 0; i < arrayExplosion.length; i++) {
    arrayExplosion[i].draw();
    arrayExplosion[i].update();
  }
  p1.draw();
  p1.update();
  p1.walls();
  p2.draw();
  p2.update();
  p2.walls();
  //p1.ballColision(); Not Working

  ScoreBoard();
  window.addEventListener("keydown", ArrowPressed);
  window.addEventListener("keyup", ArrowReleased);
  window.requestAnimationFrame(Animate);
};

Animate();
