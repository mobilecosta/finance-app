import { ScrollView, Text, View, FlatList, Pressable, Modal, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import {
  CrudChoiceGroup,
  CrudFab,
  CrudField,
  CrudHeader,
  CrudPrimaryActions,
  CrudSelectList,
} from "@/components/crud-actions";
import { useMemo, useState, useCallback } from "react";
import { useMovements } from "@/lib/contexts/MovementContext";
import { useAccounts } from "@/lib/contexts/AccountContext";
import { useNatures } from "@/lib/contexts/NatureContext";
import { useFocusEffect } from "expo-router";
import {
  confirmAction,
  formatCurrency,
  getErrorMessage,
  parseMoneyInput,
} from "@/lib/utils";

export default function MovementsScreen() {
  const { movements, loading, addMovement, updateMovement, deleteMovement, loadMovements } =
    useMovements();
  const { accounts, loadAccounts } = useAccounts();
  const { natures, loadNatures } = useNatures();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
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
      void Promise.all([loadMovements(), loadAccounts(), loadNatures()]).catch(() => {
        Alert.alert("Erro", "Falha ao carregar dados");
      });
    }, [loadMovements, loadAccounts, loadNatures])
  );

  const filteredNatures = useMemo(
    () => natures.filter((n) => n.tipo === formData.tipo),
    [natures, formData.tipo]
  );

  const handleOpenModal = (movement?: {
    id: string;
    data: string;
    descricao: string;
    naturezaId: string;
    contaId: string;
    valor: number;
    tipo: "receita" | "despesa";
  }) => {
    if (movement) {
      setEditingId(movement.id);
      setFormData({
        data: String(movement.data).split("T")[0],
        descricao: movement.descricao,
        naturezaId: movement.naturezaId,
        contaId: movement.contaId,
        valor: String(movement.valor ?? ""),
        tipo: movement.tipo,
      });
    } else {
      setEditingId(null);
      setFormData({
        data: new Date().toISOString().split("T")[0],
        descricao: "",
        naturezaId: "",
        contaId: accounts[0]?.id ?? "",
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
      contaId: accounts[0]?.id ?? "",
      valor: "",
      tipo: "despesa",
    });
  };

  const handleTipoChange = (tipo: "receita" | "despesa") => {
    setFormData((prev) => {
      const stillValid = natures.some((n) => n.id === prev.naturezaId && n.tipo === tipo);
      return {
        ...prev,
        tipo,
        naturezaId: stillValid ? prev.naturezaId : "",
      };
    });
  };

  const handleSave = async () => {
    const descricao = formData.descricao.trim();
    if (!descricao || !formData.naturezaId || !formData.contaId || !formData.valor) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    if (!formData.data) {
      Alert.alert("Erro", "Informe a data");
      return;
    }

    const valor = parseMoneyInput(formData.valor);
    if (!Number.isFinite(valor) || valor <= 0) {
      Alert.alert("Erro", "Valor inválido");
      return;
    }

    if (accounts.length === 0) {
      Alert.alert("Erro", "Cadastre uma conta antes de lançar movimentos");
      return;
    }

    if (natures.filter((n) => n.tipo === formData.tipo).length === 0) {
      Alert.alert(
        "Erro",
        `Cadastre uma natureza de ${formData.tipo === "receita" ? "receita" : "despesa"} antes de lançar`
      );
      return;
    }

    setSaving(true);
    try {
      const payload = {
        data: formData.data,
        descricao,
        naturezaId: formData.naturezaId,
        contaId: formData.contaId,
        valor,
        tipo: formData.tipo,
      };

      if (editingId) {
        await updateMovement(editingId, payload);
      } else {
        await addMovement(payload);
      }

      // Keep account balances in sync in the UI after movement mutations
      await loadAccounts();
      handleCloseModal();
    } catch (error) {
      Alert.alert("Erro", getErrorMessage(error, "Falha ao salvar movimento"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirmAction("Confirmar", "Deseja deletar este movimento?");
    if (!confirmed) return;

    try {
      await deleteMovement(id);
      await loadAccounts();
      handleCloseModal();
    } catch (error) {
      Alert.alert("Erro", getErrorMessage(error, "Falha ao deletar movimento"));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("pt-BR");
  };

  const getNatureName = (id: string) => {
    return natures.find((n) => n.id === id)?.nome || "Desconhecida";
  };

  const getAccountName = (id: string) => {
    return accounts.find((a) => a.id === id)?.nome || "Desconhecida";
  };

  const renderMovementItem = ({
    item,
  }: {
    item: {
      id: string;
      descricao: string;
      naturezaId: string;
      contaId: string;
      data: string;
      tipo: "receita" | "despesa";
      valor: number;
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
          <View className="flex-row gap-2">
            <Pressable
              onPress={() => handleOpenModal(item)}
              className="px-3 py-2 rounded-lg bg-primary border border-primary"
            >
              <Text className="text-background text-xs font-semibold">Editar</Text>
            </Pressable>
            <Pressable
              onPress={() => void handleDelete(item.id)}
              className="px-3 py-2 rounded-lg bg-error"
            >
              <Text className="text-background text-xs font-semibold">Excluir</Text>
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
      <View className="flex-1 bg-background" style={{ position: "relative" }}>
        <CrudHeader title="Movimentos" onInclude={() => handleOpenModal()} />

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
            contentContainerStyle={{ paddingVertical: 12, paddingBottom: 88 }}
          />
        )}

        <CrudFab onPress={() => handleOpenModal()} accessibilityLabel="Incluir movimento" />

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
                  {editingId ? "Editar Movimento" : "Novo Movimento"}
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
                <CrudField
                  label="Data"
                  placeholder="YYYY-MM-DD"
                  value={formData.data}
                  onChangeText={(text) => setFormData({ ...formData, data: text })}
                  autoCapitalize="none"
                  returnKeyType="next"
                />

                <CrudField
                  label="Descrição"
                  placeholder="Ex: Compras no supermercado"
                  value={formData.descricao}
                  onChangeText={(text) => setFormData({ ...formData, descricao: text })}
                  autoCapitalize="sentences"
                  returnKeyType="next"
                />

                <CrudChoiceGroup
                  label="Tipo"
                  value={formData.tipo}
                  onChange={(tipo) => handleTipoChange(tipo as "receita" | "despesa")}
                  options={[
                    { value: "receita", label: "Receita" },
                    { value: "despesa", label: "Despesa" },
                  ]}
                />

                <CrudSelectList
                  label="Natureza"
                  value={formData.naturezaId}
                  onChange={(naturezaId) => setFormData({ ...formData, naturezaId })}
                  emptyText={`Nenhuma natureza de ${formData.tipo} cadastrada`}
                  options={filteredNatures.map((nature) => ({
                    id: nature.id,
                    label: `${nature.icone} ${nature.nome}`,
                  }))}
                />

                <CrudSelectList
                  label="Conta"
                  value={formData.contaId}
                  onChange={(contaId) => setFormData({ ...formData, contaId })}
                  emptyText="Nenhuma conta cadastrada"
                  options={accounts.map((account) => ({
                    id: account.id,
                    label: account.nome,
                  }))}
                />

                <CrudField
                  label="Valor"
                  placeholder="0,00"
                  value={formData.valor}
                  onChangeText={(text) => setFormData({ ...formData, valor: text })}
                  keyboardType="decimal-pad"
                  returnKeyType="done"
                />
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </ScreenContainer>
  );
}
