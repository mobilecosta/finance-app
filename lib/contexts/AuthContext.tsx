import { Session, User as SupabaseUser } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export type User = {
  id: string;
  name: string | null;
  email: string | null;
  loginMethod: string | null;
  lastSignedIn: Date;
};

interface AuthContextType {
  session: { user: User } | null;
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapSupabaseUser(user: SupabaseUser): User {
  const metadata = user.user_metadata as Record<string, unknown> | undefined;
  const name =
    (typeof metadata?.full_name === "string" && metadata.full_name) ||
    (typeof metadata?.name === "string" && metadata.name) ||
    null;

  return {
    id: user.id,
    name: name || user.email || null,
    email: user.email ?? null,
    loginMethod: "supabase",
    lastSignedIn: new Date(user.last_sign_in_at ?? user.created_at ?? Date.now()),
  };
}

function mapSession(session: Session | null) {
  if (!session?.user) {
    return null;
  }

  return { user: mapSupabaseUser(session.user) };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<{ user: User } | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const syncSession = (nextSession: Session | null) => {
      if (!mounted) return;
      const mapped = mapSession(nextSession);
      setSession(mapped);
      setUser(mapped?.user ?? null);
      setIsLoading(false);
    };

    void supabase.auth
      .getSession()
      .then(({ data }) => syncSession(data.session))
      .catch(() => syncSession(null));

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      syncSession(nextSession);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      session,
      user,
      isLoading,
      signOut,
    }),
    [session, user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
