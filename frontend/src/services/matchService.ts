import { API_BASE_URL } from '../config';

export interface Match {
    id: number;
    player1Id: number;
    player2Id: number;
    scorePlayer1: number;
    scorePlayer2: number;
    winnerId: number | null;
    createdAt: string;
    updatedAt: string;
}

export const MatchService = {
    async createMatch(player1Id: number, player2Id: number) {
        const response = await fetch(`${API_BASE_URL}/api/matches`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                player1Id,
                player2Id
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create match');
        }
        
        return await response.json();
    },

    async updateMatchResult(matchId: number, scorePlayer1: number, scorePlayer2: number, winnerId: number) {
        const response = await fetch(`${API_BASE_URL}/api/matches/${matchId}/result`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                scorePlayer1,
                scorePlayer2,
                winnerId
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update match result');
        }
        
        return await response.json();
    },    async getUserMatches(userId: number): Promise<Match[]> {
        const token = localStorage.getItem('token');
        
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`${API_BASE_URL}/api/matches/user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
            throw new Error('Session expired. Please login again.');
        }
        
        if (!response.ok) {
            throw new Error('Failed to fetch matches');
        }
        
        return await response.json();
    }
};