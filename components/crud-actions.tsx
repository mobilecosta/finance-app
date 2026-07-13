import { Pressable, Text, View, type ViewStyle } from "react-native";
import { useBootstrapStyles } from "@/lib/bootstrap-theme";

type CrudPrimaryActionsProps = {
  isEditing: boolean;
  saving?: boolean;
  onSave: () => void;
  onCancel: () => void;
  onSecondary: () => void;
};

/** Action buttons for create/edit modals — solid colors (Modal is outside NativeWind vars). */
export function CrudPrimaryActions({
  isEditing,
  saving = false,
  onSave,
  onCancel,
  onSecondary,
}: CrudPrimaryActionsProps) {
  const { c } = useBootstrapStyles();

  const primaryBtn: ViewStyle = {
    backgroundColor: c.PRIMARY,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  };

  const secondaryBtn: ViewStyle = {
    flex: 1,
    backgroundColor: c.WHITE,
    borderWidth: 1,
    borderColor: c.BORDER_COLOR,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  };

  const dangerBtn: ViewStyle = {
    ...secondaryBtn,
    backgroundColor: c.DANGER,
    borderColor: c.DANGER,
  };

  return (
    <View style={{ gap: 8 }}>
      <Pressable
        onPress={onSave}
        disabled={saving}
        style={[primaryBtn, saving ? { opacity: 0.7 } : null]}
        accessibilityRole="button"
        accessibilityLabel={isEditing ? "Alterar" : "Incluir"}
      >
        <Text style={{ color: c.WHITE, fontWeight: "700", fontSize: 14, textAlign: "center" }}>
          {saving ? "Salvando..." : isEditing ? "Alterar" : "Incluir"}
        </Text>
      </Pressable>

      <View style={{ flexDirection: "row", gap: 8 }}>
        <Pressable onPress={onCancel} style={secondaryBtn} accessibilityRole="button">
          <Text style={{ color: c.BODY_COLOR, fontWeight: "600", fontSize: 14, textAlign: "center" }}>
            Cancelar
          </Text>
        </Pressable>
        <Pressable
          onPress={onSecondary}
          style={isEditing ? dangerBtn : secondaryBtn}
          accessibilityRole="button"
        >
          <Text
            style={{
              color: isEditing ? c.WHITE : c.BODY_COLOR,
              fontWeight: "600",
              fontSize: 14,
              textAlign: "center",
            }}
          >
            {isEditing ? "Excluir" : "Limpar"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

type CrudHeaderProps = {
  title: string;
  includeLabel?: string;
  onInclude: () => void;
};

/** Screen header with always-visible Incluir button. */
export function CrudHeader({ title, includeLabel = "Incluir", onInclude }: CrudHeaderProps) {
  const { c } = useBootstrapStyles();

  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: c.BORDER_COLOR,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <Text style={{ fontSize: 22, fontWeight: "700", color: c.BODY_COLOR, flexShrink: 1 }}>
        {title}
      </Text>
      <Pressable
        onPress={onInclude}
        style={{
          backgroundColor: c.PRIMARY,
          borderRadius: 10,
          paddingVertical: 10,
          paddingHorizontal: 16,
          minHeight: 40,
          alignItems: "center",
          justifyContent: "center",
        }}
        accessibilityRole="button"
        accessibilityLabel={includeLabel}
      >
        <Text style={{ color: c.WHITE, fontWeight: "700", fontSize: 14 }}>{includeLabel}</Text>
      </Pressable>
    </View>
  );
}

type CrudFabProps = {
  onPress: () => void;
  accessibilityLabel?: string;
};

/** Floating + button with explicit positioning above the tab bar. */
export function CrudFab({ onPress, accessibilityLabel = "Incluir" }: CrudFabProps) {
  const { c } = useBootstrapStyles();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={{
        position: "absolute",
        right: 20,
        bottom: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: c.PRIMARY,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      }}
    >
      <Text style={{ color: c.WHITE, fontSize: 28, fontWeight: "600", lineHeight: 30 }}>+</Text>
    </Pressable>
  );
}
