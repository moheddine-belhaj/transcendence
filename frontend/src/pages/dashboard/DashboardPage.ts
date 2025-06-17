import { BasePage } from '../../core/BasePage';
import template from './dashboard-page.html'
import { Navbar } from '../../components/Navbar';
import { getCurrentUser, logout} from '../../utils/auth';
import { WelcomeBanner } from '../../components/WelcomeBanner';
import { FriendsList } from '../../components/FriendsList';
import { GameHistory } from '../../components/GameHistory';
import { DropdownSearch } from '../../components/DropdownSearch';
import { UserService } from '../../api/users';
import { MatchService } from '../../services/matchService';




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
    // Games are now only started through the Challenge button in the friends list
    // This method is kept for compatibility but doesn't create games anymore
    console.log('Use the Challenge button in the friends list to start a game');
}
  protected initEventListeners(): void {
  }    async mount(): Promise<HTMLElement> {
    const element = await super.mount();
    this.displayNavbar()
    this.displayWelcomeBanner()
    await this.displayFriendsList()
    await this.displayGameHistory()
    return element;
  }

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
  private async displayFriendsList(){
    try {
      const user = getCurrentUser();
      if (user) {
        // Load friends from API
        const friends = await UserService.getFriends(user.id);
        
        // Map API response to FriendsList format
        const mappedFriends = friends.map(friend => ({
          userId: friend.id.toString(),
          username: friend.name,
          isOnline: false // You might want to add online status to your API
        }));
        
        // Create new FriendsList with actual friends data
        this.friendsList = new FriendsList({friends: mappedFriends});
      }
    } catch (error) {
      console.error('Failed to load friends:', error);
      // Keep the existing empty friendsList if loading fails
    }
      const friendsList = this.container.querySelector('#friends-list-container');
    if (friendsList) {
      const friendsListElement = this.friendsList.mount();
      friendsList.appendChild(friendsListElement);
      
      // Listen for friend challenge events
      friendsListElement.addEventListener('friend-challenge', (e: Event) => {
        const customEvent = e as CustomEvent;
        this.handleFriendChallenge(customEvent.detail.friendId, customEvent.detail.friendName);
      });
    }
    const dropdown = this.container.querySelector('#add-friends-dropdown');
    if (dropdown) {
      dropdown.appendChild(this.dropdownSearch.mount());
    }
  }  private async displayGameHistory(){
    try {
      const user = getCurrentUser();
      if (user) {
        // Load matches from API
        const matches = await MatchService.getUserMatches(user.id);
        
        // Load all users to get opponent names
        const allUsers = await UserService.getAllUsers();
        
        // Map API response to GameHistory format
        const mappedMatches = matches.map(match => {
          const isPlayer1 = match.player1Id === user.id;
          const opponentId = isPlayer1 ? match.player2Id : match.player1Id;
          const opponent = allUsers.find(u => u.id === opponentId);
          
          return {
            opponentName: opponent?.name || 'Unknown',
            opponentPoints: isPlayer1 ? match.scorePlayer2 : match.scorePlayer1,
            myPoints: isPlayer1 ? match.scorePlayer1 : match.scorePlayer2
          };
        });
        
        // Create new GameHistory with actual matches data
        this.gameHistory = new GameHistory({matches: mappedMatches});
      }
    } catch (error) {
      console.error('Failed to load game history:', error);
      // Keep the existing empty gameHistory if loading fails
    }
    
    const gameHistory = this.container.querySelector('#game-history-container');
    if (gameHistory) {
      gameHistory.appendChild(this.gameHistory.mount());
    }
  }
  private handleFriendChallenge(friendId: number, friendName: string): void {
    const user = getCurrentUser();
    if (!user) return;
    
    // Navigate to game route with player IDs as URL parameters
    const gameUrl = `/game?player1=${user.id}&player2=${friendId}&player1Name=${encodeURIComponent(user.name)}&player2Name=${encodeURIComponent(friendName)}`;
    this.navigateTo(gameUrl);
  }
}