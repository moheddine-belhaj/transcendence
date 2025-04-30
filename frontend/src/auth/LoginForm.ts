import { AuthService } from '../api/auth';

export class LoginForm {
  private form: HTMLFormElement;

  constructor(private container: HTMLElement, private onSuccess: () => void) {
    this.render();
    this.form = this.container.querySelector('#login-form') as HTMLFormElement;
    this.setupEventListeners();
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="auth-container">
        <h2>Login</h2>
        <form id="login-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" required>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" required>
          </div>
          <button type="submit">Login</button>
        </form>
        <div id="login-message"></div>
      </div>
    `;
  }

  private setupEventListeners(): void {
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = (this.form.querySelector('#email') as HTMLInputElement).value;
      const password = (this.form.querySelector('#password') as HTMLInputElement).value;

      try {
        const result = await AuthService.login(email, password);
        console.log('Login result:', result);

        if (!result.access_token) {
          throw new Error('Access token missing from login response');
        }
        localStorage.setItem('token', result.access_token);
        localStorage.setItem('user', JSON.stringify(result.user));
        console.log('Stored user:', localStorage.getItem('user'));
        this.onSuccess();
      } catch (error) {
        const message = this.container.querySelector('#login-message') as HTMLElement;
        message.textContent = error instanceof Error ? error.message : 'Login failed';
      }
    });
  }

  
}