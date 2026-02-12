// sounds
const eatSound = new Audio("sounds/eat.mp3");
const gameOverSound = new Audio("sounds/gameover.mp3");
const clickSound = new Audio("sounds/click.mp3");
const overlay = document.getElementById("overlay");
const message = document.getElementById("message");
const startBtn = document.getElementById("startBtn");
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const highScoreEl = document.getElementById("highScore");

const box = 20; // grid size

let snake;
let food;
let lastTime = 0;
let direction;
let score;
let game;
let speed = 120; // starting speed (smaller = faster)
let level = 1;
let highScore = localStorage.getItem("snakeHighScore") || 0;
highScoreEl.innerText = highScore;

function startGame() {
 startBtn.addEventListener("click", () => {
  clickSound.play(); // 🔊 added
  overlay.style.display = "none";
  startGame();requestAnimationFrame(gameLoop);

});
 snake = [{ x: 9 * box, y: 9 * box }];
  direction = null;
  score = 0;
  speed = 120;
  level = 1;

  document.getElementById("score").innerText = score;

  food = randomFood();

  clearInterval(game);
  requestAnimationFrame(gameLoop);
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
    ctx.shadowBlur = 15;
ctx.shadowColor = "#00ff66";

ctx.fillStyle = i === 0 ? "#00ff99" : "#00cc66";
ctx.fillRect(snake[i].x, snake[i].y, box - 2, box - 2);

ctx.shadowBlur = 0;


  // draw food
  let pulse = 6 + Math.sin(Date.now() / 120) * 4;

ctx.shadowBlur = 20;
ctx.shadowColor = "red";

ctx.fillStyle = "red";
ctx.fillRect(
  food.x + box/2 - pulse/2,
  food.y + box/2 - pulse/2,
  pulse,
  pulse
);

ctx.shadowBlur = 0;


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
gameOverSound.play();

  message.innerText = "Game Over 😢\nScore: " + score;
  startBtn.innerText = "Restart";
  overlay.style.display = "flex";

  return;
}


  let newHead = { x: headX, y: headY };

  // eat food
if (headX === food.x && headY === food.y) {
  score++;
  document.getElementById("score").innerText = score;
  food = randomFood();
if (score > highScore) {
  highScore = score;
  highScoreEl.innerText = highScore;
  localStorage.setItem("snakeHighScore", highScore);
}

  eatSound.play(); // 🔊 added

  if (score % 5 === 0) {
    level++;
    speed -= 10;

    clearInterval(game);
  requestAnimationFrame(gameLoop);

  }
}

 else {
    snake.pop();
  }

  snake.unshift(newHead);
}

function collision(x, y, array) {
  return array.some(segment => segment.x === x && segment.y === y);
}
function gameLoop(timestamp) {
  if (timestamp - lastTime > speed) {
    drawGame();
    lastTime = timestamp;
  }
  requestAnimationFrame(gameLoop);
}

// ==========================
// MOBILE TOUCH CONTROLS
// ==========================

let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener("touchstart", function (e) {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});

canvas.addEventListener("touchend", function (e) {
  let touchEndX = e.changedTouches[0].clientX;
  let touchEndY = e.changedTouches[0].clientY;

  let dx = touchEndX - touchStartX;
  let dy = touchEndY - touchStartY;

  // check if swipe is horizontal or vertical
  if (Math.abs(dx) > Math.abs(dy)) {
    // horizontal swipe
    if (dx > 0 && direction !== "LEFT") direction = "RIGHT";
    else if (dx < 0 && direction !== "RIGHT") direction = "LEFT";
  } else {
    // vertical swipe
    if (dy > 0 && direction !== "UP") direction = "DOWN";
    else if (dy < 0 && direction !== "DOWN") direction = "UP";
  }
});
