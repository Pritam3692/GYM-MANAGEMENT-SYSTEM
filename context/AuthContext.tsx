import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, getCurrentUser, login as storageLogin, logout as storageLogout, initializeStorage } from "@/lib/storage";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initialize() {
      await initializeStorage();
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setIsLoading(false);
    }
    initialize();
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    const loggedInUser = await storageLogin(email, password);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const logout = async () => {
    await storageLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
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
