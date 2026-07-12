import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import crypto from "node:crypto";
import { InsertUser, User, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

type UserRow = {
  id: number;
  openId: string;
  username: string | null;
  passwordHash: string | null;
  name: string | null;
  email: string | null;
  loginMethod: string | null;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
  lastSignedIn: string;
};

let _supabase: SupabaseClient | null = null;

function getSupabaseAdmin() {
  if (_supabase) {
    return _supabase;
  }

  if (!ENV.supabaseUrl || !ENV.supabaseServiceRoleKey) {
    throw new Error(
      "Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY for the backend.",
    );
  }

  _supabase = createClient(ENV.supabaseUrl, ENV.supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  return _supabase;
}

function normalizeUser(row: UserRow): User {
  return {
    id: row.id,
    openId: row.openId,
    username: row.username,
    passwordHash: row.passwordHash,
    name: row.name,
    email: row.email,
    loginMethod: row.loginMethod,
    role: row.role,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
    lastSignedIn: new Date(row.lastSignedIn),
  };
}

function serializeUser(user: InsertUser): Partial<UserRow> {
  return {
    openId: user.openId,
    username: user.username ?? null,
    passwordHash: user.passwordHash ?? null,
    name: user.name ?? null,
    email: user.email ?? null,
    loginMethod: user.loginMethod ?? null,
    role: user.role ?? "user",
    createdAt: user.createdAt ? user.createdAt.toISOString() : undefined,
    updatedAt: user.updatedAt ? user.updatedAt.toISOString() : undefined,
    lastSignedIn: user.lastSignedIn ? user.lastSignedIn.toISOString() : new Date().toISOString(),
  };
}

let _db: SupabaseClient | null = null;

export async function getDb() {
  if (!_db) {
    _db = getSupabaseAdmin();
  }

  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  const values = serializeUser(user);
  const payload = {
    ...values,
    lastSignedIn: values.lastSignedIn ?? new Date().toISOString(),
  };

  const { error } = await db.from("users").upsert(payload, {
    onConflict: "openId",
  });

  if (error) {
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  const { data, error } = await db.from("users").select("*").eq("openId", openId).maybeSingle();

  if (error) {
    throw error;
  }

  return data ? normalizeUser(data as UserRow) : undefined;
}

export async function getUserByUsername(username: string) {
  const db = await getDb();
  const { data, error } = await db.from("users").select("*").eq("username", username).maybeSingle();

  if (error) {
    throw error;
  }

  return data ? normalizeUser(data as UserRow) : undefined;
}

export async function createLocalUser(user: {
  username: string;
  passwordHash: string;
  name?: string | null;
}) {
  const db = await getDb();
  const openId = `local_${crypto.randomUUID()}`;
  const now = new Date().toISOString();

  const { data, error } = await db
    .from("users")
    .insert({
      openId,
      username: user.username,
      passwordHash: user.passwordHash,
      name: user.name ?? user.username,
      loginMethod: "password",
      role: "user",
      lastSignedIn: now,
      createdAt: now,
      updatedAt: now,
    })
    .select("*")
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? normalizeUser(data as UserRow) : undefined;
}
