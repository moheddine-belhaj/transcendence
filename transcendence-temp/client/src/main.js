import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Color3 } from '@babylonjs/core';
import { AdvancedDynamicTexture, TextBlock } from '@babylonjs/gui';
import { io } from 'socket.io-client';

class PongGame {
    constructor() {
        this.canvas = document.getElementById('renderCanvas');
        this.engine = new Engine(this.canvas, true);
        this.scene = null;
        this.camera = null;

        // Game objects
        this.ball = null;
        this.paddle1 = null;
        this.paddle2 = null;
        this.gameField = null;

        // Network - Use relative URL for production, localhost for development
        const socketUrl = window.location.hostname === 'localhost' ? 'http://localhost:3001' : '';
        this.socket = io(socketUrl);
        this.playerNumber = null;
        this.gameState = null;
        
        // Input
        this.keys = {};
        this.mouseY = 0;
        
        // UI elements
        this.playerInfoEl = document.getElementById('playerInfo');
        this.scoreEl = document.getElementById('score');
        this.gameStatusEl = document.getElementById('gameStatus');
        this.gameMessageEl = document.getElementById('gameMessage');
        this.messageTextEl = document.getElementById('messageText');
        this.restartBtnEl = document.getElementById('restartBtn');
        
        this.init();
    }
    
    async init() {
        await this.createScene();
        this.setupNetworking();
        this.setupInput();
        this.startRenderLoop();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.engine.resize();
        });
    }
    
    async createScene() {
        this.scene = new Scene(this.engine);
        
        // Create camera for 3D perspective
        this.camera = new ArcRotateCamera("camera", -Math.PI / 4, Math.PI / 3, 60, Vector3.Zero(), this.scene);
        this.camera.setTarget(Vector3.Zero());
        this.camera.attachControl(this.canvas, true);
        
        // Set camera limits to maintain good viewing angle
        this.camera.lowerBetaLimit = Math.PI / 6;
        this.camera.upperBetaLimit = Math.PI / 2;
        this.camera.lowerRadiusLimit = 40;
        this.camera.upperRadiusLimit = 80;
        
        // Create lighting for better 3D appearance
        const light = new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);
        light.intensity = 0.8;
        
        // Create game field boundaries
        this.createGameField();
        
        // Create game objects
        this.createPaddles();
        this.createBall();
        
        // Create GUI for score display
        this.createGUI();
    }
    
    createGameField() {
        // Game field dimensions
        const fieldWidth = 40;
        const fieldHeight = 20;
        
        // Create field boundaries (invisible collision boxes)
        const topWall = MeshBuilder.CreateBox("topWall", {width: fieldWidth, height: 0.5, depth: 1}, this.scene);
        topWall.position.y = fieldHeight / 2;
        topWall.isVisible = false;
        
        const bottomWall = MeshBuilder.CreateBox("bottomWall", {width: fieldWidth, height: 0.5, depth: 1}, this.scene);
        bottomWall.position.y = -fieldHeight / 2;
        bottomWall.isVisible = false;
        
        // Create visible field markers
        const centerLine = MeshBuilder.CreateBox("centerLine", {width: 0.2, height: fieldHeight, depth: 0.5}, this.scene);
        centerLine.position.x = 0;
        
        const centerLineMaterial = new StandardMaterial("centerLineMaterial", this.scene);
        centerLineMaterial.diffuseColor = new Color3(1, 1, 1);
        centerLine.material = centerLineMaterial;
        
        // Create 3D field outline
        const fieldOutline = MeshBuilder.CreateBox("fieldOutline", {width: fieldWidth + 1, height: fieldHeight + 1, depth: 2}, this.scene);
        const outlineMaterial = new StandardMaterial("outlineMaterial", this.scene);
        outlineMaterial.diffuseColor = new Color3(0.1, 0.1, 0.1);
        outlineMaterial.alpha = 0.3;
        fieldOutline.material = outlineMaterial;
        fieldOutline.position.y = 0;
    }
    
    createPaddles() {
        // Create paddle 1 (left) with 3D depth
        this.paddle1 = MeshBuilder.CreateBox("paddle1", {width: 1.5, height: 6, depth: 0.8}, this.scene);
        this.paddle1.position.x = -18;
        this.paddle1.position.y = 0;
        
        const paddle1Material = new StandardMaterial("paddle1Material", this.scene);
        paddle1Material.diffuseColor = new Color3(0, 1, 0); // Green
        paddle1Material.specularColor = new Color3(0.2, 0.2, 0.2);
        paddle1Material.roughness = 0.3;
        this.paddle1.material = paddle1Material;
        
        // Create paddle 2 (right) with 3D depth
        this.paddle2 = MeshBuilder.CreateBox("paddle2", {width: 1.5, height: 6, depth: 0.8}, this.scene);
        this.paddle2.position.x = 18;
        this.paddle2.position.y = 0;
        
        const paddle2Material = new StandardMaterial("paddle2Material", this.scene);
        paddle2Material.diffuseColor = new Color3(0, 0, 1); // Blue
        paddle2Material.specularColor = new Color3(0.2, 0.2, 0.2);
        paddle2Material.roughness = 0.3;
        this.paddle2.material = paddle2Material;
    }
    
    createBall() {
        this.ball = MeshBuilder.CreateSphere("ball", {diameter: 1.2, segments: 16}, this.scene);
        this.ball.position.x = 0;
        this.ball.position.y = 0;
        
        const ballMaterial = new StandardMaterial("ballMaterial", this.scene);
        ballMaterial.diffuseColor = new Color3(1, 1, 1); // White
        ballMaterial.specularColor = new Color3(0.8, 0.8, 0.8);
        ballMaterial.roughness = 0.1;
        ballMaterial.emissiveColor = new Color3(0.1, 0.1, 0.1);
        this.ball.material = ballMaterial;
    }
    
    createGUI() {
        const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        
        // Score display
        const scoreText = new TextBlock();
        scoreText.text = "0 - 0";
        scoreText.color = "white";
        scoreText.fontSize = 48;
        scoreText.top = "-200px";
        advancedTexture.addControl(scoreText);
        this.scoreText = scoreText;
    }
    
    setupNetworking() {
        this.socket.on('playerAssigned', (data) => {
            this.playerNumber = data.playerNumber;
            this.gameState = data.gameState;
            this.playerInfoEl.textContent = `You are Player ${this.playerNumber}`;
            
            // Highlight player's paddle
            if (this.playerNumber === 1) {
                this.paddle1.material.emissiveColor = new Color3(0.2, 0.5, 0.2);
            } else if (this.playerNumber === 2) {
                this.paddle2.material.emissiveColor = new Color3(0.2, 0.2, 0.5);
            }
        });
        
        this.socket.on('playersConnected', (data) => {
            if (data.player1 && data.player2) {
                this.gameStatusEl.textContent = 'Both players connected!';
            } else {
                this.gameStatusEl.textContent = 'Waiting for another player...';
            }
        });
        
        this.socket.on('gameStarted', () => {
            this.gameStatusEl.textContent = 'Game started!';
            this.hideGameMessage();
        });
        
        this.socket.on('gameState', (gameState) => {
            this.updateGameObjects(gameState);
        });
        
        this.socket.on('score', (score) => {
            this.updateScore(score);
        });
        
        this.socket.on('gameOver', (data) => {
            this.showGameMessage(`${data.winner} Wins!`, true);
        });
        
        this.socket.on('disconnect', () => {
            this.gameStatusEl.textContent = 'Disconnected from server';
        });
    }
    
    setupInput() {
        // Keyboard input
        window.addEventListener('keydown', (event) => {
            this.keys[event.code] = true;
        });
        
        window.addEventListener('keyup', (event) => {
            this.keys[event.code] = false;
        });
        
        // Mouse input for paddle control
        this.canvas.addEventListener('mousemove', (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const y = event.clientY - rect.top;
            const normalizedY = (y / rect.height) * 2 - 1; // Convert to -1 to 1 range
            this.mouseY = -normalizedY * 10; // Scale to game coordinates
        });
        
        // Restart button
        this.restartBtnEl.addEventListener('click', () => {
            this.socket.emit('restartGame');
        });
    }
    
    updateGameObjects(gameState) {
        if (!gameState) return;
        
        // Update ball position
        this.ball.position.x = gameState.ball.x;
        this.ball.position.y = gameState.ball.y;
        
        // Update paddle positions
        this.paddle1.position.y = gameState.paddle1.y;
        this.paddle2.position.y = gameState.paddle2.y;
    }
    
    updateScore(score) {
        this.scoreEl.textContent = `Score: ${score.player1} - ${score.player2}`;
        if (this.scoreText) {
            this.scoreText.text = `${score.player1} - ${score.player2}`;
        }
    }
    
    showGameMessage(message, showRestart = false) {
        this.messageTextEl.textContent = message;
        this.gameMessageEl.style.display = 'block';
        this.restartBtnEl.style.display = showRestart ? 'block' : 'none';
    }
    
    hideGameMessage() {
        this.gameMessageEl.style.display = 'none';
    }
    
    handleInput() {
        if (!this.playerNumber) return;
        
        let paddleY = 0;
        
        if (this.playerNumber === 1) {
            // Player 1 controls (WASD or Arrow Keys)
            if (this.keys['KeyW'] || this.keys['ArrowUp']) {
                paddleY = this.paddle1.position.y + 0.5;
            }
            if (this.keys['KeyS'] || this.keys['ArrowDown']) {
                paddleY = this.paddle1.position.y - 0.5;
            }
            
            // Mouse control alternative
            if (Math.abs(this.mouseY - this.paddle1.position.y) > 0.5) {
                paddleY = this.mouseY;
            }
        } else if (this.playerNumber === 2) {
            // Player 2 controls (Arrow Keys)
            if (this.keys['ArrowUp']) {
                paddleY = this.paddle2.position.y + 0.5;
            }
            if (this.keys['ArrowDown']) {
                paddleY = this.paddle2.position.y - 0.5;
            }
            
            // Mouse control alternative
            if (Math.abs(this.mouseY - this.paddle2.position.y) > 0.5) {
                paddleY = this.mouseY;
            }
        }
        
        // Send paddle movement to server
        if (paddleY !== 0) {
            this.socket.emit('paddleMove', { y: paddleY });
        }
    }
    
    startRenderLoop() {
        this.engine.runRenderLoop(() => {
            this.handleInput();
            this.scene.render();
        });
    }
}

// Start the game when the page loads
window.addEventListener('DOMContentLoaded', () => {
    new PongGame();
}); 