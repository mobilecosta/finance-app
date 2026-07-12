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

export function NatureProvider({ children }: { children: React.ReactNode }) {
  const [natures, setNatures] = useState<Nature[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadNatures = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("natures")
        .select("*")
        .eq("user_id", user.id)
        .order("nome", { ascending: true });

      if (error) throw error;

      const mappedNatures = data.map(item => ({
        id: item.id,
        nome: item.nome,
        tipo: item.tipo,
        cor: item.cor,
        icone: item.icone,
        dataCriacao: item.data_criacao,
        user_id: item.user_id
      }));

      setNatures(mappedNatures as Nature[]);
    } catch (error) {
      console.error("Erro ao carregar naturezas:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadNatures();
  }, [loadNatures]);

  const addNature = useCallback(
    async (nature: Omit<Nature, "id" | "dataCriacao" | "user_id">) => {
      if (!user) return;
      try {
        const { error } = await supabase.from("natures").insert([
          {
            nome: nature.nome,
            tipo: nature.tipo,
            cor: nature.cor,
            icone: nature.icone,
            user_id: user.id,
          },
        ]);
        if (error) throw error;
        await loadNatures();
      } catch (error) {
        console.error("Erro ao adicionar natureza:", error);
        throw error;
      }
    },
    [user, loadNatures]
  );

  const updateNature = useCallback(
    async (id: string, updates: Partial<Nature>) => {
      try {
        const { error } = await supabase
          .from("natures")
          .update(updates)
          .eq("id", id);
        if (error) throw error;
        await loadNatures();
      } catch (error) {
        console.error("Erro ao atualizar natureza:", error);
        throw error;
      }
    },
    [loadNatures]
  );

  const deleteNature = useCallback(
    async (id: string) => {
      try {
        const { error } = await supabase.from("natures").delete().eq("id", id);
        if (error) throw error;
        await loadNatures();
      } catch (error) {
        console.error("Erro ao deletar natureza:", error);
        throw error;
      }
    },
    [loadNatures]
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
