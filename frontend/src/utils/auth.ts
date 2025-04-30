export function isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
  
  export function getCurrentUser(): { id: number; email: string; name: string } | null {
    try {
      const user = localStorage.getItem('user');
      if (!user) return null;
      return JSON.parse(user);
    } catch (error) {
      console.error('Failed to parse user data:', error);
      return null;
    }
  }
  export function logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }