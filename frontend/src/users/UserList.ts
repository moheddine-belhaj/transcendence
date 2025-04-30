import { UserService, User } from '../api/users';

export class UserList {
  constructor(private container: HTMLElement) {}

  async render(): Promise<void> {
    try {
      const users = await UserService.getAllUsers();
      this.container.innerHTML = `
        <h2>Users</h2>
        <ul class="user-list">
          ${users.map(user => `
            <li>
              <strong>${user.name}</strong> (${user.email})
            </li>
          `).join('')}
        </ul>
      `;
    } catch (error) {
      this.container.innerHTML = `
        <div class="error">
          Failed to load users: ${error instanceof Error ? error.message : 'Unknown error'}
        </div>
      `;
    }
  }
}