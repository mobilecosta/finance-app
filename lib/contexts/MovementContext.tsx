import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export interface Movement {
  id: string;
  data: string;
  descricao: string;
  naturezaId: string;
  contaId: string;
  valor: number;
  tipo: "receita" | "despesa";
  dataCriacao: string;
  dataAtualizacao: string;
}

interface MovementContextType {
  movements: Movement[];
  loading: boolean;
  addMovement: (movement: Omit<Movement, "id" | "dataCriacao" | "dataAtualizacao">) => Promise<void>;
  updateMovement: (id: string, movement: Partial<Movement>) => Promise<void>;
  deleteMovement: (id: string) => Promise<void>;
  loadMovements: () => Promise<void>;
  getMovementsByAccount: (accountId: string) => Movement[];
  getMovementsByNature: (natureId: string) => Movement[];
}

const MovementContext = createContext<MovementContextType | undefined>(undefined);

export function MovementProvider({ children }: { children: React.ReactNode }) {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMovements = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem("movements");
      if (data) {
        setMovements(JSON.parse(data));
      }
    } catch (error) {
      console.error("Erro ao carregar movimentos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMovements();
  }, [loadMovements]);

  const saveMovements = useCallback(async (newMovements: Movement[]) => {
    try {
      await AsyncStorage.setItem("movements", JSON.stringify(newMovements));
      setMovements(newMovements);
    } catch (error) {
      console.error("Erro ao salvar movimentos:", error);
    }
  }, []);

  const addMovement = useCallback(
    async (movement: Omit<Movement, "id" | "dataCriacao" | "dataAtualizacao">) => {
      const now = new Date().toISOString();
      const newMovement: Movement = {
        ...movement,
        id: generateId(),
        dataCriacao: now,
        dataAtualizacao: now,
      };
      await saveMovements([...movements, newMovement]);
    },
    [movements, saveMovements]
  );

  const updateMovement = useCallback(
    async (id: string, updates: Partial<Movement>) => {
      const updated = movements.map((mov) =>
        mov.id === id
          ? { ...mov, ...updates, dataAtualizacao: new Date().toISOString() }
          : mov
      );
      await saveMovements(updated);
    },
    [movements, saveMovements]
  );

  const deleteMovement = useCallback(
    async (id: string) => {
      const filtered = movements.filter((mov) => mov.id !== id);
      await saveMovements(filtered);
    },
    [movements, saveMovements]
  );

  const getMovementsByAccount = useCallback(
    (accountId: string) => {
      return movements.filter((mov) => mov.contaId === accountId);
    },
    [movements]
  );

  const getMovementsByNature = useCallback(
    (natureId: string) => {
      return movements.filter((mov) => mov.naturezaId === natureId);
    },
    [movements]
  );

  return (
    <MovementContext.Provider
      value={{
        movements,
        loading,
        addMovement,
        updateMovement,
        deleteMovement,
        loadMovements,
        getMovementsByAccount,
        getMovementsByNature,
      }}
    >
      {children}
    </MovementContext.Provider>
  );
}

export function useMovements() {
  const context = useContext(MovementContext);
  if (!context) {
    throw new Error("useMovements must be used within MovementProvider");
  }
  return context;
}
