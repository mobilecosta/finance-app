import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Alert, Platform } from "react-native";

/**
 * Combines class names using clsx and tailwind-merge.
 * This ensures Tailwind classes are properly merged without conflicts.
 *
 * Usage:
 * ```tsx
 * cn("px-4 py-2", isActive && "bg-primary", className)
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Coerce Supabase NUMERIC / mixed values to a finite number. */
export function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : fallback;
  }
  if (typeof value === "string") {
    const normalized = value.trim().replace(/\s/g, "").replace(",", ".");
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  if (value == null) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

/**
 * Parse user-entered money (pt-BR or en), e.g. "10,50", "1.234,56", "10.50".
 * Returns NaN when invalid.
 */
export function parseMoneyInput(value: string): number {
  const trimmed = value.trim().replace(/\s/g, "");
  if (!trimmed) return NaN;

  // Brazilian format with thousand separators: 1.234,56
  if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(trimmed)) {
    return Number(trimmed.replace(/\./g, "").replace(",", "."));
  }

  // Comma as decimal separator: 10,50
  if (trimmed.includes(",") && !trimmed.includes(".")) {
    return Number(trimmed.replace(",", "."));
  }

  // Dot as decimal separator or plain integer
  return Number(trimmed.replace(",", "."));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(toNumber(value));
}

/** Confirm dialog that works on web (window.confirm) and native (Alert). */
export function confirmAction(title: string, message: string): Promise<boolean> {
  if (Platform.OS === "web" && typeof window !== "undefined" && typeof window.confirm === "function") {
    return Promise.resolve(window.confirm(`${title}\n\n${message}`));
  }

  return new Promise((resolve) => {
    Alert.alert(title, message, [
      { text: "Cancelar", style: "cancel", onPress: () => resolve(false) },
      { text: "Confirmar", style: "destructive", onPress: () => resolve(true) },
    ]);
  });
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    const msg = (error as { message?: unknown }).message;
    if (typeof msg === "string" && msg) return msg;
  }
  return fallback;
}
