"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "minegpt-auth";
const USERS_KEY = "minegpt-users";

// Initialize demo account
const DEMO_USER: User & { password: string } = {
  id: "demo-user-001",
  email: "demo@minegpt.com",
  password: "demo123",
  name: "Demo User",
  createdAt: Date.now(),
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize demo account and load user from localStorage on mount
  useEffect(() => {
    // Create demo account if it doesn't exist
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
    if (!users[DEMO_USER.email]) {
      users[DEMO_USER.email] = DEMO_USER;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    // Load saved user
    const savedAuth = localStorage.getItem(STORAGE_KEY);
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth);
        setUser(parsed);
      } catch (e) {
        console.error("Failed to parse auth data", e);
      }
    }
    setIsLoading(false);
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      // Also update in users database
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
      users[user.email] = { ...users[user.email], ...user };
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
    const existingUser = users[email];

    if (!existingUser) {
      return { success: false, error: "No account found with this email" };
    }

    if (existingUser.password !== password) {
      return { success: false, error: "Incorrect password" };
    }

    const { password: _, ...userWithoutPassword } = existingUser;
    setUser(userWithoutPassword);
    return { success: true };
  };

  const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "{}");

    if (users[email]) {
      return { success: false, error: "An account with this email already exists" };
    }

    const newUser: User & { password: string } = {
      id: Date.now().toString(),
      email,
      password,
      name,
      createdAt: Date.now(),
    };

    users[email] = newUser;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
