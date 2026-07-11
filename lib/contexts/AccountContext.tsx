import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export interface Account {
  id: string;
  nome: string;
  tipo: "corrente" | "poupança" | "investimento";
  saldoInicial: number;
  saldoAtual: number;
  dataCriacao: string;
}

interface AccountContextType {
  accounts: Account[];
  loading: boolean;
  addAccount: (account: Omit<Account, "id" | "dataCriacao">) => Promise<void>;
  updateAccount: (id: string, account: Partial<Account>) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  loadAccounts: () => Promise<void>;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAccounts = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem("accounts");
      if (data) {
        setAccounts(JSON.parse(data));
      }
    } catch (error) {
      console.error("Erro ao carregar contas:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  const saveAccounts = useCallback(async (newAccounts: Account[]) => {
    try {
      await AsyncStorage.setItem("accounts", JSON.stringify(newAccounts));
      setAccounts(newAccounts);
    } catch (error) {
      console.error("Erro ao salvar contas:", error);
    }
  }, []);

  const addAccount = useCallback(
    async (account: Omit<Account, "id" | "dataCriacao">) => {
      const newAccount: Account = {
        ...account,
        id: generateId(),
        dataCriacao: new Date().toISOString(),
      };
      await saveAccounts([...accounts, newAccount]);
    },
    [accounts, saveAccounts]
  );

  const updateAccount = useCallback(
    async (id: string, updates: Partial<Account>) => {
      const updated = accounts.map((acc) =>
        acc.id === id ? { ...acc, ...updates } : acc
      );
      await saveAccounts(updated);
    },
    [accounts, saveAccounts]
  );

  const deleteAccount = useCallback(
    async (id: string) => {
      const filtered = accounts.filter((acc) => acc.id !== id);
      await saveAccounts(filtered);
    },
    [accounts, saveAccounts]
  );

  return (
    <AccountContext.Provider
      value={{
        accounts,
        loading,
        addAccount,
        updateAccount,
        deleteAccount,
        loadAccounts,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export function useAccounts() {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccounts must be used within AccountProvider");
  }
  return context;
}
