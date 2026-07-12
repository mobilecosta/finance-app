import { ScrollView, Text, View, Dimensions } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useMovements } from "@/lib/contexts/MovementContext";
import { useNatures } from "@/lib/contexts/NatureContext";
import { useAccounts } from "@/lib/contexts/AccountContext";
import { PieChart } from "react-native-gifted-charts";
import { useMemo } from "react";
import { BCard, BBadge } from "@/components/bootstrap";
import { BRow, BCol } from "@/components/bootstrap";
import { useBootstrapStyles } from "@/lib/bootstrap-theme";

export default function HomeScreen() {
  const { movements } = useMovements();
  const { natures } = useNatures();
  const { accounts } = useAccounts();
  const { s, c } = useBootstrapStyles();

  const screenWidth = Dimensions.get("window").width;

  const totals = useMemo(() => {
    const income = movements
      .filter((m) => m.tipo === "receita")
      .reduce((acc, curr) => acc + curr.valor, 0);
    const expense = movements
      .filter((m) => m.tipo === "despesa")
      .reduce((acc, curr) => acc + curr.valor, 0);
    return { income, expense, balance: income - expense };
  }, [movements]);

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
      <ScrollView style={s.flex1} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Text style={[s.h3, { color: c.BODY_COLOR }, s.mb4]}>Resumo Financeiro</Text>

        <BCard variant="primary" style={{ borderRadius: 16, marginBottom: 16 }}>
          <Text style={[s.text, { color: c.WHITE, opacity: 0.8 }]}Saldo Total</Text>
          <Text style={[s.h3, { color: c.WHITE }]}>{formatCurrency(totals.balance)}</Text>
        </BCard>

        <BRow style={{ marginBottom: 16 }}>
          <BCol size={6} style={{ paddingRight: 8 }}>
            <BCard style={{ borderRadius: 12 }}>
              <Text style={[s.text, s.textMuted, s.mb1]}>Receitas</Text>
              <Text style={[s.h5, { color: c.SUCCESS }]}>{formatCurrency(totals.income)}</Text>
            </BCard>
          </BCol>
          <BCol size={6} style={{ paddingLeft: 8 }}>
            <BCard style={{ borderRadius: 12 }}>
              <Text style={[s.text, s.textMuted, s.mb1]}>Despesas</Text>
              <Text style={[s.h5, { color: c.DANGER }]}>{formatCurrency(totals.expense)}</Text>
            </BCard>
          </BCol>
        </BRow>

        <BCard style={{ borderRadius: 16, alignItems: "center" }}>
          <View style={[s.w100, s.mb4]}>
            <Text style={[s.h5, { color: c.BODY_COLOR }]}>Gastos por Categoria</Text>
          </View>

          {chartData.length > 0 ? (
            <>
              <PieChart
                data={chartData}
                donut
                sectionAutoFocus
                radius={90}
                innerRadius={60}
                innerCircleColor={c.WHITE}
                centerLabelComponent={() => {
                  return (
                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                      <Text style={{ fontSize: 22, color: c.BODY_COLOR, fontWeight: "bold" }}>
                        {Math.round((totals.expense / (totals.income || 1)) * 100)}%
                      </Text>
                      <Text style={{ fontSize: 12, color: c.BODY_COLOR }}>Gasto</Text>
                    </View>
                  );
                }}
              />

              <View style={[s.w100, s.mt4]}>
                {chartData.map((item, index) => (
                  <View
                    key={index}
                    style={[s.flexRow, s.justifyContentBetween, s.alignItemsCenter, s.mb2]}
                  >
                    <View style={s.flexRow}>
                      <View
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: 6,
                          backgroundColor: item.color,
                          marginRight: 8,
                          alignSelf: "center",
                        }}
                      />
                      <Text style={[s.text, { color: c.BODY_COLOR }]}>
                        {item.text} {item.label}
                      </Text>
                    </View>
                    <Text style={[s.text, s.textMuted, s.fontWeightBold]}>{formatCurrency(item.value)}</Text>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <View style={s.py5}>
              <Text style={[s.text, s.textMuted, s.fontItalic]}>
                Nenhuma despesa registrada para exibir o gráfico.
              </Text>
            </View>
          )}
        </BCard>

        <View style={s.mt4}>
          <Text style={[s.h5, { color: c.BODY_COLOR }, s.mb3]}>Suas Contas</Text>
          {accounts.map((account) => (
            <BCard key={account.id} style={{ borderRadius: 12, marginBottom: 12 }}>
              <View style={[s.flexRow, s.justifyContentBetween, s.alignItemsCenter]}>
                <View>
                  <Text style={[s.h6, { color: c.BODY_COLOR }]}>{account.nome}</Text>
                  <Text style={[s.text, s.textMuted, s.textCapitalize]}>{account.tipo}</Text>
                </View>
                <Text style={[s.h6, { color: c.BODY_COLOR }]}>{formatCurrency(account.saldoAtual)}</Text>
              </View>
            </BCard>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
