import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { supabase } from "../supabase/client";
import { useAuth } from "./AuthContext";

export interface Nature {
  id: string;
  nome: string;
  tipo: "receita" | "despesa";
  cor: string;
  icone: string;
  dataCriacao: string;
  user_id: string;
}

interface NatureContextType {
  natures: Nature[];
  loading: boolean;
  addNature: (nature: Omit<Nature, "id" | "dataCriacao" | "user_id">) => Promise<void>;
  updateNature: (id: string, nature: Partial<Nature>) => Promise<void>;
  deleteNature: (id: string) => Promise<void>;
  loadNatures: () => Promise<void>;
}

const NatureContext = createContext<NatureContextType | undefined>(undefined);

function mapNature(item: Record<string, unknown>): Nature {
  return {
    id: String(item.id),
    nome: String(item.nome ?? ""),
    tipo: item.tipo as Nature["tipo"],
    cor: String(item.cor ?? "#10B981"),
    icone: String(item.icone ?? "💰"),
    dataCriacao: String(item.data_criacao ?? ""),
    user_id: String(item.user_id ?? ""),
  };
}

export function NatureProvider({ children }: { children: React.ReactNode }) {
  const [natures, setNatures] = useState<Nature[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadNatures = useCallback(async () => {
    if (!user) {
      setNatures([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("natures")
        .select("*")
        .eq("user_id", user.id)
        .order("nome", { ascending: true });

      if (error) throw error;

      setNatures((data ?? []).map((item) => mapNature(item as Record<string, unknown>)));
    } catch (error) {
      console.error("Erro ao carregar naturezas:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void loadNatures().catch(() => {
      /* already logged */
    });
  }, [loadNatures]);

  const addNature = useCallback(
    async (nature: Omit<Nature, "id" | "dataCriacao" | "user_id">) => {
      if (!user) throw new Error("Usuário não autenticado");

      const { error } = await supabase.from("natures").insert([
        {
          nome: nature.nome.trim(),
          tipo: nature.tipo,
          cor: nature.cor,
          icone: nature.icone,
          user_id: user.id,
        },
      ]);

      if (error) throw error;
      await loadNatures();
    },
    [user, loadNatures]
  );

  const updateNature = useCallback(
    async (id: string, updates: Partial<Nature>) => {
      if (!user) throw new Error("Usuário não autenticado");

      const dbUpdates: Record<string, unknown> = {};
      if (updates.nome !== undefined) dbUpdates.nome = updates.nome.trim();
      if (updates.tipo !== undefined) dbUpdates.tipo = updates.tipo;
      if (updates.cor !== undefined) dbUpdates.cor = updates.cor;
      if (updates.icone !== undefined) dbUpdates.icone = updates.icone;

      if (Object.keys(dbUpdates).length === 0) return;

      const { error } = await supabase
        .from("natures")
        .update(dbUpdates)
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
      await loadNatures();
    },
    [user, loadNatures]
  );

  const deleteNature = useCallback(
    async (id: string) => {
      if (!user) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from("natures")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
      await loadNatures();
    },
    [user, loadNatures]
  );

  return (
    <NatureContext.Provider
      value={{
        natures,
        loading,
        addNature,
        updateNature,
        deleteNature,
        loadNatures,
      }}
    >
      {children}
    </NatureContext.Provider>
  );
}

export function useNatures() {
  const context = useContext(NatureContext);
  if (!context) {
    throw new Error("useNatures must be used within NatureProvider");
  }
  return context;
}
