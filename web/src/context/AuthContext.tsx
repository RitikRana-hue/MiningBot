"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  tokens: number;
  plan: "free" | "professional" | "enterprise";
  createdAt: number;
  paymentHistory?: string[];
  lastUpgradeDate?: number;
}

export interface PaymentHistoryEntry {
  orderId: string;
  planType: string;
  amount: number;
  paymentMethod: string;
  status: string;
  timestamp: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  deductTokens: (amount: number) => boolean;
  addTokens: (amount: number) => void;
  updatePlan: (plan: "free" | "professional" | "enterprise") => void;
  upgradePlanWithPayment: (orderId: string, planType: "free" | "professional" | "enterprise", amount: number, paymentMethod: string) => void;
  getPaymentHistory: () => PaymentHistoryEntry[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "coalmine-auth";
const USERS_KEY = "coalmine-users";
const FREE_TOKENS = 100;

// Initialize demo account
const DEMO_USER: User & { password: string } = {
  id: "demo-user-001",
  email: "demo@coalmineai.com",
  password: "demo123",
  name: "Demo User",
  tokens: 5000,
  plan: "professional",
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
      tokens: FREE_TOKENS,
      plan: "free",
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

  const deductTokens = (amount: number): boolean => {
    if (!user) return false;
    
    // Enterprise users have unlimited tokens
    if (user.plan === "enterprise") return true;
    
    if (user.tokens < amount) return false;

    setUser((prev) => prev ? { ...prev, tokens: prev.tokens - amount } : null);
    return true;
  };

  const addTokens = (amount: number) => {
    if (!user) return;
    setUser((prev) => prev ? { ...prev, tokens: prev.tokens + amount } : null);
  };

  const updatePlan = (plan: "free" | "professional" | "enterprise") => {
    if (!user) return;
    
    // Add tokens based on plan upgrade
    let bonusTokens = 0;
    if (plan === "professional") bonusTokens = 5000;
    if (plan === "enterprise") bonusTokens = 0; // Unlimited

    setUser((prev) => prev ? { ...prev, plan, tokens: prev.tokens + bonusTokens } : null);
  };

  const upgradePlanWithPayment = (orderId: string, planType: "free" | "professional" | "enterprise", amount: number, paymentMethod: string) => {
    if (!user) return;
    
    // Update plan
    let bonusTokens = 0;
    if (planType === "professional") bonusTokens = 5000;
    if (planType === "enterprise") bonusTokens = 0; // Unlimited

    // Add to payment history
    const paymentEntry: PaymentHistoryEntry = {
      orderId,
      planType,
      amount,
      paymentMethod,
      status: "completed",
      timestamp: Date.now(),
    };

    setUser((prev) => {
      if (!prev) return null;
      const history = prev.paymentHistory || [];
      return {
        ...prev,
        plan: planType,
        tokens: planType === "enterprise" ? prev.tokens : prev.tokens + bonusTokens,
        paymentHistory: [...history, orderId],
        lastUpgradeDate: Date.now(),
      };
    });
  };

  const getPaymentHistory = (): PaymentHistoryEntry[] => {
    if (!user || !user.paymentHistory) return [];
    // In a real app, you'd fetch from database
    // For now, return empty array as we store in PaymentContext
    return [];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        deductTokens,
        addTokens,
        updatePlan,
        upgradePlanWithPayment,
        getPaymentHistory,
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
