const fastify = require('fastify')({ logger: true });
const socketIo = require('socket.io');
const path = require('path');

// Register CORS plugin
fastify.register(require('@fastify/cors'), {
  origin: "*",
  methods: ["GET", "POST"]
});

// Register static files plugin
fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, '../client/dist'),
  prefix: '/'
});

// Initialize Socket.io with Fastify
const io = socketIo(fastify.server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Game state
const gameState = {
  ball: {
    x: 0,
    y: 0,
    velocityX: 5,
    velocityY: 3,
    radius: 0.5
  },
  paddle1: {
    x: -18,
    y: 0,
    width: 1,
    height: 6,
    speed: 8
  },
  paddle2: {
    x: 18,
    y: 0,
    width: 1,
    height: 6,
    speed: 8
  },
  score: {
    player1: 0,
    player2: 0
  },
  gameWidth: 40,
  gameHeight: 20,
  maxScore: 11
};

// Player connections
const players = {};
let gameRunning = false;

// Game physics constants
const BALL_SPEED_INCREASE = 1.05;
const MAX_BALL_SPEED = 15;

function resetBall() {
  gameState.ball.x = 0;
  gameState.ball.y = 0;
  gameState.ball.velocityX = (Math.random() > 0.5 ? 1 : -1) * 5;
  gameState.ball.velocityY = (Math.random() - 0.5) * 6;
}

function updateGame() {
  if (!gameRunning) return;

  const ball = gameState.ball;
  const paddle1 = gameState.paddle1;
  const paddle2 = gameState.paddle2;

  // Update ball position
  ball.x += ball.velocityX * (1/60); // Assuming 60 FPS
  ball.y += ball.velocityY * (1/60);

  // Ball collision with top and bottom walls
  if (ball.y + ball.radius >= gameState.gameHeight / 2 || 
      ball.y - ball.radius <= -gameState.gameHeight / 2) {
    ball.velocityY = -ball.velocityY;
    ball.y = Math.max(-gameState.gameHeight / 2 + ball.radius, 
                     Math.min(gameState.gameHeight / 2 - ball.radius, ball.y));
  }

  // Ball collision with paddles
  function checkPaddleCollision(paddle, isLeftPaddle) {
    const paddleTop = paddle.y + paddle.height / 2;
    const paddleBottom = paddle.y - paddle.height / 2;
    const paddleLeft = paddle.x - paddle.width / 2;
    const paddleRight = paddle.x + paddle.width / 2;

    if (ball.y + ball.radius >= paddleBottom && 
        ball.y - ball.radius <= paddleTop) {
      
      if (isLeftPaddle && ball.x - ball.radius <= paddleRight && ball.velocityX < 0) {
        ball.velocityX = -ball.velocityX * BALL_SPEED_INCREASE;
        ball.velocityY += (ball.y - paddle.y) * 0.2;
        ball.x = paddleRight + ball.radius;
        
        // Limit ball speed
        if (Math.abs(ball.velocityX) > MAX_BALL_SPEED) {
          ball.velocityX = ball.velocityX > 0 ? MAX_BALL_SPEED : -MAX_BALL_SPEED;
        }
        return true;
      } else if (!isLeftPaddle && ball.x + ball.radius >= paddleLeft && ball.velocityX > 0) {
        ball.velocityX = -ball.velocityX * BALL_SPEED_INCREASE;
        ball.velocityY += (ball.y - paddle.y) * 0.2;
        ball.x = paddleLeft - ball.radius;
        
        // Limit ball speed
        if (Math.abs(ball.velocityX) > MAX_BALL_SPEED) {
          ball.velocityX = ball.velocityX > 0 ? MAX_BALL_SPEED : -MAX_BALL_SPEED;
        }
        return true;
      }
    }
    return false;
  }

  checkPaddleCollision(paddle1, true);
  checkPaddleCollision(paddle2, false);

  // Scoring
  if (ball.x < -gameState.gameWidth / 2) {
    gameState.score.player2++;
    resetBall();
    io.emit('score', gameState.score);
    
    if (gameState.score.player2 >= gameState.maxScore) {
      io.emit('gameOver', { winner: 'Player 2' });
      gameRunning = false;
    }
  } else if (ball.x > gameState.gameWidth / 2) {
    gameState.score.player1++;
    resetBall();
    io.emit('score', gameState.score);
    
    if (gameState.score.player1 >= gameState.maxScore) {
      io.emit('gameOver', { winner: 'Player 1' });
      gameRunning = false;
    }
  }

  // Broadcast game state to all clients
  io.emit('gameState', gameState);
}

// Start game loop
function startGameLoop() {
  if (!gameRunning) {
    gameRunning = true;
    resetBall();
    gameState.score.player1 = 0;
    gameState.score.player2 = 0;
  }
  
  setInterval(updateGame, 1000 / 60); // 60 FPS
}

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);
  
  // Assign player
  let playerNumber = null;
  if (!players.player1) {
    players.player1 = socket.id;
    playerNumber = 1;
  } else if (!players.player2) {
    players.player2 = socket.id;
    playerNumber = 2;
  }

  socket.emit('playerAssigned', { playerNumber, gameState });
  socket.emit('playersConnected', { 
    player1: !!players.player1, 
    player2: !!players.player2 
  });

  // Start game when both players are connected
  if (players.player1 && players.player2 && !gameRunning) {
    startGameLoop();
    io.emit('gameStarted');
  }

  // Handle paddle movement
  socket.on('paddleMove', (data) => {
    if (socket.id === players.player1) {
      gameState.paddle1.y = Math.max(
        -gameState.gameHeight / 2 + gameState.paddle1.height / 2,
        Math.min(
          gameState.gameHeight / 2 - gameState.paddle1.height / 2,
          data.y
        )
      );
    } else if (socket.id === players.player2) {
      gameState.paddle2.y = Math.max(
        -gameState.gameHeight / 2 + gameState.paddle2.height / 2,
        Math.min(
          gameState.gameHeight / 2 - gameState.paddle2.height / 2,
          data.y
        )
      );
    }
  });

  // Handle restart game
  socket.on('restartGame', () => {
    if (players.player1 && players.player2) {
      gameRunning = false;
      setTimeout(() => {
        startGameLoop();
        io.emit('gameStarted');
      }, 1000);
    }
  });

  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
    
    if (players.player1 === socket.id) {
      players.player1 = null;
    } else if (players.player2 === socket.id) {
      players.player2 = null;
    }
    
    gameRunning = false;
    
    io.emit('playersConnected', { 
      player1: !!players.player1, 
      player2: !!players.player2 
    });
  });
});

const PORT = process.env.PORT || 3001;

// Start the Fastify server
const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`Game server running on port ${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start(); 