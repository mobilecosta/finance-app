import { ScrollView, Text, View, FlatList, Pressable, TextInput, Modal, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useState, useCallback } from "react";
import { useAccounts } from "@/lib/contexts/AccountContext";
import { useFocusEffect } from "expo-router";
import { confirmAction, formatCurrency, getErrorMessage, parseMoneyInput } from "@/lib/utils";

export default function AccountsScreen() {
  const { accounts, loading, addAccount, updateAccount, deleteAccount, loadAccounts } = useAccounts();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    tipo: "corrente" as "corrente" | "poupança" | "investimento",
    saldoInicial: "",
  });

  useFocusEffect(
    useCallback(() => {
      void loadAccounts().catch(() => {
        Alert.alert("Erro", "Falha ao carregar contas");
      });
    }, [loadAccounts])
  );

  const handleOpenModal = (account?: {
    id: string;
    nome: string;
    tipo: "corrente" | "poupança" | "investimento";
    saldoInicial: number;
  }) => {
    if (account) {
      setEditingId(account.id);
      setFormData({
        nome: account.nome,
        tipo: account.tipo,
        saldoInicial: String(account.saldoInicial ?? 0),
      });
    } else {
      setEditingId(null);
      setFormData({ nome: "", tipo: "corrente", saldoInicial: "0" });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleResetForm = () => {
    setFormData({ nome: "", tipo: "corrente", saldoInicial: "0" });
  };

  const handleSave = async () => {
    const nome = formData.nome.trim();
    if (!nome) {
      Alert.alert("Erro", "Informe o nome da conta");
      return;
    }

    const saldo = parseMoneyInput(formData.saldoInicial);
    if (!Number.isFinite(saldo)) {
      Alert.alert("Erro", "Saldo inicial inválido");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await updateAccount(editingId, {
          nome,
          tipo: formData.tipo,
          saldoInicial: saldo,
        });
      } else {
        await addAccount({
          nome,
          tipo: formData.tipo,
          saldoInicial: saldo,
          saldoAtual: saldo,
        });
      }
      handleCloseModal();
    } catch (error) {
      Alert.alert("Erro", getErrorMessage(error, "Falha ao salvar conta"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirmAction(
      "Confirmar",
      "Deseja deletar esta conta? Todos os movimentos vinculados também serão afetados."
    );
    if (!confirmed) return;

    try {
      await deleteAccount(id);
      handleCloseModal();
    } catch (error) {
      Alert.alert("Erro", getErrorMessage(error, "Falha ao deletar conta"));
    }
  };

  const renderAccountItem = ({
    item,
  }: {
    item: {
      id: string;
      nome: string;
      tipo: string;
      saldoAtual: number;
      saldoInicial: number;
    };
  }) => (
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
          <Text className="text-sm font-bold text-primary mt-1">
            {formatCurrency(item.saldoAtual)}
          </Text>
        </View>
        <View className="flex-row gap-2">
          <Pressable
            onPress={() => handleOpenModal(item as any)}
            className="px-3 py-2 rounded-lg bg-primary border border-primary"
          >
            <Text className="text-background text-sm font-semibold">Editar</Text>
          </Pressable>
          <Pressable
            onPress={() => void handleDelete(item.id)}
            className="px-3 py-2 rounded-lg bg-error"
          >
            <Text className="text-background text-sm font-semibold">Excluir</Text>
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
              <View className="mb-5">
                <Text className="text-2xl font-bold text-foreground mb-3">
                  {editingId ? "Editar Conta" : "Nova Conta"}
                </Text>
                <View className="gap-2">
                  <Pressable
                    onPress={() => void handleSave()}
                    disabled={saving}
                    className="py-3 px-4 rounded-lg bg-primary"
                  >
                    <Text className="text-center text-background text-sm font-semibold">
                      {saving ? "Salvando..." : editingId ? "Alterar" : "Incluir"}
                    </Text>
                  </Pressable>
                  <View className="flex-row gap-2">
                    <Pressable
                      onPress={handleCloseModal}
                      className="flex-1 py-3 px-4 rounded-lg bg-surface border border-border"
                    >
                      <Text className="text-center text-foreground text-sm font-semibold">
                        Cancelar
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={
                        editingId ? () => void handleDelete(editingId) : handleResetForm
                      }
                      className={`flex-1 py-3 px-4 rounded-lg ${editingId ? "bg-error" : "bg-surface border border-border"}`}
                    >
                      <Text
                        className={`text-center text-sm font-semibold ${editingId ? "text-background" : "text-foreground"}`}
                      >
                        {editingId ? "Excluir" : "Limpar"}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>

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
                  {(["corrente", "poupança", "investimento"] as const).map((tipo) => (
                    <Pressable
                      key={tipo}
                      onPress={() => setFormData({ ...formData, tipo })}
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
                  placeholder="0,00"
                  value={formData.saldoInicial}
                  onChangeText={(text) => setFormData({ ...formData, saldoInicial: text })}
                  keyboardType="decimal-pad"
                  placeholderTextColor="#687076"
                />
                {editingId ? (
                  <Text className="text-xs text-muted mb-2">
                    Ao alterar o saldo inicial, o saldo atual é ajustado pela mesma diferença,
                    preservando o efeito dos movimentos.
                  </Text>
                ) : null}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </ScreenContainer>
  );
}
