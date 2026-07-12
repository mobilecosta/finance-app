import { ScrollView, Text, View, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useMovements } from "@/lib/contexts/MovementContext";
import { useAccounts } from "@/lib/contexts/AccountContext";
import { useNatures } from "@/lib/contexts/NatureContext";
import { useMemo } from "react";

export default function ReportsScreen() {
  const { movements } = useMovements();
  const { accounts } = useAccounts();
  const { natures } = useNatures();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const totals = useMemo(() => {
    const income = movements
      .filter((m) => m.tipo === "receita")
      .reduce((acc, curr) => acc + curr.valor, 0);
    const expense = movements
      .filter((m) => m.tipo === "despesa")
      .reduce((acc, curr) => acc + curr.valor, 0);
    return { income, expense, balance: income - expense };
  }, [movements]);

  const sortedMovements = useMemo(() => {
    return [...movements].sort(
      (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
    );
  }, [movements]);

  return (
    <ScreenContainer className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <Text className="text-3xl font-bold text-foreground mb-6">Relatório Geral</Text>

        {/* Resumo Consolidado */}
        <View className="bg-surface p-6 rounded-3xl border border-border mb-8">
          <Text className="text-lg font-bold text-foreground mb-4">Resumo Consolidado</Text>
          <View className="flex-row justify-between mb-2">
            <Text className="text-muted">Total de Receitas</Text>
            <Text className="text-income font-semibold">{formatCurrency(totals.income)}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-muted">Total de Despesas</Text>
            <Text className="text-expense font-semibold">{formatCurrency(totals.expense)}</Text>
          </View>
          <View className="h-[1px] bg-border my-2" />
          <View className="flex-row justify-between">
            <Text className="text-foreground font-bold">Saldo Líquido</Text>
            <Text className={`font-bold ${totals.balance >= 0 ? "text-income" : "text-expense"}`}>
              {formatCurrency(totals.balance)}
            </Text>
          </View>
        </View>

        {/* Detalhamento por Conta */}
        <View className="mb-8">
          <Text className="text-xl font-bold text-foreground mb-4">Detalhamento de Contas</Text>
          {accounts.map((account) => (
            <View key={account.id} className="bg-surface p-4 rounded-2xl border border-border mb-3">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-foreground font-semibold text-lg">{account.nome}</Text>
                <Text className="text-primary font-bold">{formatCurrency(account.saldoAtual)}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-muted text-xs capitalize">{account.tipo}</Text>
                <Text className="text-muted text-xs">Saldo Inicial: {formatCurrency(account.saldoInicial)}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Tabela de Movimentos */}
        <View>
          <Text className="text-xl font-bold text-foreground mb-4">Histórico de Movimentos</Text>
          <View className="bg-surface rounded-2xl border border-border overflow-hidden">
            <View className="bg-muted/10 p-3 flex-row border-b border-border">
              <Text className="flex-1 text-xs font-bold text-muted">Data</Text>
              <Text className="flex-[2] text-xs font-bold text-muted">Descrição</Text>
              <Text className="flex-1 text-xs font-bold text-muted text-right">Valor</Text>
            </View>
            {sortedMovements.length > 0 ? (
              sortedMovements.map((mov) => (
                <View key={mov.id} className="p-3 flex-row border-b border-border last:border-0">
                  <Text className="flex-1 text-[10px] text-foreground">{formatDate(mov.data)}</Text>
                  <View className="flex-[2]">
                    <Text className="text-[10px] font-medium text-foreground" numberOfLines={1}>{mov.descricao}</Text>
                    <Text className="text-[8px] text-muted">
                      {natures.find(n => n.id === mov.naturezaId)?.nome || "Natureza"}
                    </Text>
                  </View>
                  <Text className={`flex-1 text-[10px] font-bold text-right ${mov.tipo === 'receita' ? 'text-income' : 'text-expense'}`}>
                    {mov.tipo === 'receita' ? '+' : '-'} {formatCurrency(mov.valor)}
                  </Text>
                </View>
              ))
            ) : (
              <View className="p-8 items-center">
                <Text className="text-muted italic text-sm">Sem movimentos para exibir.</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
