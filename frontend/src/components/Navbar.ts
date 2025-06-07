// src/components/navbar.ts
import { BaseComponent } from '../core/BaseComponent';

type NavbarProps = {
  username: string;
  userInitials: string;
  email:string;
  onNewGame?: () => void;
};

export class Navbar extends BaseComponent<NavbarProps> {
  protected render(): string {
    return `
      <nav class="bg-blue-600 shadow-md">
        <div class="max-w-6xl mx-auto px-4">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center">
              <span class="text-white font-bold text-xl">Transcendance</span>
            </div>
            
            <div class="flex items-center space-x-4">
              <button id="new-game-btn" class="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200">
                New Game
              </button>
              
              <div class="relative ml-3">
                <div id="user-profile" class="flex items-center space-x-2 cursor-pointer">
                  <div class="h-8 w-8 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold">
                    <span>${this.props.userInitials}</span>
                  </div>
                  <span class="text-white text-sm">${this.props.username}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                          <!-- Dropdown menu (hidden by default) -->
          <div id="user-dropdown" class="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
            <div class="px-4 py-3 border-b border-gray-100">
              <p class="text-sm font-medium text-gray-800">Signed in as</p>
              <p class="text-sm text-gray-600 truncate">${this.props.email}</p>
            </div>
            
            <a href="/settings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition duration-150">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </a>
            
            <button id="logout-button" class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition duration-150">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign out
            </button>
          </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    `;
  }

  protected setupEventListeners(): void {
    // New Game button
    this.element.querySelector('#new-game-btn')?.addEventListener('click', () => {
      this.props.onNewGame?.();
      this.emit('new-game');
    });
    // User profile click
    this.element.querySelector('#user-profile')?.addEventListener('click', () => {
      this.element.querySelector('#user-dropdown')?.classList.toggle('hidden')
    });
    // logout
    this.element.querySelector('#logout-button')?.addEventListener('click', () => {
      this.emit('logout')
    });
  }
}