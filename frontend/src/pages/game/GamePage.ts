import { BasePage } from '../../core/BasePage';
import template from './game-page.html';

declare const BABYLON: any;

declare global {
    interface Window {
        BABYLON: any;
    }
}

class PingPongGame {
    private canvas: HTMLCanvasElement;
    private engine: any;
    private scene: any;
    private camera: any;
    
    private paddle1: any;
    private paddle2: any;
    private ball: any;
    private boundaries: any[] = [];
    
    private gameStarted: boolean = false;
    private gameEnded: boolean = false;
    private score1: number = 0;
    private score2: number = 0;
    private winningScore: number = 5;
    
    private player1Name: string;
    private player2Name: string;
    
    private onPlayerWin: ((winner: string, loser: string, winnerScore: number, loserScore: number) => void) | null = null;
    
    private gameWidth: number = 20;
    private gameHeight: number = 12;
    private paddleSpeed: number = 0.2;
    private ballSpeed: number = 0.15;
    private paddleHeight: number = 3;
    private paddleWidth: number = 0.5;
    
    private ballVelocity = { x: 0, y: 0 };
    
    private keys: { [key: string]: boolean } = {};

    constructor(canvasId: string, player1Name: string = 'Player 1', player2Name: string = 'Player 2', onPlayerWin?: (winner: string, loser: string, winnerScore: number, loserScore: number) => void) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.player1Name = player1Name;
        this.player2Name = player2Name;
        this.onPlayerWin = onPlayerWin || null;
        this.init();
    }
    
    private async init() {
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.scene = new BABYLON.Scene(this.engine);
        
        this.camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 0, -25), this.scene);
        this.camera.setTarget(BABYLON.Vector3.Zero());
        this.camera.fov = 0.8;
        
        const hemisphericLight = new BABYLON.HemisphericLight('hemiLight', new BABYLON.Vector3(0, 1, 0), this.scene);
        hemisphericLight.intensity = 0.6;
        
        const directionalLight = new BABYLON.DirectionalLight('dirLight', new BABYLON.Vector3(-1, -1, -1), this.scene);
        directionalLight.position = new BABYLON.Vector3(20, 40, 20);
        directionalLight.intensity = 0.5;
        
        this.createGameObjects();
        
        this.setupInput();
        
        this.engine.runRenderLoop(() => {
            if (this.gameStarted) {
                this.updateGame();
            }
            this.scene.render();
        });
        
        window.addEventListener('resize', () => {
            this.engine.resize();
        });
        
        this.initializePlayerNames();
        
        console.log('Ping Pong Game initialized! Press SPACE to start.');
    }
    
    private initializePlayerNames() {
        const player1Label = document.getElementById('player1Label');
        const player2Label = document.getElementById('player2Label');
        const player1Instructions = document.getElementById('player1Instructions');
        const player2Instructions = document.getElementById('player2Instructions');
        
        if (player1Label) player1Label.textContent = this.player1Name;
        if (player2Label) player2Label.textContent = this.player2Name;
        if (player1Instructions) player1Instructions.textContent = this.player1Name;
        if (player2Instructions) player2Instructions.textContent = this.player2Name;
    }
    
    private createGameObjects() {
        const paddleGeometry = BABYLON.MeshBuilder.CreateBox('paddle', {
            width: this.paddleWidth,
            height: this.paddleHeight,
            depth: 1.0
        }, this.scene);
        
        paddleGeometry.enableEdgesRendering();
        paddleGeometry.edgesWidth = 2.0;
        paddleGeometry.edgesColor = new BABYLON.Color4(0, 0, 0, 1);
        
        this.paddle1 = paddleGeometry.clone('paddle1');
        this.paddle1.position.x = -this.gameWidth / 2 + 1;
        this.paddle1.position.y = 0;
        this.paddle1.position.z = 0;
        this.paddle1.material = this.create3DMaterial('#00ff00', '#004400'); // Green with darker edges

        this.paddle2 = paddleGeometry.clone('paddle2');
        this.paddle2.position.x = this.gameWidth / 2 - 1;
        this.paddle2.position.y = 0;
        this.paddle2.position.z = 0;
        this.paddle2.material = this.create3DMaterial('#ff0000', '#440000'); // Red with darker edges
        
        paddleGeometry.dispose();
        
        this.ball = BABYLON.MeshBuilder.CreateSphere('ball', { 
            diameter: 0.5, 
            segments: 16 
        }, this.scene);
        this.ball.position = new BABYLON.Vector3(0, 0, 0);
        this.ball.material = this.create3DMaterial('#ffffff', '#cccccc'); // White with slight shading
        
        const boundaryGeometry = BABYLON.MeshBuilder.CreateBox('boundary', {
            width: this.gameWidth,
            height: 0.5,
            depth: 1.5
        }, this.scene);
        
        const topBoundary = boundaryGeometry.clone('topBoundary');
        topBoundary.position.y = this.gameHeight / 2;
        topBoundary.position.z = 0;
        topBoundary.material = this.create3DMaterial('#444444', '#222222');
        this.boundaries.push(topBoundary);
        
        const bottomBoundary = boundaryGeometry.clone('bottomBoundary');
        bottomBoundary.position.y = -this.gameHeight / 2;
        bottomBoundary.position.z = 0;
        bottomBoundary.material = this.create3DMaterial('#444444', '#222222');
        this.boundaries.push(bottomBoundary);

        boundaryGeometry.dispose();

        const centerLine = BABYLON.MeshBuilder.CreateBox('centerLine', {
            width: 0.2,
            height: this.gameHeight,
            depth: 0.3
        }, this.scene);
        centerLine.position.x = 0;
        centerLine.position.z = 2;
        centerLine.material = this.create3DMaterial('#666666', '#333333');
    }
    
    private create3DMaterial(color: string, specularColor?: string) {
        const material = new BABYLON.StandardMaterial('3dmaterial', this.scene);
        material.diffuseColor = BABYLON.Color3.FromHexString(color);
        material.specularColor = BABYLON.Color3.FromHexString(specularColor || '#ffffff');
        material.specularPower = 32;
        material.emissiveColor = BABYLON.Color3.FromHexString(color).scale(0.1);
        
        material.metallicFactor = 0.3;
        material.roughnessFactor = 0.4;
        
        return material;
    }
    
    private setupInput() {
        document.addEventListener('keydown', (event) => {
            this.keys[event.code] = true;
            
            if (event.code === 'Space') {
                event.preventDefault();
                this.startGame();
            }
        });
        
        document.addEventListener('keyup', (event) => {
            this.keys[event.code] = false;
        });
    }
    
    private startGame() {
        this.gameStarted = true;
        this.gameEnded = false;
        
        if (this.score1 >= this.winningScore || this.score2 >= this.winningScore) {
            this.score1 = 0;
            this.score2 = 0;
            this.updateScore();
        }
        
        this.hideWinningScreen();
        
        this.ball.position.x = 0;
        this.ball.position.y = 0;
        
        const angle = (Math.random() - 0.5) * Math.PI / 3; // Random angle within 60 degrees
        const direction = Math.random() > 0.5 ? 1 : -1; // Random horizontal direction
        
        this.ballVelocity.x = direction * this.ballSpeed * Math.cos(angle);
        this.ballVelocity.y = this.ballSpeed * Math.sin(angle);
        
        console.log('Game started!');
    }
    
    private updateGame() {
        if (!this.gameEnded) {
            this.handleInput();
            this.updateBall();
            this.checkCollisions();
        }
        this.update3DEffects();
    }
    
    private update3DEffects() {
        this.ball.rotation.x += 0.1;
        this.ball.rotation.y += 0.05;
        
        // slight tilt to paddles
        if (this.keys['ArrowUp']) {
            this.paddle1.rotation.z = Math.max(this.paddle1.rotation.z - 0.05, -0.2);
        } else if (this.keys['ArrowDown']) {
            this.paddle1.rotation.z = Math.min(this.paddle1.rotation.z + 0.05, 0.2);
        } else {
            // Return to neutral position
            if (this.paddle1.rotation.z > 0) {
                this.paddle1.rotation.z = Math.max(this.paddle1.rotation.z - 0.02, 0);
            } else if (this.paddle1.rotation.z < 0) {
                this.paddle1.rotation.z = Math.min(this.paddle1.rotation.z + 0.02, 0);
            }
        }
        
        if (this.keys['KeyW']) {
            this.paddle2.rotation.z = Math.min(this.paddle2.rotation.z + 0.05, 0.2);
        } else if (this.keys['KeyS']) {
            this.paddle2.rotation.z = Math.max(this.paddle2.rotation.z - 0.05, -0.2);
        } else {
            // Return to neutral position
            if (this.paddle2.rotation.z > 0) {
                this.paddle2.rotation.z = Math.max(this.paddle2.rotation.z - 0.02, 0);
            } else if (this.paddle2.rotation.z < 0) {
                this.paddle2.rotation.z = Math.min(this.paddle2.rotation.z + 0.02, 0);
            }
        }
    }
    
    private handleInput() {
        // Player 1 (Arrow keys)
        if (this.keys['ArrowUp'] && this.paddle1.position.y < this.gameHeight / 2 - this.paddleHeight / 2) {
            this.paddle1.position.y += this.paddleSpeed;
        }
        if (this.keys['ArrowDown'] && this.paddle1.position.y > -this.gameHeight / 2 + this.paddleHeight / 2) {
            this.paddle1.position.y -= this.paddleSpeed;
        }
        
        // Player 2 (W/S keys)
        if (this.keys['KeyW'] && this.paddle2.position.y < this.gameHeight / 2 - this.paddleHeight / 2) {
            this.paddle2.position.y += this.paddleSpeed;
        }
        if (this.keys['KeyS'] && this.paddle2.position.y > -this.gameHeight / 2 + this.paddleHeight / 2) {
            this.paddle2.position.y -= this.paddleSpeed;
        }
    }
    
    private updateBall() {
        this.ball.position.x += this.ballVelocity.x;
        this.ball.position.y += this.ballVelocity.y;
    }
    
    private checkCollisions() {
        // Ball collision with top/bottom boundaries
        if (this.ball.position.y >= this.gameHeight / 2 - 0.25 || 
            this.ball.position.y <= -this.gameHeight / 2 + 0.25) {
            this.ballVelocity.y = -this.ballVelocity.y;
        }
        
        // Ball collision with paddles
        this.checkPaddleCollision(this.paddle1);
        this.checkPaddleCollision(this.paddle2);
        
        // Ball out of bounds (scoring)
        if (this.ball.position.x < -this.gameWidth / 2) {
            this.score2++;
            this.updateScore();
            this.resetBall();
        } else if (this.ball.position.x > this.gameWidth / 2) {
            this.score1++;
            this.updateScore();
            this.resetBall();
        }
    }
    
    private checkPaddleCollision(paddle: any) {
        const ballX = this.ball.position.x;
        const ballY = this.ball.position.y;
        const paddleX = paddle.position.x;
        const paddleY = paddle.position.y;
        
        // Check if ball is within paddle bounds
        if (Math.abs(ballX - paddleX) < (this.paddleWidth / 2 + 0.25) &&
            Math.abs(ballY - paddleY) < (this.paddleHeight / 2 + 0.25)) {
            
            // Reverse horizontal velocity
            this.ballVelocity.x = -this.ballVelocity.x;
            
            // Add some vertical velocity based on where the ball hit the paddle
            const hitPosition = (ballY - paddleY) / (this.paddleHeight / 2);
            this.ballVelocity.y += hitPosition * 0.05;
            
            // Increase ball speed slightly
            this.ballVelocity.x *= 1.05;
            this.ballVelocity.y *= 1.05;
            
            // Limit maximum speed
            const maxSpeed = 0.3;
            if (Math.abs(this.ballVelocity.x) > maxSpeed) {
                this.ballVelocity.x = Math.sign(this.ballVelocity.x) * maxSpeed;
            }
            if (Math.abs(this.ballVelocity.y) > maxSpeed) {
                this.ballVelocity.y = Math.sign(this.ballVelocity.y) * maxSpeed;
            }
        }
    }
    
    private resetBall() {
        // Immediately reset ball to center
        this.ball.position.x = 0;
        this.ball.position.y = 0;
        
        // Reset velocity with random direction
        const angle = (Math.random() - 0.5) * Math.PI / 3;
        const direction = Math.random() > 0.5 ? 1 : -1;
        
        this.ballVelocity.x = direction * this.ballSpeed * Math.cos(angle);
        this.ballVelocity.y = this.ballSpeed * Math.sin(angle);
    }
    
    private updateScore() {
        const score1Element = document.getElementById('score1');
        const score2Element = document.getElementById('score2');
        const player1Label = document.getElementById('player1Label');
        const player2Label = document.getElementById('player2Label');
        
        if (score1Element) score1Element.textContent = this.score1.toString();
        if (score2Element) score2Element.textContent = this.score2.toString();
        if (player1Label) player1Label.textContent = this.player1Name;
        if (player2Label) player2Label.textContent = this.player2Name;
        
        if (this.score1 >= this.winningScore || this.score2 >= this.winningScore) {
            this.endGame();
        }
    }
    
    private endGame() {
        this.gameEnded = true;
        this.gameStarted = false;
        
        const winner = this.score1 >= this.winningScore ? this.player1Name : this.player2Name;
        const loser = this.score1 >= this.winningScore ? this.player2Name : this.player1Name;
        const winnerScore = this.score1 >= this.winningScore ? this.score1 : this.score2;
        const loserScore = this.score1 >= this.winningScore ? this.score2 : this.score1;
        const winnerColor = this.score1 >= this.winningScore ? '#00ff00' : '#ff0000';
        
        if (this.onPlayerWin) {
            this.onPlayerWin(winner, loser, winnerScore, loserScore);
        }
        
        this.showWinningScreen(winner, winnerColor);
    }
    
    private showWinningScreen(winner: string, color: string) {
        let winScreen = document.getElementById('winScreen');
        if (!winScreen) {
            winScreen = document.createElement('div');
            winScreen.id = 'winScreen';
            winScreen.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 40px;
                border-radius: 20px;
                text-align: center;
                font-size: 32px;
                font-weight: bold;
                z-index: 1000;
                border: 3px solid ${color};
                box-shadow: 0 0 30px ${color};
            `;
            document.body.appendChild(winScreen);
        }
        
        winScreen.innerHTML = `
            <div style="color: ${color}; font-size: 48px; margin-bottom: 20px;">
                🏆 ${winner} WINS! 🏆
            </div>
            <div style="font-size: 24px; margin-bottom: 20px;">
                Final Score: ${this.score1} - ${this.score2}
            </div>
            <div style="font-size: 20px; color: #ccc; margin-bottom: 20px;">
                Press SPACE to play again
            </div>
            <div style="margin-top: 20px;">
                <a href="/dashboard" style="color: #60a5fa; text-decoration: none; font-size: 18px; font-weight: 500; padding: 10px 20px; border: 2px solid #60a5fa; border-radius: 8px; display: inline-block; transition: all 0.3s ease;" 
                   onmouseover="this.style.backgroundColor='#60a5fa'; this.style.color='white';" 
                   onmouseout="this.style.backgroundColor='transparent'; this.style.color='#60a5fa';">
                    ← Back to Dashboard
                </a>
            </div>
        `;
        
        winScreen.style.display = 'block';
    }
    
    private hideWinningScreen() {
        const winScreen = document.getElementById('winScreen');
        if (winScreen) {
            winScreen.style.display = 'none';
        }
    }

    public destroy() {
        if (this.engine) {
            this.engine.dispose();
        }
    }
}

export class GamePage extends BasePage {
    private game: PingPongGame | null = null;

    protected async loadTemplate(): Promise<string> {
        return template;
    }

    protected initEventListeners(): void {
    }

    async mount(): Promise<HTMLElement> {
        const element = await super.mount();
        
        // Load Babylon.js if not already loaded
        await this.loadBabylonJS();
        
        // Extract query parameters
        const urlParams = new URLSearchParams(window.location.search);
        const player1Name = urlParams.get('player1') || 'Player 1';
        const player2Name = urlParams.get('player2') || 'Player 2';
        
        // Initialize the game after a short delay to ensure DOM is ready
        setTimeout(() => {
            this.game = new PingPongGame('renderCanvas', player1Name, player2Name, this.onPlayerWin.bind(this));
        }, 100);
        
        return element;
    }

    private async loadBabylonJS(): Promise<void> {
        return new Promise((resolve, reject) => {
            // Check if Babylon.js is already loaded
            if (window.BABYLON) {
                resolve();
                return;
            }

            // Create script element
            const script = document.createElement('script');
            script.src = 'https://cdn.babylonjs.com/babylon.js';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load Babylon.js'));
            
            // Add to head
            document.head.appendChild(script);
        });
    }

    private onPlayerWin(winner: string, loser: string, winnerScore: number, loserScore: number): void {
        // TODO: submit score to backend
        console.log(`Winner: ${winner}`);
        console.log(`Loser: ${loser}`);
        console.log(`Winner Score: ${winnerScore}`);
        console.log(`Loser Score: ${loserScore}`);
        // Add additional win handling logic here as needed
    }

    destroy(): void {
        if (this.game) {
            this.game.destroy();
            this.game = null;
        }
        super.destroy();
    }
}
