const boardWidth = 500;
const boardHeight = 650;
const playerWidth = 80;
const playerHeight = 10;
const playerVelocityX = 10;
const ballWidth = 10;
const ballHeight = 10;
const ballVelocityX = 3;
const ballVelocityY = 2;
const blockWidth = 50;
const blockHeight = 10;
const blockColumns = 8;
const initialBlockRows = 3;
const blockMaxRows = 10;

let board;
let context;
let player;
let ball;
let blockArray = [];
let score = 0;
let gameOver = false;

window.onload = function () {
  board = document.getElementById("board");
  board.width = boardWidth;
  board.height = boardHeight;
  context = board.getContext("2d");
  player = {
    x: boardWidth / 2 - playerWidth / 2,
    y: boardHeight - playerHeight - 5,
    width: playerWidth,
    height: playerHeight,
    velocityX: playerVelocityX,
  };
  ball = {
    x: boardWidth / 2,
    y: boardHeight / 2,
    width: ballWidth,
    height: ballHeight,
    velocityX: ballVelocityX,
    velocityY: ballVelocityY,
  };
  createBlocks();

  requestAnimationFrame(update);
  document.addEventListener("keydown", movePlayer);
};

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    return;
  }

  context.clearRect(0, 0, board.width, board.height);

  drawRect(player, "#eee");
  drawRect(ball, "#fff");

  handleBallCollision();
  if (ball.y <= 0 || ball.y + ball.height >= boardHeight) {
    handleGameOver();
  }

  drawBlocks();
  handleNextlevel();
  drawScore();
}

function drawRect(obj, color) {
  context.fillStyle = color;
  context.fillRect(obj.x, obj.y, obj.width, obj.height);
}

function movePlayer(e) {
  if (gameOver) {
    if (e.code === "Space") {
      resetGame();
    }
    return;
  }
  if (e.code === "ArrowLeft") {
    movePlayerX(-player.velocityX * 5);
  } else if (e.code === "ArrowRight") {
    movePlayerX(player.velocityX * 5);
  }
}

function movePlayerX(velocity) {
  const nextPlayerX = player.x + velocity;
  if (nextPlayerX >= 0 && nextPlayerX + player.width <= boardWidth) {
    player.x = nextPlayerX;
  }
}

function handleBallCollision() {
  if (detectCollision(ball, player)) {
    ball.velocityY *= -1;
  }

  blockArray.forEach((block) => {
    if (!block.break && detectCollision(ball, block)) {
      block.break = true;
      ball.velocityY *= -1;
      score += 100;
      blockCount--;
    }
  });
  if (ball.x <= 0 || ball.x + ball.width >= boardWidth) {
    ball.velocityX *= -1;
  }

  ball.x += ball.velocityX;
  ball.y += ball.velocityY;
}

function detectCollision(obj1, obj2) {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
  );
}

function handleGameOver() {
  gameOver = true;
  context.font = "20px sans-serif";
  context.fillText("Game Over: Press 'Space' to Restart", 80, 400);
}

function drawBlocks() {
  blockArray.forEach((block) => {
    if (!block.break) {
      drawRect(block, "#9db2bf");
    }
  });
}

function handleNextlevel() {
  if (blockCount === 0) {
    score += 100 * blockRows * blockColumns;
    blockRows = Math.min(blockRows + 1, blockMaxRows);
    createBlocks();
  }
}

function drawScore() {
  context.font = "20px sans-serif";
  context.fillText(`Score: ${score}`, 10, 25);
}

function createBlocks() {
  blockArray = [];
  for (let c = 0; c < blockColumns; c++) {
    for (let r = 0; r < initialBlockRows; r++) {
      const block = {
        x: 15 + c * (blockWidth + 10),
        y: 45 + r * (blockHeight + 10),
        width: blockWidth,
        height: blockHeight,
        break: false,
      };
      blockArray.push(block);
    }
  }
  blockCount = blockArray.length;
}

function resetGame() {
  gameOver = false;
  score = 0;
  player.x = boardWidth / 2 - playerWidth / 2;
  ball.x = boardWidth / 2;
  ball.y = boardHeight / 2;
  createBlocks();
}
