import { ScrollView, Text, View, Dimensions } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useMovements } from "@/lib/contexts/MovementContext";
import { useNatures } from "@/lib/contexts/NatureContext";
import { useAccounts } from "@/lib/contexts/AccountContext";
import { PieChart } from "react-native-gifted-charts";
import { useMemo } from "react";

export default function HomeScreen() {
  const { movements } = useMovements();
  const { natures } = useNatures();
  const { accounts } = useAccounts();

  const screenWidth = Dimensions.get("window").width;

  // Calcular totais
  const totals = useMemo(() => {
    const income = movements
      .filter((m) => m.tipo === "receita")
      .reduce((acc, curr) => acc + curr.valor, 0);
    const expense = movements
      .filter((m) => m.tipo === "despesa")
      .reduce((acc, curr) => acc + curr.valor, 0);
    return { income, expense, balance: income - expense };
  }, [movements]);

  // Preparar dados do gráfico por natureza (apenas despesas)
  const chartData = useMemo(() => {
    const expensesByNature: Record<string, number> = {};
    
    movements
      .filter((m) => m.tipo === "despesa")
      .forEach((m) => {
        expensesByNature[m.naturezaId] = (expensesByNature[m.naturezaId] || 0) + m.valor;
      });

    return Object.entries(expensesByNature).map(([natureId, value]) => {
      const nature = natures.find((n) => n.id === natureId);
      return {
        value,
        color: nature?.cor || "#CBD5E1",
        label: nature?.nome || "Outros",
        text: nature?.icone || "❓",
      };
    });
  }, [movements, natures]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <ScreenContainer className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <Text className="text-3xl font-bold text-foreground mb-6">Resumo Financeiro</Text>

        {/* Cards de Saldo */}
        <View className="bg-primary p-6 rounded-3xl shadow-sm mb-6">
          <Text className="text-background/80 text-sm font-medium mb-1">Saldo Total</Text>
          <Text className="text-background text-3xl font-bold">{formatCurrency(totals.balance)}</Text>
        </View>

        <View className="flex-row gap-4 mb-8">
          <View className="flex-1 bg-surface p-4 rounded-2xl border border-border">
            <Text className="text-muted text-xs mb-1">Receitas</Text>
            <Text className="text-income font-bold text-lg">{formatCurrency(totals.income)}</Text>
          </View>
          <View className="flex-1 bg-surface p-4 rounded-2xl border border-border">
            <Text className="text-muted text-xs mb-1">Despesas</Text>
            <Text className="text-expense font-bold text-lg">{formatCurrency(totals.expense)}</Text>
          </View>
        </View>

        {/* Gráfico de Gastos por Natureza */}
        <View className="bg-surface p-6 rounded-3xl border border-border items-center">
          <Text className="text-lg font-bold text-foreground mb-6 self-start">Gastos por Categoria</Text>
          
          {chartData.length > 0 ? (
            <>
              <PieChart
                data={chartData}
                donut
                sectionAutoFocus
                radius={90}
                innerRadius={60}
                innerCircleColor={"#FFFFFF"}
                centerLabelComponent={() => {
                  return (
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{ fontSize: 22, color: 'black', fontWeight: 'bold' }}>
                        {Math.round((totals.expense / (totals.income || 1)) * 100)}%
                      </Text>
                      <Text style={{ fontSize: 12, color: 'black' }}>Gasto</Text>
                    </View>
                  );
                }}
              />
              
              {/* Legenda */}
              <View className="w-full mt-6 gap-2">
                {chartData.map((item, index) => (
                  <View key={index} className="flex-row justify-between items-center">
                    <View className="flex-row items-center gap-2">
                      <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: item.color }} />
                      <Text className="text-foreground text-sm">{item.text} {item.label}</Text>
                    </View>
                    <Text className="text-muted text-sm font-medium">{formatCurrency(item.value)}</Text>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <View className="py-10">
              <Text className="text-muted italic">Nenhuma despesa registrada para exibir o gráfico.</Text>
            </View>
          )}
        </View>

        {/* Resumo de Contas */}
        <View className="mt-8">
          <Text className="text-lg font-bold text-foreground mb-4">Suas Contas</Text>
          {accounts.map((account) => (
            <View key={account.id} className="bg-surface p-4 rounded-2xl border border-border mb-3 flex-row justify-between items-center">
              <View>
                <Text className="text-foreground font-semibold">{account.nome}</Text>
                <Text className="text-muted text-xs capitalize">{account.tipo}</Text>
              </View>
              <Text className="text-foreground font-bold">{formatCurrency(account.saldoAtual)}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
