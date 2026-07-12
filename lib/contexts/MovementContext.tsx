import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { supabase } from "../supabase/client";
import { useAuth } from "./AuthContext";

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
  user_id: string;
}

interface MovementContextType {
  movements: Movement[];
  loading: boolean;
  addMovement: (movement: Omit<Movement, "id" | "dataCriacao" | "dataAtualizacao" | "user_id">) => Promise<void>;
  updateMovement: (id: string, movement: Partial<Movement>) => Promise<void>;
  deleteMovement: (id: string) => Promise<void>;
  loadMovements: () => Promise<void>;
}

const MovementContext = createContext<MovementContextType | undefined>(undefined);

export function MovementProvider({ children }: { children: React.ReactNode }) {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadMovements = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("movements")
        .select("*")
        .eq("user_id", user.id)
        .order("data", { ascending: false });

      if (error) throw error;

      const mappedMovements = data.map(item => ({
        id: item.id,
        data: item.data,
        descricao: item.descricao,
        naturezaId: item.natureza_id,
        contaId: item.conta_id,
        valor: item.valor,
        tipo: item.tipo,
        dataCriacao: item.data_criacao,
        dataAtualizacao: item.data_atualizacao,
        user_id: item.user_id
      }));

      setMovements(mappedMovements as Movement[]);
    } catch (error) {
      console.error("Erro ao carregar movimentos:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadMovements();
  }, [loadMovements]);

  const addMovement = useCallback(
    async (movement: Omit<Movement, "id" | "dataCriacao" | "dataAtualizacao" | "user_id">) => {
      if (!user) return;
      try {
        const { error } = await supabase.from("movements").insert([
          {
            data: movement.data,
            descricao: movement.descricao,
            natureza_id: movement.naturezaId,
            conta_id: movement.contaId,
            valor: movement.valor,
            tipo: movement.tipo,
            user_id: user.id,
          },
        ]);
        if (error) throw error;
        
        // Atualizar saldo da conta
        const { data: accountData, error: accountError } = await supabase
          .from("accounts")
          .select("saldo_atual")
          .eq("id", movement.contaId)
          .single();

        if (!accountError && accountData) {
          const newBalance = movement.tipo === "receita" 
            ? accountData.saldo_atual + movement.valor 
            : accountData.saldo_atual - movement.valor;
          
          await supabase
            .from("accounts")
            .update({ saldo_atual: newBalance })
            .eq("id", movement.contaId);
        }

        await loadMovements();
      } catch (error) {
        console.error("Erro ao adicionar movimento:", error);
        throw error;
      }
    },
    [user, loadMovements]
  );

  const updateMovement = useCallback(
    async (id: string, updates: Partial<Movement>) => {
      try {
        // Buscar movimento antigo para calcular diferença de saldo
        const { data: oldMovement } = await supabase
          .from("movements")
          .select("*")
          .eq("id", id)
          .single();

        const dbUpdates: any = {
          data_atualizacao: new Date().toISOString(),
        };

        if (updates.data) dbUpdates.data = updates.data;
        if (updates.descricao) dbUpdates.descricao = updates.descricao;
        if (updates.naturezaId) dbUpdates.natureza_id = updates.naturezaId;
        if (updates.contaId) dbUpdates.conta_id = updates.contaId;
        if (updates.valor !== undefined) dbUpdates.valor = updates.valor;
        if (updates.tipo) dbUpdates.tipo = updates.tipo;

        const { error } = await supabase
          .from("movements")
          .update(dbUpdates)
          .eq("id", id);

        if (error) throw error;

        // Ajustar saldo da conta se valor ou tipo mudou
        if (oldMovement && (updates.valor !== undefined || updates.tipo || updates.contaId)) {
          // Reverter saldo antigo
          const oldAccountId = updates.contaId || oldMovement.conta_id;
          const { data: oldAcc } = await supabase
            .from("accounts")
            .select("saldo_atual")
            .eq("id", oldMovement.conta_id)
            .single();

          if (oldAcc) {
            const reverted = oldMovement.tipo === "receita"
              ? oldAcc.saldo_atual - oldMovement.valor
              : oldAcc.saldo_atual + oldMovement.valor;

            await supabase
              .from("accounts")
              .update({ saldo_atual: reverted })
              .eq("id", oldMovement.conta_id);
          }

          // Aplicar novo saldo
          const newValor = updates.valor !== undefined ? updates.valor : oldMovement.valor;
          const newTipo = updates.tipo || oldMovement.tipo;
          const newContaId = updates.contaId || oldMovement.conta_id;

          const { data: newAcc } = await supabase
            .from("accounts")
            .select("saldo_atual")
            .eq("id", newContaId)
            .single();

          if (newAcc) {
            const newBalance = newTipo === "receita"
              ? newAcc.saldo_atual + newValor
              : newAcc.saldo_atual - newValor;

            await supabase
              .from("accounts")
              .update({ saldo_atual: newBalance })
              .eq("id", newContaId);
          }
        }

        await loadMovements();
      } catch (error) {
        console.error("Erro ao atualizar movimento:", error);
        throw error;
      }
    },
    [loadMovements]
  );

  const deleteMovement = useCallback(
    async (id: string) => {
      try {
        // Buscar o movimento antes de deletar para ajustar o saldo
        const { data: movData } = await supabase
          .from("movements")
          .select("*")
          .eq("id", id)
          .single();

        if (movData) {
          const { data: accData } = await supabase
            .from("accounts")
            .select("saldo_atual")
            .eq("id", movData.conta_id)
            .single();

          if (accData) {
            const adjustedBalance = movData.tipo === "receita"
              ? accData.saldo_atual - movData.valor
              : accData.saldo_atual + movData.valor;

            await supabase
              .from("accounts")
              .update({ saldo_atual: adjustedBalance })
              .eq("id", movData.conta_id);
          }
        }

        const { error } = await supabase.from("movements").delete().eq("id", id);
        if (error) throw error;
        await loadMovements();
      } catch (error) {
        console.error("Erro ao deletar movimento:", error);
        throw error;
      }
    },
    [loadMovements]
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
