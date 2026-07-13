import { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from "react-native";
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

type CrudFieldProps = Omit<TextInputProps, "style"> & {
  label: string;
  hint?: string;
  containerStyle?: ViewStyle;
};

/**
 * Text field with clear focus/editing highlight (border, label, background).
 * Uses solid colors so it works inside RN Modal outside NativeWind vars.
 */
export function CrudField({
  label,
  hint,
  containerStyle,
  onFocus,
  onBlur,
  value,
  ...inputProps
}: CrudFieldProps) {
  const { c } = useBootstrapStyles();
  const [focused, setFocused] = useState(false);
  const hasValue = value != null && String(value).length > 0;

  return (
    <View style={[{ marginBottom: 16 }, containerStyle]}>
      <Text
        style={{
          fontSize: 13,
          fontWeight: focused ? "700" : "600",
          color: focused ? c.PRIMARY : c.SECONDARY,
          marginBottom: 6,
        }}
      >
        {label}
        {focused ? " · editando" : ""}
      </Text>
      <TextInput
        {...inputProps}
        value={value}
        placeholderTextColor={c.SECONDARY}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={{
          borderWidth: focused ? 2 : 1,
          borderColor: focused ? c.PRIMARY : hasValue ? "#94A3B8" : c.BORDER_COLOR,
          backgroundColor: focused ? "#F0F9FF" : c.WHITE,
          borderRadius: 10,
          paddingHorizontal: 14,
          paddingVertical: 12,
          minHeight: 48,
          fontSize: 16,
          fontWeight: focused || hasValue ? "600" : "400",
          color: c.BODY_COLOR,
        }}
      />
      {hint ? (
        <Text style={{ marginTop: 6, fontSize: 12, color: c.SECONDARY, lineHeight: 16 }}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

type CrudChoiceOption = {
  value: string;
  label: string;
};

type CrudChoiceGroupProps = {
  label: string;
  options: CrudChoiceOption[];
  value: string;
  onChange: (value: string) => void;
};

/** Chip/option group with strong selected state. */
export function CrudChoiceGroup({ label, options, value, onChange }: CrudChoiceGroupProps) {
  const { c } = useBootstrapStyles();

  return (
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          fontSize: 13,
          fontWeight: "600",
          color: c.SECONDARY,
          marginBottom: 6,
        }}
      >
        {label}
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              style={{
                flexGrow: 1,
                flexBasis: options.length <= 3 ? "30%" : "22%",
                minHeight: 42,
                paddingVertical: 10,
                paddingHorizontal: 10,
                borderRadius: 10,
                borderWidth: selected ? 2 : 1,
                borderColor: selected ? c.PRIMARY : c.BORDER_COLOR,
                backgroundColor: selected ? c.PRIMARY : c.WHITE,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: selected ? "700" : "600",
                  color: selected ? c.WHITE : c.BODY_COLOR,
                  textAlign: "center",
                  textTransform: "capitalize",
                }}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

type CrudSelectOption = {
  id: string;
  label: string;
};

type CrudSelectListProps = {
  label: string;
  options: CrudSelectOption[];
  value: string;
  onChange: (id: string) => void;
  emptyText?: string;
  maxHeight?: number;
};

/** Scrollable select list with highlighted selected row. */
export function CrudSelectList({
  label,
  options,
  value,
  onChange,
  emptyText = "Nenhuma opção disponível",
  maxHeight = 140,
}: CrudSelectListProps) {
  const { c } = useBootstrapStyles();
  const hasSelection = Boolean(value);

  return (
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          fontSize: 13,
          fontWeight: hasSelection ? "700" : "600",
          color: hasSelection ? c.PRIMARY : c.SECONDARY,
          marginBottom: 6,
        }}
      >
        {label}
        {hasSelection ? " · selecionado" : ""}
      </Text>
      <View
        style={{
          borderWidth: hasSelection ? 2 : 1,
          borderColor: hasSelection ? c.PRIMARY : c.BORDER_COLOR,
          borderRadius: 10,
          maxHeight,
          overflow: "hidden",
          backgroundColor: hasSelection ? "#F0F9FF" : c.WHITE,
        }}
      >
        {options.length === 0 ? (
          <Text style={{ padding: 14, fontSize: 13, color: c.SECONDARY }}>{emptyText}</Text>
        ) : (
          <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
            {options.map((option, index) => {
              const selected = option.id === value;
              return (
                <Pressable
                  key={option.id}
                  onPress={() => onChange(option.id)}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    borderBottomWidth: index < options.length - 1 ? 1 : 0,
                    borderBottomColor: c.BORDER_COLOR,
                    backgroundColor: selected ? c.PRIMARY : "transparent",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: selected ? "700" : "500",
                      color: selected ? c.WHITE : c.BODY_COLOR,
                    }}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

type CrudSwatchProps = {
  label: string;
  colors: string[];
  value: string;
  onChange: (color: string) => void;
};

export function CrudColorSwatches({ label, colors, value, onChange }: CrudSwatchProps) {
  const { c } = useBootstrapStyles();

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 13, fontWeight: "600", color: c.SECONDARY, marginBottom: 6 }}>
        {label}
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        {colors.map((color) => {
          const selected = color === value;
          return (
            <Pressable
              key={color}
              onPress={() => onChange(color)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: color,
                borderWidth: selected ? 3 : 2,
                borderColor: selected ? c.BODY_COLOR : "transparent",
                transform: selected ? [{ scale: 1.08 }] : [{ scale: 1 }],
              }}
            />
          );
        })}
      </View>
    </View>
  );
}

type CrudEmojiPickerProps = {
  label: string;
  emojis: string[];
  value: string;
  onChange: (emoji: string) => void;
};

export function CrudEmojiPicker({ label, emojis, value, onChange }: CrudEmojiPickerProps) {
  const { c } = useBootstrapStyles();

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 13, fontWeight: "600", color: c.SECONDARY, marginBottom: 6 }}>
        {label}
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {emojis.map((emoji) => {
          const selected = emoji === value;
          return (
            <Pressable
              key={emoji}
              onPress={() => onChange(emoji)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              style={{
                width: 48,
                height: 48,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: selected ? 2 : 1,
                borderColor: selected ? c.PRIMARY : c.BORDER_COLOR,
                backgroundColor: selected ? "#F0F9FF" : c.WHITE,
              }}
            >
              <Text style={{ fontSize: 22 }}>{emoji}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
