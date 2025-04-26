
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

const AuthContext = createContext();

// Mock user data for demonstration
const mockUsers = [
  { id: 1, name: 'John Donor', email: 'donor@example.com', password: 'password', role: 'donor', bloodType: 'O+' },
  { id: 2, name: 'Sarah Receiver', email: 'receiver@example.com', password: 'password', role: 'receiver' },
  { id: 3, name: 'Admin User', email: 'admin@example.com', password: 'password', role: 'admin' },
];

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in local storage
    const storedUser = localStorage.getItem('bloodBankUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const user = mockUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (user) {
      const userData = { ...user };
      delete userData.password; // Don't store password in state
      
      setCurrentUser(userData);
      localStorage.setItem('bloodBankUser', JSON.stringify(userData));
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${userData.name}!`,
      });
      return { success: true, user: userData };
    } else {
      toast({
        title: 'Login Failed',
        description: 'Invalid email or password.',
        variant: 'destructive',
      });
      return { success: false, message: 'Invalid email or password' };
    }
  };

  const register = (userData, role) => {
    // In a real app, this would call an API
    const newUser = {
      id: mockUsers.length + 1,
      ...userData,
      role: role,
    };

    mockUsers.push(newUser);
    
    // Auto login after registration
    const loginData = { ...newUser };
    delete loginData.password;
    
    setCurrentUser(loginData);
    localStorage.setItem('bloodBankUser', JSON.stringify(loginData));
    
    toast({
      title: 'Registration Successful',
      description: `Welcome, ${userData.name}!`,
    });
    
    return { success: true, user: loginData };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('bloodBankUser');
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
