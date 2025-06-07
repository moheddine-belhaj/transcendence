import { BaseComponent } from '../core/BaseComponent';

export type FriendsListProps = {
  friends:Friend[]
};

type Friend = {
    userId: string;
    username: string;
    isOnline: boolean;
}

export class FriendsList extends BaseComponent<FriendsListProps> {
  protected render(): string {
    return `  <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <div class="bg-blue-600 py-3 px-6">
                    <h3 class="text-lg font-semibold text-white">Your Ping Pong Friends</h3>
                </div>
                <div class="p-6">
                    <div class="relative mb-4">
                        <input 
                            type="text" 
                            placeholder="Search friends..." 
                            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    
                    <div class="space-y-3" style="">
                        <!-- Friend Item -->
                         ${this.props.friends.length?this.props.friends.map((f)=>{
                            return( ` 
                        <div class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition duration-150">
                            <div class="flex items-center space-x-3">
                                <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                    ${f.username[0].toUpperCase()}
                                </div>
                                <div>
                                    <p class="font-medium">${f.username}</p>
                                    <p class="text-sm text-gray-500">${f.isOnline ? 'Online now':'Offline'}</p>
                                </div>
                            </div>
                            <button class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                Challenge
                            </button>
                        </div>` )
                        }): `        <div class="flex flex-col items-center justify-center py-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <h4 class="text-lg font-medium text-gray-700 mb-1">No Friends Yet</h4>
            <p class="text-gray-500 mb-4">Start adding friends to challenge them to ping pong matches!</p>
            <button class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200">
                Find Friends
            </button>
        </div `}
                    </div>
                    
                  <!--  <button class="mt-4 w-full border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded-lg transition duration-200">
                        View All Friends
                    </button> -->
                </div>
            </div>
        `;
  }

  protected setupEventListeners(): void {

  }
}