import { ScrollView, Text, View, FlatList, Pressable, TextInput, Modal, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useState, useCallback } from "react";
import { useMovements } from "@/lib/contexts/MovementContext";
import { useAccounts } from "@/lib/contexts/AccountContext";
import { useNatures } from "@/lib/contexts/NatureContext";
import { useFocusEffect } from "expo-router";

export default function MovementsScreen() {
  const { movements, loading, addMovement, updateMovement, deleteMovement, loadMovements } =
    useMovements();
  const { accounts, loadAccounts } = useAccounts();
  const { natures, loadNatures } = useNatures();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    data: new Date().toISOString().split("T")[0],
    descricao: "",
    naturezaId: "",
    contaId: "",
    valor: "",
    tipo: "despesa" as "receita" | "despesa",
  });

  useFocusEffect(
    useCallback(() => {
      loadMovements();
      loadAccounts();
      loadNatures();
    }, [loadMovements, loadAccounts, loadNatures])
  );

  const handleOpenModal = (movement?: any) => {
    if (movement) {
      setEditingId(movement.id);
      setFormData({
        data: movement.data.split("T")[0],
        descricao: movement.descricao,
        naturezaId: movement.naturezaId,
        contaId: movement.contaId,
        valor: movement.valor.toString(),
        tipo: movement.tipo,
      });
    } else {
      setEditingId(null);
      setFormData({
        data: new Date().toISOString().split("T")[0],
        descricao: "",
        naturezaId: "",
        contaId: "",
        valor: "",
        tipo: "despesa",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleResetForm = () => {
    setFormData({
      data: new Date().toISOString().split("T")[0],
      descricao: "",
      naturezaId: "",
      contaId: "",
      valor: "",
      tipo: "despesa",
    });
  };

  const handleSave = async () => {
    if (!formData.descricao || !formData.naturezaId || !formData.contaId || !formData.valor) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    const valor = parseFloat(formData.valor);
    if (isNaN(valor) || valor <= 0) {
      Alert.alert("Erro", "Valor inválido");
      return;
    }

    try {
      if (editingId) {
        await updateMovement(editingId, {
          data: formData.data,
          descricao: formData.descricao,
          naturezaId: formData.naturezaId,
          contaId: formData.contaId,
          valor,
          tipo: formData.tipo,
        });
      } else {
        await addMovement({
          data: formData.data,
          descricao: formData.descricao,
          naturezaId: formData.naturezaId,
          contaId: formData.contaId,
          valor,
          tipo: formData.tipo,
        });
      }
      setShowModal(false);
      await loadMovements();
    } catch (error) {
      Alert.alert("Erro", "Falha ao salvar movimento");
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert("Confirmar", "Deseja deletar este movimento?", [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Deletar",
            style: "destructive",
            onPress: async () => {
              try {
                await deleteMovement(id);
                await loadMovements();
                handleCloseModal();
              } catch (error) {
                Alert.alert("Erro", "Falha ao deletar movimento");
              }
            },
          },
    ]);
  };

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

  const getNatureName = (id: string) => {
    return natures.find((n) => n.id === id)?.nome || "Desconhecida";
  };

  const getAccountName = (id: string) => {
    return accounts.find((a) => a.id === id)?.nome || "Desconhecida";
  };

  const renderMovementItem = ({ item }: { item: any }) => (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? "#f0f0f0" : "#ffffff",
          paddingVertical: 12,
          paddingHorizontal: 16,
          marginVertical: 6,
          marginHorizontal: 16,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#E5E7EB",
        },
      ]}
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-foreground">{item.descricao}</Text>
          <Text className="text-xs text-muted mt-1">{getNatureName(item.naturezaId)}</Text>
          <Text className="text-xs text-muted">{getAccountName(item.contaId)}</Text>
          <Text className="text-xs text-muted mt-1">{formatDate(item.data)}</Text>
        </View>
        <View className="items-end gap-2">
          <Text
            className={`text-lg font-bold ${
              item.tipo === "receita" ? "text-income" : "text-expense"
            }`}
          >
            {item.tipo === "receita" ? "+" : "-"} {formatCurrency(item.valor)}
          </Text>
          <View className="flex-row gap-1">
            <Pressable
              onPress={() => handleOpenModal(item)}
              className="px-2 py-1 bg-primary rounded"
            >
              <Text className="text-white text-xs">Editar</Text>
            </Pressable>
            <Pressable
              onPress={() => handleDelete(item.id)}
              className="px-2 py-1 bg-error rounded"
            >
              <Text className="text-white text-xs">Deletar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  );

  const sortedMovements = [...movements].sort(
    (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
  );

  return (
    <ScreenContainer className="flex-1">
      <View className="flex-1 bg-background">
        <View className="px-4 py-4 border-b border-border">
          <Text className="text-2xl font-bold text-foreground">Movimentos</Text>
        </View>

        {loading ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-muted">Carregando movimentos...</Text>
          </View>
        ) : sortedMovements.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-muted">Nenhum movimento registrado</Text>
          </View>
        ) : (
          <FlatList
            data={sortedMovements}
            renderItem={renderMovementItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingVertical: 12 }}
          />
        )}

        <Pressable
          onPress={() => handleOpenModal()}
          className="absolute bottom-6 right-6 bg-primary w-14 h-14 rounded-full items-center justify-center shadow-lg"
        >
          <Text className="text-2xl text-background">+</Text>
        </Pressable>

        {/* Modal de Formulário */}
        <Modal visible={showModal} animationType="slide" transparent>
          <View className="flex-1 bg-black/50 justify-end">
            <View className="bg-background rounded-t-2xl p-6 pb-8" style={{ maxHeight: "90%" }}>
              <Text className="text-2xl font-bold text-foreground mb-4">
                {editingId ? "Editar Movimento" : "Novo Movimento"}
              </Text>

              <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                <Text className="text-sm text-muted mb-2">Data</Text>
                <TextInput
                  className="border border-border rounded-lg px-4 py-3 mb-4 text-foreground"
                  placeholder="YYYY-MM-DD"
                  value={formData.data}
                  onChangeText={(text) => setFormData({ ...formData, data: text })}
                  placeholderTextColor="#687076"
                />

                <Text className="text-sm text-muted mb-2">Descrição</Text>
                <TextInput
                  className="border border-border rounded-lg px-4 py-3 mb-4 text-foreground"
                  placeholder="Ex: Compras no supermercado"
                  value={formData.descricao}
                  onChangeText={(text) => setFormData({ ...formData, descricao: text })}
                  placeholderTextColor="#687076"
                />

                <Text className="text-sm text-muted mb-2">Tipo</Text>
                <View className="flex-row gap-2 mb-4">
                  {(["receita", "despesa"] as const).map((tipo) => (
                    <Pressable
                      key={tipo}
                      onPress={() => setFormData({ ...formData, tipo })}
                      className={`flex-1 py-2 px-3 rounded-lg border ${
                        formData.tipo === tipo
                          ? "bg-primary border-primary"
                          : "bg-surface border-border"
                      }`}
                    >
                      <Text
                        className={`text-center text-sm font-semibold ${
                          formData.tipo === tipo ? "text-background" : "text-foreground"
                        }`}
                      >
                        {tipo === "receita" ? "Receita" : "Despesa"}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <Text className="text-sm text-muted mb-2">Natureza</Text>
                <View className="border border-border rounded-lg mb-4 max-h-32">
                  <ScrollView>
                    {natures.map((nature) => (
                      <Pressable
                        key={nature.id}
                        onPress={() => setFormData({ ...formData, naturezaId: nature.id })}
                        className={`px-4 py-3 border-b border-border ${
                          formData.naturezaId === nature.id ? "bg-primary/10" : ""
                        }`}
                      >
                        <Text
                          className={`${
                            formData.naturezaId === nature.id
                              ? "text-primary font-semibold"
                              : "text-foreground"
                          }`}
                        >
                          {nature.icone} {nature.nome}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>

                <Text className="text-sm text-muted mb-2">Conta</Text>
                <View className="border border-border rounded-lg mb-4 max-h-32">
                  <ScrollView>
                    {accounts.map((account) => (
                      <Pressable
                        key={account.id}
                        onPress={() => setFormData({ ...formData, contaId: account.id })}
                        className={`px-4 py-3 border-b border-border ${
                          formData.contaId === account.id ? "bg-primary/10" : ""
                        }`}
                      >
                        <Text
                          className={`${
                            formData.contaId === account.id
                              ? "text-primary font-semibold"
                              : "text-foreground"
                          }`}
                        >
                          {account.nome}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>

                <Text className="text-sm text-muted mb-2">Valor</Text>
                <TextInput
                  className="border border-border rounded-lg px-4 py-3 mb-4 text-foreground"
                  placeholder="0.00"
                  value={formData.valor}
                  onChangeText={(text) => setFormData({ ...formData, valor: text })}
                  keyboardType="decimal-pad"
                  placeholderTextColor="#687076"
                />
              </ScrollView>

              <View className="gap-3 pt-4">
                <Pressable onPress={handleSave} className="py-3 px-4 rounded-lg bg-primary">
                  <Text className="text-center text-background font-semibold">Salvar</Text>
                </Pressable>
                <View className="flex-row gap-3">
                  <Pressable
                    onPress={handleCloseModal}
                    className="flex-1 py-3 px-4 rounded-lg bg-surface border border-border"
                  >
                    <Text className="text-center text-foreground font-semibold">Cancelar</Text>
                  </Pressable>
                  {editingId ? (
                    <Pressable
                      onPress={() => handleDelete(editingId)}
                      className="flex-1 py-3 px-4 rounded-lg bg-error"
                    >
                      <Text className="text-center text-background font-semibold">Excluir</Text>
                    </Pressable>
                  ) : (
                    <Pressable
                      onPress={handleResetForm}
                      className="flex-1 py-3 px-4 rounded-lg bg-surface border border-border"
                    >
                      <Text className="text-center text-foreground font-semibold">Limpar</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScreenContainer>
  );
}
