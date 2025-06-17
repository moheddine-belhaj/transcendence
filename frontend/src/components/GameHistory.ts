import { BaseComponent } from '../core/BaseComponent';

type Match = {
    opponentName:string,
    opponentPoints:number,
    myPoints:number
}

type GameHistoryProps = {
//   stats:{
//     matchCount:number,
//     winRate:string,
//     wins:number
//   },
  matches: Match[]
};

export class GameHistory extends BaseComponent<GameHistoryProps> {
  
  private calculateStats() {
    const totalMatches = this.props.matches.length;
    const wins = this.props.matches.filter(match => match.myPoints > match.opponentPoints).length;
    const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;
    
    return {
      totalMatches,
      wins,
      winRate: `${winRate}%`
    };
  }

  protected render(): string {
    const stats = this.calculateStats();
    return `<div class="bg-white rounded-lg shadow-md overflow-hidden h-96 flex flex-col">
                <div class="bg-blue-600 py-3 px-6 flex-shrink-0">
                    <h3 class="text-lg font-semibold text-white">Your Recent Matches</h3>
                </div>
                <div class="p-6 flex-1 flex flex-col overflow-hidden">
                    <div class="grid grid-cols-3 gap-4 text-center mb-6 flex-shrink-0">
                        <div>
                            <p class="text-3xl font-bold text-blue-600">${stats.totalMatches}</p>
                            <p class="text-sm text-gray-500">Matches</p>
                        </div>
                        <div>
                            <p class="text-3xl font-bold text-blue-600">${stats.wins}</p>
                            <p class="text-sm text-gray-500">Wins</p>
                        </div>
                        <div>
                            <p class="text-3xl font-bold text-blue-600">${stats.winRate}</p>
                            <p class="text-sm text-gray-500">Win Rate</p>
                        </div>
                    </div>
                    
                    <div class="space-y-4 flex-1 overflow-y-auto">
                        <!-- Match Item -->                        ${this.props.matches.length?this.props.matches.map((m)=>
                        `<div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition duration-150">
                            <div class="flex justify-between items-center mb-2">
                                <span class="text-sm font-medium text-gray-500">Today, 15:30</span>
                                <span class="px-2 py-1 bg-${m.myPoints > m.opponentPoints?'green':'red'}-100 text-${m.myPoints > m.opponentPoints?'green':'red'}-800 text-xs font-medium rounded">${m.myPoints > m.opponentPoints?'Win':'Lost'}</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-2">
                                    <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                        Y
                                    </div>
                                    <span class="font-medium">YOU</span>
                                </div>
                                <span class="text-xl font-bold mx-4">${m.myPoints} - ${m.opponentPoints}</span>
                                <div class="flex items-center space-x-2">
                                    <div class="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold">
                                        ${m.opponentName[0]?.toUpperCase() || '?'}
                                    </div>
                                    <span class="font-medium">${m.opponentName}</span>
                                </div>
                            </div>
                        </div> `):
                    `<div class="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-gray-200 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h4 class="text-lg font-medium text-gray-700 mb-1">No Matches Played Yet</h4>
                        <p class="text-gray-500 mb-4">Start playing to track your ping pong matches and statistics!</p>
                    </div>` }                  
                    </div>
                    
                    <!-- <button class="mt-4 w-full border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded-lg transition duration-200">
                        View All Matches
                    </button> -->
                </div>
            </div>
        `;
  }

  protected setupEventListeners(): void {

  }
}