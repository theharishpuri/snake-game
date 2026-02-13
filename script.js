const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const overlay = document.getElementById("overlay");
const message = document.getElementById("message");
const startBtn = document.getElementById("startBtn");
const highScoreEl = document.getElementById("highScore");
const levelSelect = document.getElementById("levelSelect");

const box = 20;

let snake, food, direction;
let score = 0;
let speed = 120;
let lastTime = 0;
let running = false;


// ================== LEVEL SELECT ==================
levelSelect.addEventListener("change", () => {
  speed = parseInt(levelSelect.value);
});


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
  running = true;
  lastTime = 0;

  document.getElementById("score").innerText = score;

  food = randomFood();

  requestAnimationFrame(gameLoop);
}


// ================== MOBILE BUTTON FUNCTION ==================
function setDirection(dir) {
  if (dir === "up" && direction !== "DOWN") direction = "UP";
  if (dir === "down" && direction !== "UP") direction = "DOWN";
  if (dir === "left" && direction !== "RIGHT") direction = "LEFT";
  if (dir === "right" && direction !== "LEFT") direction = "RIGHT";
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

  // snake
  for (let i = 0; i < snake.length; i++) {
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#00ff66";
    ctx.fillStyle = i === 0 ? "#00ff99" : "#00cc66";
    ctx.fillRect(snake[i].x, snake[i].y, box - 2, box - 2);
  }
  ctx.shadowBlur = 0;

  // name text
  ctx.fillStyle = "white";
  ctx.font = "14px Arial";
  ctx.fillText("By Harish", 10, canvas.height - 10);

  // food glow
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


  // collision check
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


// ================== KEYBOARD ==================
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});


// ================== MOBILE BUTTONS ==================
document.getElementById("up").onclick = () => setDirection("up");
document.getElementById("down").onclick = () => setDirection("down");
document.getElementById("left").onclick = () => setDirection("left");
document.getElementById("right").onclick = () => setDirection("right");
