import React from "react";
import { View, Text, type ViewProps } from "react-native";
import { useBootstrapStyles } from "@/lib/bootstrap-theme";

export interface BFormGroupProps extends ViewProps {
  label?: string;
  children: React.ReactNode;
  error?: string;
}

export function BFormGroup({ label, children, error, style, ...props }: BFormGroupProps) {
  const { s } = useBootstrapStyles();
  return (
    <View style={[s.formGroup, style]} {...props}>
      {label ? <Text style={[s.formLabelText]}>{label}</Text> : null}
      {children}
      {error ? <Text style={[s.text, s.textDanger]}>{error}</Text> : null}
    </View>
  );
}
