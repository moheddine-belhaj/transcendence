import { BaseComponent } from '../core/BaseComponent';

type DropdownSearchProps = {
    // username: string;
    // userInitials: string;
    // email:string;
    // onNewGame?: () => void;
};

export class  DropdownSearch extends BaseComponent<  DropdownSearchProps> {
    protected render(): string {
    return `
        <div class="relative">
            <input
                id="search-friends"
                type="text" 
                placeholder="Search friends..." 
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </div>
        <div  class="border border-gray-200 rounded-lg mb-4 p-4 bg-gray-50" hidden>
            <h4 class="font-medium text-gray-700 mb-3">Add New Friends</h4>
            
            <!-- Search Results -->
            <div class="space-y-3 max-h-60 overflow-y-auto">
                <!-- Friend Result Item -->
                <div class="flex items-center justify-between p-2 hover:bg-white rounded transition duration-150">
                    <div class="flex items-center space-x-3">
                        <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            ES
                        </div>
                        <div>
                            <p class="font-medium">Emma Smith</p>
                            <p class="text-xs text-gray-500">Last active: 1 hour ago</p>
                        </div>
                    </div>
                    <button class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Add
                    </button>
                </div>
                
                <!-- Friend Result Item -->
                <div class="flex items-center justify-between p-2 hover:bg-white rounded transition duration-150">
                    <div class="flex items-center space-x-3">
                        <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            DJ
                        </div>
                        <div>
                            <p class="font-medium">David Johnson</p>
                            <p class="text-xs text-gray-500">Online now</p>
                        </div>
                    </div>
                    <button class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Add
                    </button>
                </div>
                
                <!-- Friend Result Item -->
                <div class="flex items-center justify-between p-2 hover:bg-white rounded transition duration-150">
                    <div class="flex items-center space-x-3">
                        <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            LP
                        </div>
                        <div>
                            <p class="font-medium">Lisa Parker</p>
                            <p class="text-xs text-gray-500">Active today</p>
                        </div>
                    </div>
                    <button class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Add
                    </button>
                </div>
            </div>
        </div>
    `;
    }

    protected setupEventListeners(): void {
    // New Game button
    // this.element.querySelector('#new-game-btn')?.addEventListener('click', () => {
    //     this.props.onNewGame?.();
    //     this.emit('new-game');
    // });
    // User profile click
    // this.element.querySelector('#user-profile')?.addEventListener('click', () => {
    //     this.element.querySelector('#user-dropdown')?.classList.toggle('hidden')
    // });
    // // logout
    // this.element.querySelector('#logout-button')?.addEventListener('click', () => {
    //     this.emit('logout')
    // });
    }
}