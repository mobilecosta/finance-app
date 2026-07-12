import React, { createContext, useContext, useEffect, useCallback, useState } from "react";
import * as Api from "@/lib/_core/api";
import * as Auth from "@/lib/_core/auth";

interface AuthContextType {
  session: { user: Auth.User } | null;
  user: Auth.User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<{ user: Auth.User } | null>(null);
  const [user, setUser] = useState<Auth.User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const currentUser = await Api.getMe();

      if (currentUser) {
        const normalizedUser: Auth.User = {
          id: currentUser.id,
          openId: currentUser.openId,
          name: currentUser.name,
          email: currentUser.email,
          loginMethod: currentUser.loginMethod,
          lastSignedIn: new Date(currentUser.lastSignedIn),
        };

        setSession({ user: normalizedUser });
        setUser(normalizedUser);
        return;
      }

      const storedUser = await Auth.getUserInfo();
      if (storedUser) {
        setSession({ user: storedUser });
        setUser(storedUser);
        return;
      }

      setSession(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshSession();

    const unsubscribe = Auth.subscribeAuthChanges(() => {
      void refreshSession();
    });

    return () => {
      unsubscribe();
    };
  }, [refreshSession]);

  const signOut = async () => {
    await Api.logout().catch(() => undefined);
    await Auth.removeSessionToken();
    await Auth.clearUserInfo();
    setSession(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ session, user, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
