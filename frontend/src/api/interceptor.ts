import { API_BASE_URL } from '../config';

export async function authFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const token = localStorage.getItem('token');
  
  const headers = new Headers(init?.headers);
  headers.set('Content-Type', 'application/json');
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${input}`, {
    ...init,
    headers
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  return response;
}