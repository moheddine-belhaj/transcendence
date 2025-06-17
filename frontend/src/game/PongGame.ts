import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Color3 } from '@babylonjs/core';
import { AdvancedDynamicTexture, TextBlock } from '@babylonjs/gui';

import { MatchService } from '../services/matchService';

export class PongGame {
    private canvas: HTMLCanvasElement;
    private engine: Engine;
    private scene: Scene;
    private camera: ArcRotateCamera;

    // Game objects
    private ball: any;
    private paddle1: any;
    private paddle2: any;
    private topWall: any;
    private bottomWall: any;

    // Game state
    private ballVelocity: Vector3;
    private scores: { player1: number, player2: number };
    private gameActive: boolean;
    
    // Input
    private keys: Record<string, boolean>;
    private paddleSpeed: number;
    
    // UI elements
    private playerInfoEl: HTMLElement;
    private scoreEl: HTMLElement;
    private gameStatusEl: HTMLElement;
    private gameMessageEl: HTMLElement;
    private messageTextEl: HTMLElement;
    private restartBtnEl: HTMLElement;
    private scoreText: TextBlock | null;



        private matchId: number | null = null;
    private player1Id: number;
    private player2Id: number;


    constructor(player1Id: number, player2Id: number) {
        this.canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
        this.engine = new Engine(this.canvas, true);
        this.scene = new Scene(this.engine);
        this.camera = new ArcRotateCamera("camera", -Math.PI / 4, Math.PI / 3, 60, Vector3.Zero(), this.scene);

        // Game state
        this.ballVelocity = new Vector3(0.2, 0.1, 0);
        this.scores = { player1: 0, player2: 0 };
        this.gameActive = true;
        this.paddleSpeed = 0.5;

        // Input
        this.keys = {};
        
        // Get UI elements
        this.playerInfoEl = document.getElementById('playerInfo') as HTMLElement;
        this.scoreEl = document.getElementById('score') as HTMLElement;
        this.gameStatusEl = document.getElementById('gameStatus') as HTMLElement;
        this.gameMessageEl = document.getElementById('gameMessage') as HTMLElement;
        this.messageTextEl = document.getElementById('messageText') as HTMLElement;
        this.restartBtnEl = document.getElementById('restartBtn') as HTMLElement;
        this.scoreText = null;
        

                this.player1Id = player1Id;
        this.player2Id = player2Id;
        
        // this.init();
        this.init();
    }
    
    async init() {
        await this.createScene();
        this.setupInput();
        this.startGame();
        this.startRenderLoop();
        
        window.addEventListener('resize', () => {
            this.engine.resize();
        });
    }
    
    async createScene() {
        // Camera setup
        this.camera.setTarget(Vector3.Zero());
        this.camera.attachControl(this.canvas, true);
        this.camera.lowerBetaLimit = Math.PI / 6;
        this.camera.upperBetaLimit = Math.PI / 2;
        this.camera.lowerRadiusLimit = 40;
        this.camera.upperRadiusLimit = 80;
        
        // Lighting
        const light = new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);
        light.intensity = 0.8;
        
        // Create game field
        this.createGameField();
        
        // Create game objects
        this.createPaddles();
        this.createBall();
        
        // Create GUI
        this.createGUI();

        // Update UI
        this.playerInfoEl.textContent = 'Local Pong Game';
        this.gameStatusEl.textContent = 'Game running!';
        this.updateScore();
    }
    
    createGameField() {
        const fieldWidth = 40;
        const fieldHeight = 20;
        
        // Create walls (invisible collision)
        this.topWall = MeshBuilder.CreateBox("topWall", {width: fieldWidth, height: 0.5, depth: 1}, this.scene);
        this.topWall.position.y = fieldHeight / 2;
        this.topWall.isVisible = false;
        
        this.bottomWall = MeshBuilder.CreateBox("bottomWall", {width: fieldWidth, height: 0.5, depth: 1}, this.scene);
        this.bottomWall.position.y = -fieldHeight / 2;
        this.bottomWall.isVisible = false;
        
        // Center line
        const centerLine = MeshBuilder.CreateBox("centerLine", {width: 0.2, height: fieldHeight, depth: 0.5}, this.scene);
        centerLine.position.x = 0;
        const centerLineMaterial = new StandardMaterial("centerLineMaterial", this.scene);
        centerLineMaterial.diffuseColor = new Color3(1, 1, 1);
        centerLine.material = centerLineMaterial;
        
        // Field outline
        const fieldOutline = MeshBuilder.CreateBox("fieldOutline", {width: fieldWidth + 1, height: fieldHeight + 1, depth: 2}, this.scene);
        const outlineMaterial = new StandardMaterial("outlineMaterial", this.scene);
        outlineMaterial.diffuseColor = new Color3(0.1, 0.1, 0.1);
        outlineMaterial.alpha = 0.3;
        fieldOutline.material = outlineMaterial;
    }
    
    createPaddles() {
        // Paddle 1 (left)
        this.paddle1 = MeshBuilder.CreateBox("paddle1", {width: 1.5, height: 6, depth: 0.8}, this.scene);
        this.paddle1.position.x = -18;
        this.paddle1.position.y = 0;
        const paddle1Material = new StandardMaterial("paddle1Material", this.scene);
        paddle1Material.diffuseColor = new Color3(0, 1, 0);
        this.paddle1.material = paddle1Material;
        
        // Paddle 2 (right)
        this.paddle2 = MeshBuilder.CreateBox("paddle2", {width: 1.5, height: 6, depth: 0.8}, this.scene);
        this.paddle2.position.x = 18;
        this.paddle2.position.y = 0;
        const paddle2Material = new StandardMaterial("paddle2Material", this.scene);
        paddle2Material.diffuseColor = new Color3(0, 0, 1);
        this.paddle2.material = paddle2Material;
    }
    
    createBall() {
        this.ball = MeshBuilder.CreateSphere("ball", {diameter: 1.2, segments: 16}, this.scene);
        this.ball.position.x = 0;
        this.ball.position.y = 0;
        const ballMaterial = new StandardMaterial("ballMaterial", this.scene);
        ballMaterial.diffuseColor = new Color3(1, 1, 1);
        this.ball.material = ballMaterial;
    }
    
    createGUI() {
        const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        
        // Score display
        this.scoreText = new TextBlock();
        this.scoreText.text = "0 - 0";
        this.scoreText.color = "white";
        this.scoreText.fontSize = 48;
        this.scoreText.top = "-200px";
        advancedTexture.addControl(this.scoreText);
    }
    
    setupInput() {
        // Keyboard input
        window.addEventListener('keydown', (event) => {
            this.keys[event.code] = true;
        });
        
        window.addEventListener('keyup', (event) => {
            this.keys[event.code] = false;
        });

        // Mouse input
        this.canvas.addEventListener('mousemove', (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const y = event.clientY - rect.top;
            const normalizedY = (y / rect.height) * 2 - 1;
            if (this.keys['KeyW'] || this.keys['KeyS']) {
                this.paddle1.position.y = -normalizedY * 10;
            }
            if (this.keys['ArrowUp'] || this.keys['ArrowDown']) {
                this.paddle2.position.y = -normalizedY * 10;
            }
        });
        
        // Restart button
        this.restartBtnEl.addEventListener('click', () => {
            this.resetGame();
        });
    }
    
    // async startGame() {
    //     try {
    //         // Create a new match record when game starts
    //         const match = await MatchService.createMatch(this.player1Id, this.player2Id);
    //         this.matchId = match.id;
    //         this.gameActive = true;
    //         this.hideGameMessage();
    //     } catch (error) {
    //         console.error('Error creating match:', error);
    //         this.showGameMessage('Failed to start match tracking', false);
    //     }
    // }
    
 private async startGame() {
        try {
            const match = await MatchService.createMatch(this.player1Id, this.player2Id);
            this.matchId = match.id;
            this.gameActive = true;
            this.hideGameMessage();
        } catch (error) {
            console.error('Error creating match:', error);
            let errorMessage = 'Unknown error';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            this.showGameMessage(`Failed to start match tracking: ${errorMessage}`, false);
            // Fallback - allow playing without tracking
            this.gameActive = true;
            this.hideGameMessage();
        }
    }

    private async endGame(winner: 'player1' | 'player2') {
        if (!this.matchId) {
            console.log('Game not tracked - skipping result update');
            return;
        }

        const winnerId = winner === 'player1' ? this.player1Id : this.player2Id;
        
        try {
            await MatchService.updateMatchResult(
                this.matchId,
                this.scores.player1,
                this.scores.player2,
                winnerId
            );
        } catch (error) {
            console.error('Error updating match result:', error);
            let errorMessage = 'Unknown error';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            this.showGameMessage(`Game over! (Stats not saved: ${errorMessage})`, true);
        }
    }

    resetGame() {
        this.ball.position.x = 0;
        this.ball.position.y = 0;
        this.ballVelocity = new Vector3(
            Math.random() > 0.5 ? 0.2 : -0.2,
            (Math.random() - 0.5) * 0.2,
            0
        );
        this.scores = { player1: 0, player2: 0 };
        this.updateScore();
        this.startGame();
    }
    
    // async endGame(winner: 'player1' | 'player2') {
    //     if (!this.matchId) return;
        
    //     const winnerId = winner === 'player1' ? this.player1Id : this.player2Id;
        
    //     try {
    //         await MatchService.updateMatchResult(
    //             this.matchId,
    //             this.scores.player1,
    //             this.scores.player2,
    //             winnerId
    //         );
    //     } catch (error) {
    //         console.error('Error updating match result:', error);
    //     }
    // }

    updateScore() {
        this.scoreEl.textContent = `Score: ${this.scores.player1} - ${this.scores.player2}`;
        if (this.scoreText) {
            this.scoreText.text = `${this.scores.player1} - ${this.scores.player2}`;
        }

                if (this.scores.player1 >= 5 || this.scores.player2 >= 5) {
            const winner = this.scores.player1 >= 5 ? 'player1' : 'player2';
            const winnerName = winner === 'player1' ? "Player 1" : "Player 2";
            
            this.showGameMessage(`${winnerName} Wins!`, true);
            this.gameActive = false;
            
            // Send game result to backend
            this.endGame(winner);
        }
    }
    
    showGameMessage(message: string, showRestart = false) {
        this.messageTextEl.textContent = message;
        this.gameMessageEl.style.display = 'block';
        this.restartBtnEl.style.display = showRestart ? 'block' : 'none';
    }
    
    hideGameMessage() {
        this.gameMessageEl.style.display = 'none';
    }
    
    handleInput() {
        // Player 1 controls (W/S or Up/Down)
        if (this.keys['KeyW']) {
            this.paddle1.position.y += this.paddleSpeed;
        }
        if (this.keys['KeyS']) {
            this.paddle1.position.y -= this.paddleSpeed;
        }
        
        // Player 2 controls (Up/Down arrows)
        if (this.keys['ArrowUp']) {
            this.paddle2.position.y += this.paddleSpeed;
        }
        if (this.keys['ArrowDown']) {
            this.paddle2.position.y -= this.paddleSpeed;
        }
        
        // Keep paddles within bounds
        const paddleLimit = 7;
        this.paddle1.position.y = Math.max(-paddleLimit, Math.min(paddleLimit, this.paddle1.position.y));
        this.paddle2.position.y = Math.max(-paddleLimit, Math.min(paddleLimit, this.paddle2.position.y));
    }
    
    updateGame() {
        if (!this.gameActive) return;
        
        // Move ball
        this.ball.position.addInPlace(this.ballVelocity);
        
        // Ball collision with top/bottom walls
        if (this.ball.position.y > this.topWall.position.y - 1 || 
            this.ball.position.y < this.bottomWall.position.y + 1) {
            this.ballVelocity.y *= -1;
        }
        
        // Ball collision with paddles
        if ((this.ball.position.x < this.paddle1.position.x + 1 && 
             this.ball.position.x > this.paddle1.position.x - 1 &&
             Math.abs(this.ball.position.y - this.paddle1.position.y) < 3) ||
            (this.ball.position.x > this.paddle2.position.x - 1 && 
             this.ball.position.x < this.paddle2.position.x + 1 &&
             Math.abs(this.ball.position.y - this.paddle2.position.y) < 3)) {
            this.ballVelocity.x *= -1.1; // Increase speed slightly on hit
            this.ballVelocity.y *= 1.1;
        }
        
        // Ball out of bounds (score)
        if (this.ball.position.x < -20) {
            this.scores.player2++;
            this.updateScore();
            this.resetBall();
        } else if (this.ball.position.x > 20) {
            this.scores.player1++;
            this.updateScore();
            this.resetBall();
        }
        
        // Game over condition
        if (this.scores.player1 >= 5 || this.scores.player2 >= 5) {
            const winner = this.scores.player1 >= 5 ? "Player 1" : "Player 2";
            this.showGameMessage(`${winner} Wins!`, true);
            this.gameActive = false;
        }
    }
    
    resetBall() {
        if (!this.gameActive) return;
        
        this.ball.position.x = 0;
        this.ball.position.y = 0;
        this.ballVelocity = new Vector3(
            Math.random() > 0.5 ? 0.2 : -0.2,
            (Math.random() - 0.5) * 0.2,
            0
        );
    }
    
    startRenderLoop() {
        this.engine.runRenderLoop(() => {
            this.handleInput();
            this.updateGame();
            this.scene.render();
        });
    }
}

// Start the game when the page loads
window.addEventListener('DOMContentLoaded', () => {
    // Replace these with actual player IDs as needed
    const player1Id = 1;
    const player2Id = 2;
    new PongGame(player1Id, player2Id);
});