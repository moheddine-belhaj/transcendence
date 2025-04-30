import { API_BASE_URL } from '../config';

export interface User {
  id: number;
  email: string;
  name: string;
}

export const UserService = {
  async getAllUsers(): Promise<User[]> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/users`, {
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
      throw new Error('Failed to fetch users');
    }

    return response.json();
  }
};