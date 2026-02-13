const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const overlay = document.getElementById("overlay");
const message = document.getElementById("message");
const startBtn = document.getElementById("startBtn");
const highScoreEl = document.getElementById("highScore");

const box = 20;

let snake, food, direction;
let score = 0;
let speed = 120;
let lastTime = 0;
let running = false;

// ================== SOUNDS ==================
const eatSound = new Audio("sounds/eat.mp3");
const gameOverSound = new Audio("sounds/gameover.mp3");
const clickSound = new Audio("sounds/click.mp3");

// ================== HIGH SCORE ==================
let highScore = localStorage.getItem("snakeHighScore") || 0;
highScoreEl.innerText = highScore;

// ================== START BUTTON ==================
startBtn.addEventListener("click", () => {
  clickSound.play();
  overlay.style.display = "none";
  startGame();
});

// ================== START GAME ==================
function startGame() {
  snake = [{ x: 9 * box, y: 9 * box }];
  direction = "RIGHT";
  score = 0;
  speed = 120;
  running = true;

  document.getElementById("score").innerText = score;

  food = randomFood();

  requestAnimationFrame(gameLoop);
}

// ================== FOOD ==================
function randomFood() {
  return {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
  };
}

// ================== GAME LOOP ==================
function gameLoop(timestamp) {
  if (!running) return;

  if (timestamp - lastTime > speed) {
    drawGame();
    lastTime = timestamp;
  }

  requestAnimationFrame(gameLoop);
}

// ================== DRAW GAME ==================
function drawGame() {
  ctx.clearRect(0, 0, 400, 400);

  // draw snake with glow
  for (let i = 0; i < snake.length; i++) {
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#00ff66";
    ctx.fillStyle = i === 0 ? "#00ff99" : "#00cc66";
    ctx.fillRect(snake[i].x, snake[i].y, box - 2, box - 2);
  }
  ctx.shadowBlur = 0;

  // animated food
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
  if (direction === "RIGHT") headX += box;
  if (direction === "UP") headY -= box;
  if (direction === "DOWN") headY += box;

  // collision
  if (
    headX < 0 || headY < 0 ||
    headX >= 400 || headY >= 400 ||
    collision(headX, headY, snake)
  ) {
    running = false;
    gameOverSound.play();

    message.innerText = "Game Over 😢\nScore: " + score;
    startBtn.innerText = "Restart";
    overlay.style.display = "flex";
    return;
  }

  let newHead = { x: headX, y: headY };

  // eat food
  if (headX === food.x && headY === food.y) {
    eatSound.play();

    score++;
    document.getElementById("score").innerText = score;

    if (score > highScore) {
      highScore = score;
      highScoreEl.innerText = highScore;
      localStorage.setItem("snakeHighScore", highScore);
    }

    if (score % 5 === 0) speed -= 10;

    food = randomFood();
  } else {
    snake.pop();
  }

  snake.unshift(newHead);
}

// ================== COLLISION ==================
function collision(x, y, array) {
  return array.some(seg => seg.x === x && seg.y === y);
}
function setDirection(dir) {
  if (dir === 'up' && dy === 0) {
    dx = 0; dy = -grid;
  }
  if (dir === 'down' && dy === 0) {
    dx = 0; dy = grid;
  }
  if (dir === 'left' && dx === 0) {
    dx = -grid; dy = 0;
  }
  if (dir === 'right' && dx === 0) {
    dx = grid; dy = 0;
  }
}

// ================== KEYBOARD ==================
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

// ================== TOUCH ==================
let sx = 0, sy = 0;

canvas.addEventListener("touchstart", e => {
  sx = e.touches[0].clientX;
  sy = e.touches[0].clientY;
});

canvas.addEventListener("touchend", e => {
  let dx = e.changedTouches[0].clientX - sx;
  let dy = e.changedTouches[0].clientY - sy;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0 && direction !== "LEFT") direction = "RIGHT";
    else if (dx < 0 && direction !== "RIGHT") direction = "LEFT";
  } else {
    if (dy > 0 && direction !== "UP") direction = "DOWN";
    else if (dy < 0 && direction !== "DOWN") direction = "UP";
  }
});
// ================== SERVICE WORKER ==================
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
