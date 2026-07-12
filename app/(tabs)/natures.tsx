import { ScrollView, Text, View, FlatList, Pressable, TextInput, Modal, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useState, useCallback } from "react";
import { useNatures } from "@/lib/contexts/NatureContext";
import { useFocusEffect } from "expo-router";

const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];
const EMOJIS = ["💰", "💼", "🍔", "🚗", "🏥", "🎓", "🎮", "📚", "✈️", "🏠"];

export default function NaturesScreen() {
  const { natures, loading, addNature, updateNature, deleteNature, loadNatures } =
    useNatures();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    tipo: "receita" as "receita" | "despesa",
    cor: "#10B981",
    icone: "💰",
  });

  useFocusEffect(
    useCallback(() => {
      loadNatures();
    }, [loadNatures])
  );

  const handleOpenModal = (nature?: any) => {
    if (nature) {
      setEditingId(nature.id);
      setFormData({
        nome: nature.nome,
        tipo: nature.tipo,
        cor: nature.cor,
        icone: nature.icone,
      });
    } else {
      setEditingId(null);
      setFormData({ nome: "", tipo: "receita", cor: "#10B981", icone: "💰" });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleResetForm = () => {
    setFormData({ nome: "", tipo: "receita", cor: "#10B981", icone: "💰" });
  };

  const handleSave = async () => {
    if (!formData.nome) {
      Alert.alert("Erro", "Preencha o nome da natureza");
      return;
    }

    try {
      if (editingId) {
        await updateNature(editingId, {
          nome: formData.nome,
          tipo: formData.tipo,
          cor: formData.cor,
          icone: formData.icone,
        });
      } else {
        await addNature({
          nome: formData.nome,
          tipo: formData.tipo,
          cor: formData.cor,
          icone: formData.icone,
        });
      }
      setShowModal(false);
      await loadNatures();
    } catch (error) {
      Alert.alert("Erro", "Falha ao salvar natureza");
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert("Confirmar", "Deseja deletar esta natureza?", [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Deletar",
            style: "destructive",
            onPress: async () => {
              try {
                await deleteNature(id);
                await loadNatures();
                handleCloseModal();
              } catch (error) {
                Alert.alert("Erro", "Falha ao deletar natureza");
              }
            },
          },
    ]);
  };

  const renderNatureItem = ({ item }: { item: any }) => (
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
        <View className="flex-1 flex-row items-center">
          <View
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: item.cor }}
          >
            <Text className="text-lg">{item.icone}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-lg font-semibold text-foreground">{item.nome}</Text>
            <Text className="text-sm text-muted mt-1">
              {item.tipo === "receita" ? "Receita" : "Despesa"}
            </Text>
          </View>
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
          <Text className="text-2xl font-bold text-foreground">Naturezas</Text>
        </View>

        {loading ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-muted">Carregando naturezas...</Text>
          </View>
        ) : natures.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-muted">Nenhuma natureza cadastrada</Text>
          </View>
        ) : (
          <FlatList
            data={natures}
            renderItem={renderNatureItem}
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
                {editingId ? "Editar Natureza" : "Nova Natureza"}
              </Text>

              <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                <Text className="text-sm text-muted mb-2">Nome</Text>
                <TextInput
                  className="border border-border rounded-lg px-4 py-3 mb-4 text-foreground"
                  placeholder="Ex: Alimentação"
                  value={formData.nome}
                  onChangeText={(text) => setFormData({ ...formData, nome: text })}
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

                <Text className="text-sm text-muted mb-2">Cor</Text>
                <View className="flex-row gap-2 mb-4 flex-wrap">
                  {COLORS.map((color) => (
                    <Pressable
                      key={color}
                      onPress={() => setFormData({ ...formData, cor: color })}
                      className={`w-12 h-12 rounded-full border-2 ${
                        formData.cor === color ? "border-foreground" : "border-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </View>

                <Text className="text-sm text-muted mb-2">Ícone</Text>
                <View className="flex-row gap-2 mb-6 flex-wrap">
                  {EMOJIS.map((emoji) => (
                    <Pressable
                      key={emoji}
                      onPress={() => setFormData({ ...formData, icone: emoji })}
                      className={`w-12 h-12 rounded-lg border-2 items-center justify-center ${
                        formData.icone === emoji
                          ? "border-primary bg-primary/10"
                          : "border-border bg-surface"
                      }`}
                    >
                      <Text className="text-2xl">{emoji}</Text>
                    </Pressable>
                  ))}
                </View>
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
