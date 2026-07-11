import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export interface Nature {
  id: string;
  nome: string;
  tipo: "receita" | "despesa";
  cor: string;
  icone: string;
  dataCriacao: string;
}

interface NatureContextType {
  natures: Nature[];
  loading: boolean;
  addNature: (nature: Omit<Nature, "id" | "dataCriacao">) => Promise<void>;
  updateNature: (id: string, nature: Partial<Nature>) => Promise<void>;
  deleteNature: (id: string) => Promise<void>;
  loadNatures: () => Promise<void>;
}

const NatureContext = createContext<NatureContextType | undefined>(undefined);

export function NatureProvider({ children }: { children: React.ReactNode }) {
  const [natures, setNatures] = useState<Nature[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNatures = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem("natures");
      if (data) {
        setNatures(JSON.parse(data));
      } else {
        // Criar naturezas padrão
        const defaultNatures: Nature[] = [
          {
            id: generateId(),
            nome: "Salário",
            tipo: "receita",
            cor: "#10B981",
            icone: "💰",
            dataCriacao: new Date().toISOString(),
          },
          {
            id: generateId(),
            nome: "Freelance",
            tipo: "receita",
            cor: "#10B981",
            icone: "💼",
            dataCriacao: new Date().toISOString(),
          },
          {
            id: generateId(),
            nome: "Alimentação",
            tipo: "despesa",
            cor: "#EF4444",
            icone: "🍔",
            dataCriacao: new Date().toISOString(),
          },
          {
            id: generateId(),
            nome: "Transporte",
            tipo: "despesa",
            cor: "#EF4444",
            icone: "🚗",
            dataCriacao: new Date().toISOString(),
          },
          {
            id: generateId(),
            nome: "Saúde",
            tipo: "despesa",
            cor: "#EF4444",
            icone: "🏥",
            dataCriacao: new Date().toISOString(),
          },
        ];
        await AsyncStorage.setItem("natures", JSON.stringify(defaultNatures));
        setNatures(defaultNatures);
      }
    } catch (error) {
      console.error("Erro ao carregar naturezas:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNatures();
  }, [loadNatures]);

  const saveNatures = useCallback(async (newNatures: Nature[]) => {
    try {
      await AsyncStorage.setItem("natures", JSON.stringify(newNatures));
      setNatures(newNatures);
    } catch (error) {
      console.error("Erro ao salvar naturezas:", error);
    }
  }, []);

  const addNature = useCallback(
    async (nature: Omit<Nature, "id" | "dataCriacao">) => {
      const newNature: Nature = {
        ...nature,
        id: generateId(),
        dataCriacao: new Date().toISOString(),
      };
      await saveNatures([...natures, newNature]);
    },
    [natures, saveNatures]
  );

  const updateNature = useCallback(
    async (id: string, updates: Partial<Nature>) => {
      const updated = natures.map((nat) =>
        nat.id === id ? { ...nat, ...updates } : nat
      );
      await saveNatures(updated);
    },
    [natures, saveNatures]
  );

  const deleteNature = useCallback(
    async (id: string) => {
      const filtered = natures.filter((nat) => nat.id !== id);
      await saveNatures(filtered);
    },
    [natures, saveNatures]
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
