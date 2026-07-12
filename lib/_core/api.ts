import { supabase } from "@/lib/supabase/client";

export type AuthUser = {
  id: string;
  openId: string;
  name: string | null;
  email: string | null;
  loginMethod: string | null;
  lastSignedIn: string;
};

export async function exchangeOAuthCode(): Promise<{ sessionToken: string; user: AuthUser }> {
  throw new Error("OAuth callback flow was removed. Use Supabase Auth directly.");
}

export async function loginWithCredentials(input: {
  username: string;
  password: string;
}): Promise<{ sessionToken: string; user: AuthUser }> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.username,
    password: input.password,
  });

  if (error) {
    throw error;
  }

  if (!data.session || !data.user) {
    throw new Error("No session returned from Supabase");
  }

  return {
    sessionToken: data.session.access_token,
    user: {
      id: data.user.id,
      openId: data.user.id,
      name:
        ((data.user.user_metadata as Record<string, unknown> | undefined)?.full_name as string) ??
        data.user.email ??
        null,
      email: data.user.email ?? null,
      loginMethod: "supabase",
      lastSignedIn: new Date(data.user.last_sign_in_at ?? data.user.created_at ?? Date.now())
        .toISOString(),
    },
  };
}

export async function registerWithCredentials(input: {
  username: string;
  password: string;
  name?: string;
}): Promise<{ sessionToken: string; user: AuthUser }> {
  const { data, error } = await supabase.auth.signUp({
    email: input.username,
    password: input.password,
    options: {
      data: {
        full_name: input.name || input.username,
      },
    },
  });

  if (error) {
    throw error;
  }

  if (!data.session || !data.user) {
    throw new Error("Supabase requires email confirmation before issuing a session.");
  }

  return {
    sessionToken: data.session.access_token,
    user: {
      id: data.user.id,
      openId: data.user.id,
      name:
        ((data.user.user_metadata as Record<string, unknown> | undefined)?.full_name as string) ??
        data.user.email ??
        null,
      email: data.user.email ?? null,
      loginMethod: "supabase",
      lastSignedIn: new Date(data.user.last_sign_in_at ?? data.user.created_at ?? Date.now())
        .toISOString(),
    },
  };
}

export async function logout(): Promise<void> {
  await supabase.auth.signOut();
}

export async function getMe(): Promise<{
  id: string;
  openId: string;
  name: string | null;
  email: string | null;
  loginMethod: string | null;
  lastSignedIn: string;
} | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return null;
  }

  return {
    id: data.user.id,
    openId: data.user.id,
    name:
      ((data.user.user_metadata as Record<string, unknown> | undefined)?.full_name as string) ??
      data.user.email ??
      null,
    email: data.user.email ?? null,
    loginMethod: "supabase",
    lastSignedIn: new Date(data.user.last_sign_in_at ?? data.user.created_at ?? Date.now())
      .toISOString(),
  };
}

export async function establishSession(): Promise<boolean> {
  return true;
}
