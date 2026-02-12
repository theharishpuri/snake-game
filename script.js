const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 20; // grid size

let snake;
let food;
let direction;
let score;
let game;

function startGame() {
  snake = [{ x: 9 * box, y: 9 * box }];
  direction = null;
  score = 0;
  document.getElementById("score").innerText = score;

  food = randomFood();

  clearInterval(game);
  game = setInterval(drawGame, 120);
}

function randomFood() {
  return {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
  };
}

document.addEventListener("keydown", changeDirection);

function changeDirection(e) {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
}

function drawGame() {
  ctx.clearRect(0, 0, 400, 400);

  // draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "lime" : "green";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // draw food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "LEFT") headX -= box;
  if (direction === "UP") headY -= box;
  if (direction === "RIGHT") headX += box;
  if (direction === "DOWN") headY += box;

  // game over conditions
  if (
    headX < 0 ||
    headY < 0 ||
    headX >= 400 ||
    headY >= 400 ||
    collision(headX, headY, snake)
  ) {
    clearInterval(game);
    alert("Game Over! Score: " + score);
    return;
  }

  let newHead = { x: headX, y: headY };

  // eat food
  if (headX === food.x && headY === food.y) {
    score++;
    document.getElementById("score").innerText = score;
    food = randomFood();
  } else {
    snake.pop();
  }

  snake.unshift(newHead);
}

function collision(x, y, array) {
  return array.some(segment => segment.x === x && segment.y === y);
}

