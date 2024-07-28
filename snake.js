const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');

const gridSize = 20;
const canvasSize = 400;

let snake = [
    { x: gridSize * 5, y: gridSize * 5 }
];
let direction = { x: gridSize, y: 0 };
let food = getRandomFoodPosition();
let score = 0;
let gameInterval;

function gameLoop() {
    update();
    draw();
}

function update() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreElement.textContent = score;
        food = getRandomFoodPosition();
    } else {
        snake.pop();
    }

    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize || collision()) {
        endGame();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'green';
    snake.forEach(part => ctx.fillRect(part.x, part.y, gridSize, gridSize));
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function getRandomFoodPosition() {
    return {
        x: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize
    };
}

function collision() {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    return false;
}

function endGame() {
    clearInterval(gameInterval);
    finalScoreElement.textContent = score;
    gameOverElement.classList.remove('hidden');
}

function startGame() {
    gameOverElement.classList.add('hidden');
    snake = [{ x: gridSize * 5, y: gridSize * 5 }];
    direction = { x: gridSize, y: 0 };
    food = getRandomFoodPosition();
    score = 0;
    scoreElement.textContent = score;
    gameInterval = setInterval(gameLoop, 150);
}

window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':
            if (direction.y === 0) {
                direction = { x: 0, y: -gridSize };
            }
            break;
        case 'ArrowDown':
            if (direction.y === 0) {
                direction = { x: 0, y: gridSize };
            }
            break;
        case 'ArrowLeft':
            if (direction.x === 0) {
                direction = { x: -gridSize, y: 0 };
            }
            break;
        case 'ArrowRight':
            if (direction.x === 0) {
                direction = { x: gridSize, y: 0 };
            }
            break;
    }
});

startGame();
