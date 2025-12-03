// ===== GAME CONSTANTS & CONFIGURATION =====
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameMessage = document.getElementById('gameMessage');
const playerScoreEl = document.getElementById('playerScore');
const aiScoreEl = document.getElementById('aiScore');
const restartBtn = document.getElementById('restartBtn');

// Set canvas size
canvas.width = 800;
canvas.height = 600;

// Game state
const GAME_STATE = {
    WAITING: 'waiting',
    PLAYING: 'playing',
    GAME_OVER: 'gameOver'
};

let gameState = GAME_STATE.WAITING;
let playerScore = 0;
let aiScore = 0;
const WINNING_SCORE = 7;

// ===== SPEED CONFIGURATION (Classic Pong-style) =====
const INITIAL_BALL_SPEED = 5;      // Starting speed
const SPEED_INCREASE = 0.3;        // Speed increase per paddle hit
const MAX_BALL_SPEED = 12;         // Maximum speed cap

// ===== PADDLE CONFIGURATION =====
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const PADDLE_SPEED = 8;

// Player paddle (bottom)
const playerPaddle = {
    x: canvas.width / 2 - PADDLE_WIDTH / 2,
    y: canvas.height - 30,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    speed: PADDLE_SPEED,
    color: '#ff4757'
};

// AI paddle (top)
const aiPaddle = {
    x: canvas.width / 2 - PADDLE_WIDTH / 2,
    y: 30,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    speed: 6, // Slightly slower for balance
    color: '#ffd32a'
};

// ===== BALL CONFIGURATION (Clown Nose) =====
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 12,
    velocityX: 0,
    velocityY: 0,
    speed: INITIAL_BALL_SPEED,
    color: '#ff0000',
    squash: 1.0 // For squash and stretch animation
};

// ===== INPUT HANDLING =====
let keys = {};
let mouseX = canvas.width / 2;
let mouseMove = false;

// Keyboard input
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;

    // Start game with spacebar
    if (e.key === ' ' && gameState === GAME_STATE.WAITING) {
        startGame();
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Mouse input
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseMove = true;
});

canvas.addEventListener('mouseleave', () => {
    mouseMove = false;
});

// Restart button
restartBtn.addEventListener('click', resetGame);

// ===== AUDIO SYSTEM (Web Audio API - No external files needed) =====
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Generate paddle hit sound (clown honk)
function playPaddleHit() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Clown honk: quick frequency sweep
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Generate wall bounce sound
function playWallHit() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.05);

    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.05);
}

// Generate score sound
function playScore() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.2);

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
}

// Generate win sound (fanfare)
function playWin() {
    const notes = [523, 587, 659, 784]; // C, D, E, G
    notes.forEach((freq, index) => {
        setTimeout(() => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        }, index * 100);
    });
}

// ===== GAME LOGIC =====

// Start the game
function startGame() {
    gameState = GAME_STATE.PLAYING;
    gameMessage.textContent = '';
    resetBall();
}

// Reset ball to center with random direction
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = INITIAL_BALL_SPEED;

    // Random angle between -45 and 45 degrees, going up or down
    const angle = (Math.random() * Math.PI / 2) - Math.PI / 4; // -45° to 45°
    const direction = Math.random() > 0.5 ? 1 : -1; // Up or down

    ball.velocityX = ball.speed * Math.sin(angle);
    ball.velocityY = ball.speed * Math.cos(angle) * direction;

    ball.squash = 1.0;
}

// Update player paddle position
function updatePlayerPaddle() {
    // Mouse control takes priority
    if (mouseMove) {
        playerPaddle.x = mouseX - playerPaddle.width / 2;
    }
    // Keyboard control
    else {
        if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
            playerPaddle.x -= playerPaddle.speed;
        }
        if (keys['ArrowRight'] || keys['d'] || keys['D']) {
            playerPaddle.x += playerPaddle.speed;
        }
    }

    // Keep paddle within bounds
    if (playerPaddle.x < 0) playerPaddle.x = 0;
    if (playerPaddle.x + playerPaddle.width > canvas.width) {
        playerPaddle.x = canvas.width - playerPaddle.width;
    }
}

// Simple AI for opponent paddle
function updateAIPaddle() {
    // AI tracks the ball with some delay for realism
    const paddleCenter = aiPaddle.x + aiPaddle.width / 2;
    const ballX = ball.x;

    // Move towards ball position
    if (paddleCenter < ballX - 10) {
        aiPaddle.x += aiPaddle.speed;
    } else if (paddleCenter > ballX + 10) {
        aiPaddle.x -= aiPaddle.speed;
    }

    // Keep paddle within bounds
    if (aiPaddle.x < 0) aiPaddle.x = 0;
    if (aiPaddle.x + aiPaddle.width > canvas.width) {
        aiPaddle.x = canvas.width - aiPaddle.width;
    }
}

// Update ball position and handle collisions
function updateBall() {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Squash and stretch effect
    ball.squash = 1.0 + Math.abs(ball.velocityY) * 0.01;

    // Wall collision (left and right)
    if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= canvas.width) {
        ball.velocityX = -ball.velocityX;
        ball.x = ball.x - ball.radius <= 0 ? ball.radius : canvas.width - ball.radius;
        playWallHit();
    }

    // Player paddle collision (bottom)
    if (ball.y + ball.radius >= playerPaddle.y &&
        ball.y - ball.radius <= playerPaddle.y + playerPaddle.height &&
        ball.x >= playerPaddle.x &&
        ball.x <= playerPaddle.x + playerPaddle.width) {

        // Calculate hit position for angle variation
        const hitPos = (ball.x - playerPaddle.x) / playerPaddle.width; // 0 to 1
        const angle = (hitPos - 0.5) * (Math.PI / 3); // -60° to 60°

        // Increase speed (Classic Pong mechanic)
        ball.speed = Math.min(ball.speed + SPEED_INCREASE, MAX_BALL_SPEED);

        // Update velocity with new angle and speed
        ball.velocityX = ball.speed * Math.sin(angle);
        ball.velocityY = -Math.abs(ball.speed * Math.cos(angle));

        // Prevent ball from getting stuck
        ball.y = playerPaddle.y - ball.radius;

        playPaddleHit();
    }

    // AI paddle collision (top)
    if (ball.y - ball.radius <= aiPaddle.y + aiPaddle.height &&
        ball.y + ball.radius >= aiPaddle.y &&
        ball.x >= aiPaddle.x &&
        ball.x <= aiPaddle.x + aiPaddle.width) {

        // Calculate hit position for angle variation
        const hitPos = (ball.x - aiPaddle.x) / aiPaddle.width;
        const angle = (hitPos - 0.5) * (Math.PI / 3);

        // Increase speed (Classic Pong mechanic)
        ball.speed = Math.min(ball.speed + SPEED_INCREASE, MAX_BALL_SPEED);

        // Update velocity with new angle and speed
        ball.velocityX = ball.speed * Math.sin(angle);
        ball.velocityY = Math.abs(ball.speed * Math.cos(angle));

        // Prevent ball from getting stuck
        ball.y = aiPaddle.y + aiPaddle.height + ball.radius;

        playPaddleHit();
    }

    // Check for scoring (ball goes out of bounds)
    if (ball.y - ball.radius <= 0) {
        // Player scores
        playerScore++;
        playerScoreEl.textContent = playerScore;
        playScore();
        checkWin();
        if (gameState === GAME_STATE.PLAYING) {
            resetBall();
        }
    } else if (ball.y + ball.radius >= canvas.height) {
        // AI scores
        aiScore++;
        aiScoreEl.textContent = aiScore;
        playScore();
        checkWin();
        if (gameState === GAME_STATE.PLAYING) {
            resetBall();
        }
    }
}

// Check if someone won
function checkWin() {
    if (playerScore >= WINNING_SCORE) {
        gameState = GAME_STATE.GAME_OVER;
        gameMessage.textContent = '🎉 YOU WIN! 🎉';
        restartBtn.style.display = 'block';
        playWin();
    } else if (aiScore >= WINNING_SCORE) {
        gameState = GAME_STATE.GAME_OVER;
        gameMessage.textContent = '🤡 CLOWN WINS! 🤡';
        restartBtn.style.display = 'block';
        playWin();
    }
}

// Reset the game
function resetGame() {
    playerScore = 0;
    aiScore = 0;
    playerScoreEl.textContent = '0';
    aiScoreEl.textContent = '0';
    gameState = GAME_STATE.WAITING;
    gameMessage.textContent = 'Press SPACE to Start!';
    restartBtn.style.display = 'none';
    resetBall();
    ball.velocityX = 0;
    ball.velocityY = 0;
}

// ===== RENDERING =====

// Draw 3D perspective table effect
function drawTable() {
    // Main table surface with gradient for depth
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0c2461');
    gradient.addColorStop(0.5, '#1e3799');
    gradient.addColorStop(1, '#4a69bd');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw center line with perspective
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 3;
    ctx.setLineDash([20, 15]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw decorative polka dots
    ctx.fillStyle = 'rgba(255, 215, 0, 0.15)';
    for (let i = 0; i < 20; i++) {
        const x = (i * 100 + 50) % canvas.width;
        const y = Math.floor(i * 100 / canvas.width) * 100 + 50;
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Draw circus-themed paddle
function drawPaddle(paddle) {
    ctx.save();

    // Paddle body with stripes
    const stripeWidth = paddle.width;
    const stripeHeight = paddle.height / 5;

    for (let i = 0; i < 5; i++) {
        ctx.fillStyle = i % 2 === 0 ? paddle.color : '#ffffff';
        ctx.fillRect(
            paddle.x,
            paddle.y + i * stripeHeight,
            stripeWidth,
            stripeHeight
        );
    }

    // Border/outline
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);

    // Shine effect
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(paddle.x, paddle.y, paddle.width * 0.3, paddle.height);

    ctx.restore();
}

// Draw clown nose ball with squash/stretch
function drawBall() {
    ctx.save();
    ctx.translate(ball.x, ball.y);

    // Apply squash and stretch
    const scaleX = 1 / ball.squash;
    const scaleY = ball.squash;
    ctx.scale(scaleX, scaleY);

    // Main nose body (red and shiny)
    const gradient = ctx.createRadialGradient(-5, -5, 0, 0, 0, ball.radius);
    gradient.addColorStop(0, '#ff6b6b');
    gradient.addColorStop(0.6, '#ff0000');
    gradient.addColorStop(1, '#cc0000');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    // Shine highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(-4, -4, ball.radius * 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Outline
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, ball.radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
}

// Draw speed indicator
function drawSpeedIndicator() {
    const speedPercent = ((ball.speed - INITIAL_BALL_SPEED) / (MAX_BALL_SPEED - INITIAL_BALL_SPEED)) * 100;

    if (speedPercent > 0 && gameState === GAME_STATE.PLAYING) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = 'bold 14px Comic Sans MS';
        ctx.textAlign = 'right';
        ctx.fillText(`Speed: ${Math.round(speedPercent)}%`, canvas.width - 10, 20);
    }
}

// Main render function
function render() {
    // Clear and draw table
    drawTable();

    // Draw game elements
    drawPaddle(playerPaddle);
    drawPaddle(aiPaddle);
    drawBall();
    drawSpeedIndicator();
}

// ===== GAME LOOP =====
function gameLoop() {
    // Update game state
    if (gameState === GAME_STATE.PLAYING) {
        updatePlayerPaddle();
        updateAIPaddle();
        updateBall();
    }

    // Render everything
    render();

    // Continue loop
    requestAnimationFrame(gameLoop);
}

// ===== START GAME =====
// Initialize and start the game loop
gameLoop();
