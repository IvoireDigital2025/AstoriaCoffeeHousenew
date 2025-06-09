import { useState, useEffect } from "react";
import { type User } from "@shared/schema";

interface AuthState {
  user: User | null;
  isLoading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: false,
  });

  const login = (user: User) => {
    setAuthState({ user, isLoading: false });
    // Store in localStorage for persistence
    localStorage.setItem("brew-bean-user", JSON.stringify(user));
  };

  const logout = () => {
    setAuthState({ user: null, isLoading: false });
    localStorage.removeItem("brew-bean-user");
  };

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("brew-bean-user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({ user, isLoading: false });
      } catch (error) {
        localStorage.removeItem("brew-bean-user");
      }
    }
  }, []);

  return {
    user: authState.user,
    isLoading: authState.isLoading,
    login,
    logout,
    isAuthenticated: !!authState.user,
  };
}
