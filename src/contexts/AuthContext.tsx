
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

// Define user roles
export type UserRole = 'user' | 'admin';

// Define the User interface
export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
}

// Define the AuthContext interface
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database for demo purposes
const mockUsers = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin@123',
    role: 'admin' as UserRole,
  },
  {
    id: 2,
    username: 'user1',
    email: 'user1@example.com',
    password: 'password123',
    role: 'user' as UserRole,
  },
];

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if user exists in mock database
      const foundUser = mockUsers.find(
        u => u.email === email && u.password === password && u.role === role
      );
      
      if (foundUser) {
        // Remove password from user object before storing
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        toast.success(`Welcome back, ${foundUser.username}!`);
        return true;
      } else {
        toast.error('Invalid credentials. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === email);
      
      if (existingUser) {
        toast.error('User with this email already exists.');
        return false;
      }
      
      // Create new user (in a real app, this would be a DB insert)
      const newUser = {
        id: mockUsers.length + 1,
        username,
        email,
        password,
        role: 'user' as UserRole,
      };
      
      // Add to mock database
      mockUsers.push(newUser);
      
      // Login the user automatically
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      toast.success('Registration successful!');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An error occurred during registration.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.info('You have been logged out.');
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  // Provide the auth context
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
