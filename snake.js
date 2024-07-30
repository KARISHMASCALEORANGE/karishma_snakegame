const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');

const gridSize = 20;
const canvasSize = 400;

let snake = [getrandompos()];
let direction = getrandomdir();
let food = getRandomFoodPosition();
let score = 0;
let gameInterval;
let touchStartX, touchStartY;
let gameStarted = false; // Flag to check if the game has started
let isPaused = false; // Flag to check if the game is paused

function gameLoop() {
    if (!isPaused) {
        update();
        draw();
    }
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

function collision() {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    return false;
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

function getrandompos() {
    return {
        x: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize
    };
}

function endGame() {
    clearInterval(gameInterval);
    finalScoreElement.textContent = score;
    gameOverElement.classList.remove('hidden');
}

function getrandomdir() {
    const directions = [
        { x: gridSize, y: 0 },    // Right
        { x: -gridSize, y: 0 },   // Left
        { x: 0, y: gridSize },    // Down
        { x: 0, y: -gridSize }    // Up
    ];
    return directions[Math.floor(Math.random() * directions.length)];
}

function startGame() {
    gameOverElement.classList.add('hidden');
    snake = [getrandompos()];
    direction = getrandomdir();
    food = getRandomFoodPosition();
    score = 0;
    scoreElement.textContent = score;
    gameInterval = setInterval(gameLoop, 150);
    isPaused = false;
    gameStarted = true;
}

// Keyboard controls
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

// Touch controls
function Touch(event) {
    event.preventDefault();
    const touch = event.touches[0];
    //get the position of an element relative to the viewport
    const x = touch.cX - canvas.getBoundingClientRect().left;
    const y = touch.cY - canvas.getBoundingClientRect().top;

    if (x < canvas.width / 4) {
        if (direction.x !== gridSize) {
            direction = { x: -gridSize, y: 0 };
        }
    } else if (x > canvas.width * 3/4) {
        if (direction.x !== -gridSize) {
            direction = { x: gridSize, y: 0 };
        }
    } else if (y < canvas.height / 4) {
        if (direction.y !== gridSize) {
            direction = { x: 0, y: -gridSize };
        }
    } else if (y > canvas.height * 3/4) {
        if (direction.y !== -gridSize) {
            direction = { x: 0, y: gridSize };
        }
    }

    if (!gameStarted) {
        startGame();
    }
}

// Attach touch event listeners to canvas
canvas.addEventListener('touchstart', Touch);
canvas.addEventListener('touchmove', Touch);

// Start the game initially
startGame();
