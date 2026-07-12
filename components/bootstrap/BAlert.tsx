import React from "react";
import { View, Text, type ViewProps } from "react-native";
import { useBootstrapStyles } from "@/lib/bootstrap-theme";

type Variant = "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark";

export interface BAlertProps extends ViewProps {
  children: React.ReactNode;
  variant?: Variant;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export function BAlert({
  children,
  variant = "primary",
  dismissible = false,
  onDismiss,
  style,
  ...props
}: BAlertProps) {
  const { s } = useBootstrapStyles();
  const alertStyle: any[] = [s.alert, (s as any)[`alert${capitalize(variant)}`]];
  if (dismissible) alertStyle.push(s.alertDismissible);
  if (style) alertStyle.push(style);

  return (
    <View style={alertStyle} {...props}>
      <Text style={[(s as any)[`alert${capitalize(variant)}Text`], s.alertText]}>{children}</Text>
    </View>
  );
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
