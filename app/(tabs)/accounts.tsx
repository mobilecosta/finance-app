import { ScrollView, Text, View, FlatList, Pressable, TextInput, Modal, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { CrudFab, CrudHeader, CrudPrimaryActions } from "@/components/crud-actions";
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
      <View className="flex-1 bg-background" style={{ position: "relative" }}>
        <CrudHeader title="Contas" onInclude={() => handleOpenModal()} />

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
            contentContainerStyle={{ paddingVertical: 12, paddingBottom: 88 }}
          />
        )}

        <CrudFab onPress={() => handleOpenModal()} accessibilityLabel="Incluir conta" />

        <Modal visible={showModal} animationType="slide" transparent>
          <View className="flex-1 bg-black/50 justify-end">
            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                padding: 24,
                paddingBottom: 32,
                maxHeight: "90%",
              }}
            >
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "700",
                    color: "#212529",
                    marginBottom: 12,
                  }}
                >
                  {editingId ? "Editar Conta" : "Nova Conta"}
                </Text>
                <CrudPrimaryActions
                  isEditing={Boolean(editingId)}
                  saving={saving}
                  onSave={() => void handleSave()}
                  onCancel={handleCloseModal}
                  onSecondary={
                    editingId ? () => void handleDelete(editingId) : handleResetForm
                  }
                />
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
