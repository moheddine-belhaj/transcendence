import { BasePage } from "../core/BasePage";
import { PongGame } from "../game/PongGame";

export class GamePage extends BasePage {
  protected loadTemplate(): Promise<string> {
      throw new Error("Method not implemented.");
  }
  private game: PongGame | null = null;

  async mount() {
    const container = document.createElement('div');
    container.id = 'game-container';
    container.innerHTML = `
      <div id="gameContainer">
        <canvas id="renderCanvas"></canvas>
        
        <div id="ui">
          <div id="playerInfo">Waiting for connection...</div>
          <div id="score">Score: 0 - 0</div>
          <div id="gameStatus">Waiting for players...</div>
        </div>
        
        <div id="instructions">
          <div>Player 1: Use W/S or ↑/↓ to move paddle</div>
          <div>Player 2: Use ↑/↓ to move paddle</div>
        </div>
        
        <div id="gameMessage" class="game-message" style="display: none;">
          <div id="messageText"></div>
          <button id="restartBtn" style="display: none;">Restart Game</button>
        </div>
      </div>
    `;

    // Add the game styles
    const style = document.createElement('style');
    style.textContent = `
      body {
        margin: 0;
        padding: 0;
        background: #000;
        font-family: 'Arial', sans-serif;
        overflow: hidden;
      }
      
      #gameContainer {
        width: 100vw;
        height: 100vh;
        position: relative;
      }
      
      #renderCanvas {
        width: 100%;
        height: 100%;
        display: block;
        touch-action: none;
      }
      
      #ui {
        position: absolute;
        top: 20px;
        left: 20px;
        color: white;
        z-index: 100;
        font-size: 18px;
      }
      
      #instructions {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        color: white;
        text-align: center;
        z-index: 100;
      }
      
      .game-message {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 24px;
        text-align: center;
        z-index: 100;
        background: rgba(0, 0, 0, 0.8);
        padding: 20px;
        border-radius: 10px;
      }
      
      button {
        background: #4CAF50;
        border: none;
        color: white;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 10px;
        cursor: pointer;
        border-radius: 5px;
      }
      
      button:hover {
        background: #45a049;
      }
    `;
    container.appendChild(style);

    // Initialize the game after the DOM is ready
    setTimeout(() => {
      // Replace 1 and 2 with actual player IDs as needed
      this.game = new PongGame(1, 2);
    }, 0);

    return container;
  }

  destroy() {
    if (this.game) {
      // Clean up game resources here if needed
    }
    super.destroy();
  }
}