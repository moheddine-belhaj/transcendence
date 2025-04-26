
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { User, AuthContextType } from '@/types';

// Mock user data for demo purposes
const MOCK_USER: User = {
  id: '1',
  email: 'astronaut@space.com',
  displayName: 'Cosmic Explorer',
  avatar: 'https://images.unsplash.com/photo-1501286353178-1ec871214838',
  stats: {
    wins: 42,
    losses: 18,
    gamesPlayed: 60,
    winRate: 70
  },
  status: 'online'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('spaceUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock API call - would be replaced with actual authentication
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // For demo, accept any email/password with basic validation
      if (email && password.length >= 6) {
        setUser(MOCK_USER);
        localStorage.setItem('spaceUser', JSON.stringify(MOCK_USER));
        toast({
          title: "Login successful",
          description: "Welcome back to Space Friends!",
        });
        navigate('/dashboard');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, displayName: string) => {
    setIsLoading(true);
    try {
      // Mock API call - would be replaced with actual registration
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      if (!email || !password || !displayName) {
        throw new Error('All fields are required');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      const newUser = {
        ...MOCK_USER,
        email,
        displayName
      };
      
      setUser(newUser);
      localStorage.setItem('spaceUser', JSON.stringify(newUser));
      toast({
        title: "Registration successful",
        description: "Welcome to Space Friends!",
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please check your information",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('spaceUser');
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been safely logged out.",
    });
    navigate('/');
  };

  const updateProfile = async (data: Partial<User>) => {
    setIsLoading(true);
    try {
      // Mock API call - would be replaced with actual update
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const updatedUser = {
        ...user,
        ...data
      } as User;
      
      setUser(updatedUser);
      localStorage.setItem('spaceUser', JSON.stringify(updatedUser));
      
      toast({
        title: "Profile updated",
        description: "Your changes have been saved.",
      });
      
      return updatedUser;
    } catch (error) {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Could not update profile",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      register, 
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
