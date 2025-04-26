
export interface User {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  stats: UserStats;
  status: UserStatus;
}

export interface UserStats {
  wins: number;
  losses: number;
  gamesPlayed: number;
  winRate: number;
}

export type UserStatus = 'online' | 'offline' | 'away';

export interface Friend extends User {
  friendSince: Date;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}
