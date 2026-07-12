import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { supabase } from "../supabase/client";
import { useAuth } from "./AuthContext";

export interface Account {
  id: string;
  nome: string;
  tipo: "corrente" | "poupança" | "investimento";
  saldoInicial: number;
  saldoAtual: number;
  dataCriacao: string;
  user_id: string;
}

interface AccountContextType {
  accounts: Account[];
  loading: boolean;
  addAccount: (account: Omit<Account, "id" | "dataCriacao" | "user_id">) => Promise<void>;
  updateAccount: (id: string, account: Partial<Account>) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  loadAccounts: () => Promise<void>;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadAccounts = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .eq("user_id", user.id)
        .order("nome", { ascending: true });

      if (error) throw error;
      
      // Mapear campos do banco para a interface (caso haja diferença de snake_case)
      const mappedAccounts = data.map(item => ({
        id: item.id,
        nome: item.nome,
        tipo: item.tipo,
        saldoInicial: item.saldo_inicial,
        saldoAtual: item.saldo_atual,
        dataCriacao: item.data_criacao,
        user_id: item.user_id
      }));

      setAccounts(mappedAccounts as Account[]);
    } catch (error) {
      console.error("Erro ao carregar contas:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  const addAccount = useCallback(
    async (account: Omit<Account, "id" | "dataCriacao" | "user_id">) => {
      if (!user) return;
      try {
        const { error } = await supabase.from("accounts").insert([
          {
            nome: account.nome,
            tipo: account.tipo,
            saldo_inicial: account.saldoInicial,
            saldo_atual: account.saldoInicial, // Inicialmente igual
            user_id: user.id,
          },
        ]);
        if (error) throw error;
        await loadAccounts();
      } catch (error) {
        console.error("Erro ao adicionar conta:", error);
        throw error;
      }
    },
    [user, loadAccounts]
  );

  const updateAccount = useCallback(
    async (id: string, updates: Partial<Account>) => {
      try {
        const dbUpdates: any = {};
        if (updates.nome) dbUpdates.nome = updates.nome;
        if (updates.tipo) dbUpdates.tipo = updates.tipo;
        if (updates.saldoInicial !== undefined) dbUpdates.saldo_inicial = updates.saldoInicial;
        if (updates.saldoAtual !== undefined) dbUpdates.saldo_atual = updates.saldoAtual;

        const { error } = await supabase
          .from("accounts")
          .update(dbUpdates)
          .eq("id", id);
        
        if (error) throw error;
        await loadAccounts();
      } catch (error) {
        console.error("Erro ao atualizar conta:", error);
        throw error;
      }
    },
    [loadAccounts]
  );

  const deleteAccount = useCallback(
    async (id: string) => {
      try {
        const { error } = await supabase.from("accounts").delete().eq("id", id);
        if (error) throw error;
        await loadAccounts();
      } catch (error) {
        console.error("Erro ao deletar conta:", error);
        throw error;
      }
    },
    [loadAccounts]
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
