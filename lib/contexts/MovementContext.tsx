import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { supabase } from "../supabase/client";
import { useAuth } from "./AuthContext";
import { toNumber } from "../utils";

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
  addMovement: (
    movement: Omit<Movement, "id" | "dataCriacao" | "dataAtualizacao" | "user_id">
  ) => Promise<void>;
  updateMovement: (id: string, movement: Partial<Movement>) => Promise<void>;
  deleteMovement: (id: string) => Promise<void>;
  loadMovements: () => Promise<void>;
}

const MovementContext = createContext<MovementContextType | undefined>(undefined);

function mapMovement(item: Record<string, unknown>): Movement {
  return {
    id: String(item.id),
    data: String(item.data ?? ""),
    descricao: String(item.descricao ?? ""),
    naturezaId: String(item.natureza_id ?? ""),
    contaId: String(item.conta_id ?? ""),
    valor: toNumber(item.valor),
    tipo: item.tipo as Movement["tipo"],
    dataCriacao: String(item.data_criacao ?? ""),
    dataAtualizacao: String(item.data_atualizacao ?? ""),
    user_id: String(item.user_id ?? ""),
  };
}

function signedAmount(tipo: "receita" | "despesa", valor: number): number {
  return tipo === "receita" ? valor : -valor;
}

async function adjustAccountBalance(
  accountId: string,
  userId: string,
  delta: number
): Promise<void> {
  if (!accountId || delta === 0) return;

  const { data: account, error } = await supabase
    .from("accounts")
    .select("saldo_atual")
    .eq("id", accountId)
    .eq("user_id", userId)
    .single();

  if (error) throw error;
  if (!account) throw new Error("Conta não encontrada");

  const newBalance = toNumber(account.saldo_atual) + delta;
  const { error: updateError } = await supabase
    .from("accounts")
    .update({ saldo_atual: newBalance })
    .eq("id", accountId)
    .eq("user_id", userId);

  if (updateError) throw updateError;
}

export function MovementProvider({ children }: { children: React.ReactNode }) {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadMovements = useCallback(async () => {
    if (!user) {
      setMovements([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("movements")
        .select("*")
        .eq("user_id", user.id)
        .order("data", { ascending: false });

      if (error) throw error;

      setMovements((data ?? []).map((item) => mapMovement(item as Record<string, unknown>)));
    } catch (error) {
      console.error("Erro ao carregar movimentos:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void loadMovements().catch(() => {
      /* already logged */
    });
  }, [loadMovements]);

  const addMovement = useCallback(
    async (
      movement: Omit<Movement, "id" | "dataCriacao" | "dataAtualizacao" | "user_id">
    ) => {
      if (!user) throw new Error("Usuário não autenticado");

      const valor = toNumber(movement.valor);
      if (valor <= 0) throw new Error("Valor deve ser maior que zero");

      const { error } = await supabase.from("movements").insert([
        {
          data: movement.data,
          descricao: movement.descricao.trim(),
          natureza_id: movement.naturezaId,
          conta_id: movement.contaId,
          valor,
          tipo: movement.tipo,
          user_id: user.id,
        },
      ]);

      if (error) throw error;

      await adjustAccountBalance(movement.contaId, user.id, signedAmount(movement.tipo, valor));
      await loadMovements();
    },
    [user, loadMovements]
  );

  const updateMovement = useCallback(
    async (id: string, updates: Partial<Movement>) => {
      if (!user) throw new Error("Usuário não autenticado");

      const { data: oldMovement, error: fetchError } = await supabase
        .from("movements")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (fetchError) throw fetchError;
      if (!oldMovement) throw new Error("Movimento não encontrado");

      const nextData = updates.data ?? String(oldMovement.data);
      const nextDescricao =
        updates.descricao !== undefined
          ? updates.descricao.trim()
          : String(oldMovement.descricao ?? "");
      const nextNaturezaId = updates.naturezaId ?? String(oldMovement.natureza_id ?? "");
      const nextContaId = updates.contaId ?? String(oldMovement.conta_id ?? "");
      const nextValor =
        updates.valor !== undefined ? toNumber(updates.valor) : toNumber(oldMovement.valor);
      const nextTipo = updates.tipo ?? (oldMovement.tipo as Movement["tipo"]);

      if (nextValor <= 0) throw new Error("Valor deve ser maior que zero");

      const { error } = await supabase
        .from("movements")
        .update({
          data: nextData,
          descricao: nextDescricao,
          natureza_id: nextNaturezaId,
          conta_id: nextContaId,
          valor: nextValor,
          tipo: nextTipo,
          data_atualizacao: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      const oldContaId = String(oldMovement.conta_id ?? "");
      const oldValor = toNumber(oldMovement.valor);
      const oldTipo = oldMovement.tipo as Movement["tipo"];

      const balanceChanged =
        oldContaId !== nextContaId || oldValor !== nextValor || oldTipo !== nextTipo;

      if (balanceChanged) {
        // Revert old effect, then apply new effect (handles same or different accounts)
        if (oldContaId === nextContaId) {
          const delta =
            signedAmount(nextTipo, nextValor) - signedAmount(oldTipo, oldValor);
          await adjustAccountBalance(nextContaId, user.id, delta);
        } else {
          await adjustAccountBalance(oldContaId, user.id, -signedAmount(oldTipo, oldValor));
          await adjustAccountBalance(nextContaId, user.id, signedAmount(nextTipo, nextValor));
        }
      }

      await loadMovements();
    },
    [user, loadMovements]
  );

  const deleteMovement = useCallback(
    async (id: string) => {
      if (!user) throw new Error("Usuário não autenticado");

      const { data: movData, error: fetchError } = await supabase
        .from("movements")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (fetchError) throw fetchError;
      if (!movData) throw new Error("Movimento não encontrado");

      const { error } = await supabase
        .from("movements")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      await adjustAccountBalance(
        String(movData.conta_id ?? ""),
        user.id,
        -signedAmount(movData.tipo as Movement["tipo"], toNumber(movData.valor))
      );

      await loadMovements();
    },
    [user, loadMovements]
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
