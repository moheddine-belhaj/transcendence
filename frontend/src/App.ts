import { LoginForm } from './auth/LoginForm';
import { RegisterForm } from './auth/RegisterForm';
import { UserList } from './users/UserList';
import { getCurrentUser, isAuthenticated, logout } from './utils/auth';

export class App {
  private appContainer: HTMLElement;

  constructor() {
    this.appContainer = document.getElementById('app') as HTMLElement;
    this.render();
  }

  private render(): void {
    if (isAuthenticated()) {
      this.showDashboard();
    } else {
      this.showAuth();
    }
  }

  private showAuth(): void {
    this.appContainer.innerHTML = `
      <div class="auth-page">
        <div id="auth-container"></div>
        <div class="auth-switch">
          <button id="switch-auth">Switch to Register</button>
        </div>
      </div>
    `;

    const authContainer = document.getElementById('auth-container') as HTMLElement;
    const switchButton = document.getElementById('switch-auth') as HTMLButtonElement;

    let isLogin = true;
    new LoginForm(authContainer, () => window.location.reload());

    switchButton.addEventListener('click', () => {
      isLogin = !isLogin;
      switchButton.textContent = isLogin ? 'Switch to Register' : 'Switch to Login';
      authContainer.innerHTML = '';
      
      if (isLogin) {
        new LoginForm(authContainer, () => window.location.reload());
      } else {
        new RegisterForm(authContainer, () => {
          isLogin = true;
          switchButton.textContent = 'Switch to Register';
          authContainer.innerHTML = '';
          new LoginForm(authContainer, () => window.location.reload());
        });
      }
    });
  }

  private showDashboard(): void {

    const user = getCurrentUser();
  
    if (!user) {
      console.error('No user data found');
      localStorage.removeItem('token');
      this.showAuth();
      return;
    }
    console.log('Showing dashboard'); 
    console.log('Current user:', getCurrentUser()); 
    
    this.appContainer.innerHTML = `
      <div class="dashboard">
        <header>
          <h1>Welcome ${getCurrentUser()?.name || 'User'}!</h1>
          <button id="logout">Logout</button>
        </header>
        <main>
          <div id="user-list">Loading users...</div>
        </main>
      </div>
    `;
  
    console.log('Before UserList render');

    new UserList(document.getElementById('user-list') as HTMLElement).render()
    .then(() => console.log('UserList rendered')) 
    .catch(err => console.error('UserList error:', err));
    
    document.getElementById('logout')?.addEventListener('click', () => {
      logout();
    });
  }
}