import { ScrollView, Text, View, FlatList, Pressable, TextInput, Modal, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useState, useCallback } from "react";
import { useAccounts } from "@/lib/contexts/AccountContext";
import { useFocusEffect } from "expo-router";

export default function AccountsScreen() {
  const { accounts, loading, addAccount, updateAccount, deleteAccount, loadAccounts } = useAccounts();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    tipo: "corrente" as "corrente" | "poupança" | "investimento",
    saldoInicial: "",
  });

  useFocusEffect(
    useCallback(() => {
      loadAccounts();
    }, [loadAccounts])
  );

  const handleOpenModal = (account?: any) => {
    if (account) {
      setEditingId(account.id);
      setFormData({
        nome: account.nome,
        tipo: account.tipo,
        saldoInicial: account.saldoInicial.toString(),
      });
    } else {
      setEditingId(null);
      setFormData({ nome: "", tipo: "corrente", saldoInicial: "" });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleResetForm = () => {
    setFormData({ nome: "", tipo: "corrente", saldoInicial: "" });
  };

  const handleSave = async () => {
    if (!formData.nome || !formData.saldoInicial) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    const saldo = parseFloat(formData.saldoInicial);
    if (isNaN(saldo)) {
      Alert.alert("Erro", "Saldo inicial inválido");
      return;
    }

    try {
      if (editingId) {
        await updateAccount(editingId, {
          nome: formData.nome,
          tipo: formData.tipo,
          saldoInicial: saldo,
        });
      } else {
        await addAccount({
          nome: formData.nome,
          tipo: formData.tipo,
          saldoInicial: saldo,
          saldoAtual: saldo,
        });
      }
      setShowModal(false);
      await loadAccounts();
    } catch (error) {
      Alert.alert("Erro", "Falha ao salvar conta");
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert("Confirmar", "Deseja deletar esta conta? Todos os movimentos vinculados também serão afetados.", [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Deletar",
            style: "destructive",
            onPress: async () => {
              try {
                await deleteAccount(id);
                await loadAccounts();
                handleCloseModal();
              } catch (error) {
                Alert.alert("Erro", "Falha ao deletar conta");
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

  const renderAccountItem = ({ item }: { item: any }) => (
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
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-foreground">{item.nome}</Text>
          <Text className="text-sm text-muted mt-1 capitalize">{item.tipo}</Text>
          <Text className="text-sm font-bold text-primary mt-1">{formatCurrency(item.saldoAtual)}</Text>
        </View>
        <View className="flex-row gap-2">
          <Pressable
            onPress={() => handleOpenModal(item)}
            className="px-3 py-2 bg-primary rounded"
          >
            <Text className="text-white text-sm">Editar</Text>
          </Pressable>
          <Pressable
            onPress={() => handleDelete(item.id)}
            className="px-3 py-2 bg-error rounded"
          >
            <Text className="text-white text-sm">Deletar</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );

  return (
    <ScreenContainer className="flex-1">
      <View className="flex-1 bg-background">
        <View className="px-4 py-4 border-b border-border">
          <Text className="text-2xl font-bold text-foreground">Contas</Text>
        </View>

        {loading ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-muted">Carregando contas...</Text>
          </View>
        ) : accounts.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-muted">Nenhuma conta cadastrada</Text>
          </View>
        ) : (
          <FlatList
            data={accounts}
            renderItem={renderAccountItem}
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

        <Modal visible={showModal} animationType="slide" transparent>
          <View className="flex-1 bg-black/50 justify-end">
            <View className="bg-background rounded-t-2xl p-6 pb-8" style={{ maxHeight: "90%" }}>
              <Text className="text-2xl font-bold text-foreground mb-4">
                {editingId ? "Editar Conta" : "Nova Conta"}
              </Text>

              <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                <Text className="text-sm text-muted mb-2">Nome da Conta</Text>
                <TextInput
                  className="border border-border rounded-lg px-4 py-3 mb-4 text-foreground"
                  placeholder="Ex: Nubank, Itaú, Carteira"
                  value={formData.nome}
                  onChangeText={(text) => setFormData({ ...formData, nome: text })}
                  placeholderTextColor="#687076"
                />

                <Text className="text-sm text-muted mb-2">Tipo</Text>
                <View className="flex-row gap-2 mb-4">
                  {["corrente", "poupança", "investimento"].map((tipo) => (
                    <Pressable
                      key={tipo}
                      onPress={() => setFormData({ ...formData, tipo: tipo as any })}
                      className={`flex-1 py-2 px-1 rounded-lg border ${
                        formData.tipo === tipo
                          ? "bg-primary border-primary"
                          : "bg-surface border-border"
                      }`}
                    >
                      <Text
                        className={`text-center text-xs font-semibold capitalize ${
                          formData.tipo === tipo ? "text-background" : "text-foreground"
                        }`}
                      >
                        {tipo}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <Text className="text-sm text-muted mb-2">Saldo Inicial</Text>
                <TextInput
                  className="border border-border rounded-lg px-4 py-3 mb-4 text-foreground"
                  placeholder="0.00"
                  value={formData.saldoInicial}
                  onChangeText={(text) => setFormData({ ...formData, saldoInicial: text })}
                  keyboardType="decimal-pad"
                  placeholderTextColor="#687076"
                />
              </ScrollView>

              <View className="gap-3 pt-4">
                <Pressable
                  onPress={handleSave}
                  className="py-3 px-4 rounded-lg bg-primary"
                >
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
