import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

type AsyncStorageModule = typeof import("@react-native-async-storage/async-storage").default;

let nativeAsyncStorage: AsyncStorageModule | null = null;

function isReactNativeRuntime() {
  return typeof navigator !== "undefined" && navigator.product === "ReactNative";
}

function getNativeAsyncStorage() {
  if (!nativeAsyncStorage) {
    nativeAsyncStorage = require("@react-native-async-storage/async-storage").default;
  }

  return nativeAsyncStorage!;
}

const supabaseStorage = {
  async getItem(key: string) {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.getItem(key);
    }

    if (!isReactNativeRuntime()) {
      return null;
    }

    const storage = getNativeAsyncStorage();
    return storage.getItem(key);
  },
  async setItem(key: string, value: string) {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(key, value);
      return;
    }

    if (!isReactNativeRuntime()) {
      return;
    }

    const storage = getNativeAsyncStorage();
    return storage.setItem(key, value);
  },
  async removeItem(key: string) {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem(key);
      return;
    }

    if (!isReactNativeRuntime()) {
      return;
    }

    const storage = getNativeAsyncStorage();
    return storage.removeItem(key);
  },
};

function createMissingSupabaseClient() {
  const message =
    "Supabase is not configured. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.";

  const missingClientHandler: ProxyHandler<(...args: unknown[]) => unknown> = {
    get() {
      return new Proxy(() => {
        throw new Error(message);
      }, missingClientHandler);
    },
    apply() {
      throw new Error(message);
    },
  };

  return new Proxy(() => {
    throw new Error(message);
  }, missingClientHandler) as unknown as SupabaseClient;
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          storage: supabaseStorage,
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
        },
      })
    : createMissingSupabaseClient();
