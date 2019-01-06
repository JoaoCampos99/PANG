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
canvas = document.getElementById("myCanvas");
context = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 600;
let gameheight = 500;
//GameOVER SCREEN
let gameover = new Image();
gameover.src = "./assets/gameover.jpg";
let ballexploding = new Image();
ballexploding.src = "./assets/baloons.png";
let pause = false;
let ready = true;
let singleplayer = false;
//PAUSE SCREEN
function PauseScreen() {
  context.font = "bold 60px Arial";
  context.fillStyle = "rgb(200,0,0)";
  context.textAlign = "center";
  context.fillText("PAUSED", canvas.width / 2, canvas.height / 3);
  context.strokeText("PAUSED", canvas.width / 2, canvas.height / 3);

  context.font = "bold 40px Arial";
  context.fillText(
    "Press 'P' to unpause ",
    canvas.width / 2,
    canvas.height / 3 + 50
  );
  context.strokeText(
    "Press 'P' to unpause ",
    canvas.width / 2,
    canvas.height / 3 + 50
  );
}

//READY SCREEN
function ReadyScreen() {
  ready = false;
  context.font = "bold 60px Arial";
  context.fillStyle = "yellow";
  context.textAlign = "center";
  context.fillText(
    "LEVEL " + (currentLevelIndex + 1),
    canvas.width / 2,
    canvas.height / 3
  );
  context.strokeText(
    "LEVEL " + (currentLevelIndex + 1),
    canvas.width / 2,
    canvas.height / 3
  );

  context.font = "bold 40px Arial";
  context.fillText(
    "Press any key to start",
    canvas.width / 2,
    canvas.height / 3 + 50
  );
  context.strokeText(
    "Press any key to start",
    canvas.width / 2,
    canvas.height / 3 + 50
  );

  window.addEventListener("keydown", function Start() {
    console.log("start");
    ready = true;
    window.removeEventListener("keydown", Start);
    Animate();
  });
}

//CLASSE LEVEL
let arrayLevels = [new Level(), new Level(), new Level()]; //ARRAY PARA PERCORRER OS VARIOS LEVELS
let currentLevelIndex = 0; // COMEÇAR COM LEVEL 1

function Level() {
  this.arrayStartBalls = []; //BOLA(S) INICIAIS DO NIVEL
  this.arrayBalls = []; //BOLAS AO LONGO DO NIVEL
  this.arrayObstacles = []; //TODOS OS OBSTACULOS DO NIVEL
  this.arraySpawnX = []; //TODOS OS X INICIAIS DOS JOGADORES
  this.arraySpawnY = []; //TODOS OS Y INICIAIS DOS JOGADORES
  this.background; //STRING DO .SRC DO BACKGROUND PARA O NIVEL

  this.drawBG = function() {
    let bg = new Image();
    bg.src = this.background;
    context.drawImage(bg, 0, 0, canvas.width, gameheight);
  };

  this.load = function() {
    for (let i = 0; i < arrayPlayers.length; i++) {
      arrayPlayers[i].score = 0; // RESET AO SCORE
      arrayPlayers[i].lives = 3; // RESET A VIDAS
      arrayPlayers[i].x = this.arraySpawnX[i]; // X INICIAL DO PLAYER
      arrayPlayers[i].y = this.arraySpawnY[i]; // Y INICIAL DO PLAYER
      arrayPlayers[i].invulnFrames = 0; // REMOVER FRAMES DE INVULNERABILIDADE DO JOGO ANTERIOR
    }

    this.arrayBalls = []; //RESET A BOLAS
    for (let i = 0; i < this.arrayStartBalls.length; i++) {
      let newStartBALL = new Ball(
        this.arrayStartBalls[i].x,
        this.arrayStartBalls[i].y,
        this.arrayStartBalls[i].r,
        this.arrayStartBalls[i].vx,
        this.arrayStartBalls[i].vy
      );
      this.arrayBalls.push(newStartBALL);
    }
    background.src = this.background; // MUDAR BACKGROUND

    // context.drawImage(
    //   background,
    //   0,
    //   0,
    //   canvas.width,
    //   gameheight
    // )
  };
}

//LEVEL 1
arrayLevels[0].arrayStartBalls = [
  new Ball(canvas.width / 2, canvas.height / 3, 40, 5, 5)
];
arrayLevels[0].arraySpawnX = [canvas.width / 4, 3 * (canvas.width / 4)];
arrayLevels[0].arraySpawnY = [gameheight - 30 * 2, gameheight - 30 * 2]; //  "-30*2" É playerHeight * 2, NECESSÁRIO REMOVER NÚMEROS MÁGICOS DEPOIS
arrayLevels[0].background = "assets/level1.png";

//LEVEL 2
arrayLevels[1].arrayStartBalls = [
  new Ball(canvas.width / 3, canvas.height / 3, 40, -5, 5),
  new Ball(2 * (canvas.width / 3), canvas.height / 3, 40, 5, 5)
];
arrayLevels[1].arraySpawnX = [canvas.width / 4, 3 * (canvas.width / 4)];
arrayLevels[1].arraySpawnY = [gameheight - 30 * 2, gameheight - 30 * 2]; //  "-30*2" É playerHeight * 2, NECESSÁRIO REMOVER NÚMEROS MÁGICOS DEPOIS
arrayLevels[1].background = "assets/level2.png";

//LEVEL 3
arrayLevels[2].arrayStartBalls = [
  new Ball(canvas.width / 2, canvas.height / 3, 80, 5, 5)
];
arrayLevels[2].arraySpawnX = [canvas.width / 4, 3 * (canvas.width / 4)];
arrayLevels[2].arraySpawnY = [gameheight - 30 * 2, gameheight - 30 * 2]; //  "-30*2" É playerHeight * 2, NECESSÁRIO REMOVER NÚMEROS MÁGICOS DEPOIS
arrayLevels[2].background = "assets/level3.png";

//Array de Bolas
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
      49 * this.right,
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
//CLASSE BALL
function Ball(x, y, r, vx, vy) {
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
      this.y = this.r;
      this.vy *= -1;
    }
    if (this.y + this.r > gameheight) {
      this.vy *= -1;
      this.y = gameheight - this.r;
    }
    if (this.x - this.r < 0) {
      this.vx *= -1;
      this.x = this.r;
    }
    if (this.x + this.r > canvas.width) {
      this.vx *= -1;
      this.x = canvas.width - this.r;
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

      let redBall1 = new Ball(this.x + this.r, this.y, this.r * 0.5, 5, -5);
      let redBall2 = new Ball(this.x - this.r, this.y, this.r * 0.5, -5, -5);
      arrayLevels[currentLevelIndex].arrayBalls.push(redBall1);
      arrayLevels[currentLevelIndex].arrayBalls.push(redBall2);
    }

    arrayLevels[currentLevelIndex].arrayBalls.splice(
      arrayLevels[currentLevelIndex].arrayBalls.indexOf(this),
      1
    );

    if (arrayLevels[currentLevelIndex].arrayBalls.length == 0) {
      arrayHarpoons = []; // RESET HARPOONS
      for (let i = 0; i < arrayPlayers.length; i++) {
        arrayPlayers[i].canFire = true;
      }

      if (currentLevelIndex <= 2) {
        currentLevelIndex++;

        // context.fillStyle = "white"
        // context.fillRect(0,0, canvas.width, canvas. height)
        //background.src = arrayLevels[currentLevelIndex].background
        arrayLevels[currentLevelIndex].load();

        for (
          let i = 0;
          i < arrayLevels[currentLevelIndex].arrayBalls.length;
          i++
        ) {
          arrayLevels[currentLevelIndex].arrayBalls[i].draw();
        }
        ready = false;
      }
    }
  };
}

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
  this.invulnFrames = 0; //FRAMES DE INVULNERABILIDADE

  this.draw = function() {
    if (this.lives > 0) {
      if (this.invulnFrames == 0) {
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
      } else {
        let falling = new Image();
        falling.src = "./assets/pang.png";
        context.drawImage(
          falling,
          335,
          0,
          playerWidth,
          playerHeight,
          this.x,
          this.y,
          playerWidth * 2,
          playerHeight * 2
        );
      }
    }
  };
  this.update = function() {
    if (this.lives > 0) {
      if (this.invulnFrames == 0) {
        this.x += this.speed;
        this.speed = 0;
        if (this.moveRight) this.speed = 5;
        if (this.moveLeft) this.speed = -5;
      } else {
        this.invulnFrames--;
      }
    }
  };
  this.walls = function() {
    if (this.x < 0) this.x = 0;
    if (this.x + playerWidth * 2 > canvas.width)
      this.x = canvas.width - playerWidth * 2;
  };
  this.ballColision = function() {
    for (let i = 0; i < arrayLevels[currentLevelIndex].arrayBalls.length; i++) {
      if (this.invulnFrames == 0) {
        if (
          arrayLevels[currentLevelIndex].arrayBalls[i].r >
            Math.hypot(
              this.x - arrayLevels[currentLevelIndex].arrayBalls[i].x,
              this.y - arrayLevels[currentLevelIndex].arrayBalls[i].y
            ) || //  VÉRTICE TOP-LEFT
          arrayLevels[currentLevelIndex].arrayBalls[i].r >
            Math.hypot(
              this.x +
                2 * playerWidth -
                arrayLevels[currentLevelIndex].arrayBalls[i].x,
              this.y - arrayLevels[currentLevelIndex].arrayBalls[i].y
            ) || //  VÉRTICE TOP-RIGHT
          arrayLevels[currentLevelIndex].arrayBalls[i].r >
            Math.hypot(
              this.x - arrayLevels[currentLevelIndex].arrayBalls[i].x,
              this.y +
                playerHeight * 2 -
                arrayLevels[currentLevelIndex].arrayBalls[i].y
            ) || //  VÉRTICE BOTTOM-LEFT
          arrayLevels[currentLevelIndex].arrayBalls[i].r >
            Math.hypot(
              this.x +
                2 * playerWidth -
                arrayLevels[currentLevelIndex].arrayBalls[i].x,
              this.y +
                playerHeight * 2 -
                arrayLevels[currentLevelIndex].arrayBalls[i].y
            ) || //  VÉRTICE BOTTOM-RIGHT
          (arrayLevels[currentLevelIndex].arrayBalls[i].x > this.x &&
            arrayLevels[currentLevelIndex].arrayBalls[i].x <
              this.x + playerWidth &&
            arrayLevels[currentLevelIndex].arrayBalls[i].y +
              arrayLevels[currentLevelIndex].arrayBalls[i].r >
              this.y &&
            arrayLevels[currentLevelIndex].arrayBalls[i].y -
              arrayLevels[currentLevelIndex].arrayBalls[i].r <
              this.y + playerHeight * 2) // VERIFICAR SE ULTRAPASSA ALGUMA ARESTA DA HITBOX DO PLAYER
        ) {
          this.invulnFrames = 50; //DAR 50 FRAMES DE INVULNERABILIDADE APOS PERDER UMA VIDA
          this.lives--;
        }
      }
    }
  };
}
let p1 = new Player(canvas.width / 2, gameheight - playerHeight * 2);
let p2 = new Player(canvas.width / 2 + 30, gameheight - playerHeight * 2);
let arrayPlayers = [];
arrayPlayers.push(p1, p2);
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
    for (let i = 0; i < arrayLevels[currentLevelIndex].arrayBalls.length; i++) {
      if (
        arrayLevels[currentLevelIndex].arrayBalls[i].r >
          Math.hypot(
            this.x - arrayLevels[currentLevelIndex].arrayBalls[i].x,
            this.y - arrayLevels[currentLevelIndex].arrayBalls[i].y
          ) || // TOP-LEFT VERTICE DO HARPOON
        arrayLevels[currentLevelIndex].arrayBalls[i].r >
          Math.hypot(
            this.x + 16 - arrayLevels[currentLevelIndex].arrayBalls[i].x,
            this.y - arrayLevels[currentLevelIndex].arrayBalls[i].y
          ) || // TOP-RIGHT VERTICE DO HARPOON
        (arrayLevels[currentLevelIndex].arrayBalls[i].x > this.x &&
          arrayLevels[currentLevelIndex].arrayBalls[i].x < this.x + 16 &&
          arrayLevels[currentLevelIndex].arrayBalls[i].y +
            arrayLevels[currentLevelIndex].arrayBalls[i].r >
            this.y &&
          arrayLevels[currentLevelIndex].arrayBalls[i].y -
            arrayLevels[currentLevelIndex].arrayBalls[i].r <
            this.y + this.height) // ARESTAS DA HITBOX DO HARPOON
      ) {
        this.player.canFire = true;
        arrayHarpoons.splice(arrayHarpoons.indexOf(this), 1);
        arrayLevels[currentLevelIndex].arrayBalls[i].pop();
        this.player.score += 10;
        break;
      }
    }
  };
}

let lost = false; //Able Restart Press (R)

function ArrowPressed(evt) {
  if (evt.keyCode == 68) p1.moveRight = true; //P1
  if (evt.keyCode == 65) p1.moveLeft = true; //P1
  if (evt.keyCode == 16) {
    //P1
    if (p1.lives > 0) {
      if (p1.canFire) {
        let harpoonP1 = new Harpoon(p1, p1.x, p1.y);
        arrayHarpoons.push(harpoonP1);
        p1.canFire = false;
      }
    }
  }
  //Player 2 Commands
  if (!singleplayer) {
    if (evt.keyCode == 39) p2.moveRight = true;
    if (evt.keyCode == 37) p2.moveLeft = true;
    if (evt.keyCode == 32) {
      if (p2.lives > 0) {
        if (p2.canFire) {
          let harpoonP2 = new Harpoon(p2, p2.x, p2.y);
          arrayHarpoons.push(harpoonP2);
          p2.canFire = false;
        }
      }
    }
  }

  //After lost restart
  if (lost == true) {
    if (evt.keyCode == 82) {
      currentLevelIndex = 0;
      arrayLevels[currentLevelIndex].load();
      lost = false;
      console.log(arrayPlayers);
      ready = false;
    }
  }

  //PAUSE
  if (start == true) {
    if (evt.keyCode == 80) {
      //PAUSE DURING GAME
      if (pause == false) {
        pause = true;
        console.log("pause");
      }
      //UNPAUSE
      else if (pause == true) {
        pause = false;
        window.requestAnimationFrame(Animate);
        console.log("unpause");
      }
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
  context.fillText("Score", 100, gameheight + 30, 80);
  if (!singleplayer) {
    context.fillText("Player 2", canvas.width - 90, gameheight + 30, 80);

    context.fillText("Score", canvas.width - 150, gameheight + 30, 80);
    //Ver Quantas casa é que tem o score do player 2 e mudar a posição conforme isso
    let length = Math.ceil(Math.log10(p2.score + 1)) + 1;
    let pos = 10;
    //console.log(length);
    context.fillText(
      p2.score,
      canvas.width - 100 - pos * length,
      gameheight + 60,
      80
    );
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
  context.fillText(p1.score, 100, gameheight + 60, 80);

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
}
let start = false;
let multiplayer = false;

let startmenu = function() {
  let startmenu = new Image();
  startmenu.src = "./assets/startmenu.png";
  context.drawImage(
    startmenu,
    0,
    0,
    240,
    210,
    0,
    0,
    canvas.width,
    canvas.height
  );
};

arrayLevels[currentLevelIndex].load();

let Animate = function() {
  startmenu();

  if (start == true) {
    //Atualizar background
    if (p1.lives > 0 || p2.lives > 0) {
      context.drawImage(background, 0, 0, canvas.width, gameheight);

      arrayLevels[currentLevelIndex].drawBG();
      for (
        let i = 0;
        i < arrayLevels[currentLevelIndex].arrayBalls.length;
        i++
      ) {
        arrayLevels[currentLevelIndex].arrayBalls[i].draw();
        arrayLevels[currentLevelIndex].arrayBalls[i].update();
        arrayLevels[currentLevelIndex].arrayBalls[i].walls();
      }

      for (let i = 0; i < arrayHarpoons.length; i++) {
        arrayHarpoons[i].draw();
        arrayHarpoons[i].update();
      }
      for (let i = 0; i < arrayExplosion.length; i++) {
        arrayExplosion[i].draw();
        arrayExplosion[i].update();
      }
      for (let i = 0; i < arrayPlayers.length; i++) {
        arrayPlayers[i].draw();
        arrayPlayers[i].update();
        arrayPlayers[i].walls();
        arrayPlayers[i].ballColision();
      }
      ScoreBoard();
    } else {
      context.drawImage(
        gameover,
        0,
        0,
        266,
        200,
        0,
        0,
        canvas.width,
        canvas.height
      );
      lost = true;
    }
  }

  canvas.addEventListener("mousedown", function(evt) {
    var x = evt.pageX - canvas.offsetLeft;
    var y = evt.pageY - canvas.offsetTop;

    if (x >= 212 && x <= 692) {
      if (y >= 423 && y <= 474) {
        start = true;
        ready = false;
        arrayPlayers = [p1];
        singleplayer = true;
        p2.lives = 0;
      }
    }

    if (x >= 226 && x <= 672) {
      if (y >= 501 && y <= 550) {
        start = true;
        ready = false;
        arrayPlayers = [p1, p2];
      }
    }
  });

  window.addEventListener("keydown", ArrowPressed);
  window.addEventListener("keyup", ArrowReleased);
  if (pause == false && ready == true) {
    window.requestAnimationFrame(Animate);
  } else if (pause == true) {
    PauseScreen();
  } else if (ready == false) {
    ReadyScreen();
  }
};
Animate();
