import { BasePage } from '../../core/BasePage';
import template from './dashboard-page.html'
import { Navbar } from '../../components/Navbar';
import { getCurrentUser, logout} from '../../utils/auth';
import { WelcomeBanner } from '../../components/WelcomeBanner';
import { FriendsList, FriendsListProps } from '../../components/FriendsList';
import { GameHistory } from '../../components/GameHistory';
import { DropdownSearch } from '../../components/DropdownSearch';
import { PongGame } from '../../game/PongGame';




export class DashBoardPage extends BasePage {
  private navbar: Navbar;
  private welcomeBanner: WelcomeBanner
  private friendsList: FriendsList
  private gameHistory: GameHistory
  dropdownSearch:DropdownSearch
  constructor() {
    super();
    const user = getCurrentUser()
    this.navbar = new Navbar({
      username: user?.name || '',
      userInitials: user?.name[0] || '',
      email: user?.email || "",
      onNewGame: () => this.handleNewGame(),
    });
    this.welcomeBanner = new WelcomeBanner({
      username: user?.name || '',
    })
    this.friendsList = new FriendsList({friends:[]})
    this.gameHistory = new GameHistory({matches:[]})
    this.dropdownSearch = new DropdownSearch({})
  }

  protected async loadTemplate(): Promise<string> {
    return template
  }
  
private handleNewGame(): void {
        const user = getCurrentUser();
        if (!user) return;
        
        // For demo purposes, we'll use the current user as player1
        // and a fake opponent as player2. In a real app, you'd match players.
        const player1Id = user.id;
        const player2Id = 2; // This would come from matchmaking
        
        // Create game container
        const gameContainer = document.createElement('div');
        gameContainer.id = 'pong-game-container';
        gameContainer.style.position = 'fixed';
        gameContainer.style.top = '0';
        gameContainer.style.left = '0';
        gameContainer.style.width = '100vw';
        gameContainer.style.height = '100vh';
        gameContainer.style.zIndex = '1000';
        gameContainer.style.backgroundColor = 'black';
        
        // Add game HTML
        gameContainer.innerHTML = `
            <div id="gameContainer">
                <canvas id="renderCanvas"></canvas>
                
                <div id="ui">
                    <div id="playerInfo">Player ${user.name} vs Opponent</div>
                    <div id="score">Score: 0 - 0</div>
                    <div id="gameStatus">Game started!</div>
                </div>
                
                <div id="gameMessage" class="game-message" style="display: none;">
                    <div id="messageText"></div>
                    <button id="restartBtn" style="display: none;">Restart Game</button>
                    <button id="exitBtn">Exit to Dashboard</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(gameContainer);
        
        // Initialize game
        new PongGame(player1Id, player2Id);
        
        // Handle exit button
        const exitBtn = gameContainer.querySelector('#exitBtn');
        if (exitBtn) {
            exitBtn.addEventListener('click', () => {
                document.body.removeChild(gameContainer);
                // Refresh game history to show the new match
                this.displayGameHistory();
            });
        }
    }
  protected initEventListeners(): void {
  }

    async mount(): Promise<HTMLElement> {
    const element = await super.mount();
    this.displayNavbar()
    this.displayWelcomeBanner()
    this.displayFriendsList()
    this.displayGameHistory()
    return element;
  }

  // Removed duplicate handleNewGame method to fix duplicate implementation error

  private displayNavbar(){
     // Mount navbar
    const navbarContainer = this.container.querySelector('#navbar-container');
    if (navbarContainer) {
      navbarContainer.appendChild(this.navbar.mount());
    }
    // Listen to custom events
    const nav = this.navbar.mount()
    nav.addEventListener('new-game', () => {
      console.log('New game event received');
    });
    nav.addEventListener('logout', () => {
      logout()
      this.navigateTo('/login')
    });
  }

  private displayWelcomeBanner(){
     // Mount navbar
    const welcomeContainer = this.container.querySelector('#welcome-banner-container');
    if (welcomeContainer) {
      welcomeContainer.appendChild(this.welcomeBanner.mount());
    }

  }

  private displayFriendsList(){
     const friendsList = this.container.querySelector('#friends-list-container');
    if (friendsList) {
      friendsList.appendChild(this.friendsList.mount());
    }
    const dropdown = this.container.querySelector('#add-friends-dropdown');
    if (dropdown) {
      dropdown.appendChild(this.dropdownSearch.mount());
  }
  }
  private displayGameHistory(){
         const gameHistory = this.container.querySelector('#game-history-container');
    if (gameHistory) {
      gameHistory.appendChild(this.gameHistory.mount());
    }
  }
}

const fakeFriendsList: FriendsListProps = {
  friends: [
    {
      userId: "1a2b3c4d",
      username: "johndoe123",
      isOnline: true
    },
    {
      userId: "5e6f7g8h",
      username: "janedoe456",
      isOnline: false
    },
    {
      userId: "9i0j1k2l",
      username: "alexsmith",
      isOnline: true
    },
    {
      userId: "3m4n5o6p",
      username: "sarahmiller",
      isOnline: false
    },
    {
      userId: "7q8r9s0t",
      username: "mikejones",
      isOnline: true
    }
  ]
};