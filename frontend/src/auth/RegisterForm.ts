import { AuthService } from '../api/auth';

export class RegisterForm {
  private form: HTMLFormElement;

  constructor(private container: HTMLElement, private onSuccess: () => void) {
    this.render();
    this.form = this.container.querySelector('#register-form') as HTMLFormElement;
    this.setupEventListeners();
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="auth-container">
        <h2>Register</h2>
        <form id="register-form">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" required>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" required>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" required>
          </div>
          <button type="submit">Register</button>
        </form>
        <div id="register-message"></div>
      </div>
    `;
  }

  private setupEventListeners(): void {
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = (this.form.querySelector('#name') as HTMLInputElement).value;
      const email = (this.form.querySelector('#email') as HTMLInputElement).value;
      const password = (this.form.querySelector('#password') as HTMLInputElement).value;

      try {
        await AuthService.register({ name, email, password });
        const message = this.container.querySelector('#register-message') as HTMLElement;
        message.textContent = 'Registration successful! Please login.';
        this.onSuccess();
      } catch (error) {
        const message = this.container.querySelector('#register-message') as HTMLElement;
        message.textContent = error instanceof Error ? error.message : 'Registration failed';
      }
    });
  }
}