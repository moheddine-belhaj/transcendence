import { API_BASE_URL } from '../config';

interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

export const AuthService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    return response.json();
  },

  async register(userData: RegisterPayload): Promise<{ id: number; email: string; name: string }> {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    return response.json();
  }
};