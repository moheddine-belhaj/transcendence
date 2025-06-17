import { API_BASE_URL } from '../routes';

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
    },

    async getUserMatches(userId: number) {
        const response = await fetch(`${API_BASE_URL}/api/matches/user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch matches');
        }
        
        return await response.json();
    }
};