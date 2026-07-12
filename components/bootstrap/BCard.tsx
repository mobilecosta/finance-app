import React from "react";
import { View, type ViewProps } from "react-native";
import { useBootstrapStyles } from "@/lib/bootstrap-theme";

export interface BCardProps extends ViewProps {
  children?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: "default" | "primary" | "success" | "danger" | "warning" | "info";
}

export function BCard({ children, header, footer, style, variant = "default", ...props }: BCardProps) {
  const { s, c } = useBootstrapStyles();
  const cardStyle: any[] = [s.card];

  if (variant !== "default") {
    const themeColor = c[variant.toUpperCase()] || c.PRIMARY;
    cardStyle.push({ borderColor: themeColor, borderWidth: 1 });
  }

  if (style) cardStyle.push(style);

  return (
    <View style={cardStyle} {...props}>
      {header ? <View style={s.cardHeader}>{header}</View> : null}
      <View style={s.cardBody}>{children}</View>
      {footer ? <View style={s.cardFooter}>{footer}</View> : null}
    </View>
  );
}

export interface BCardTitleProps {
  children: React.ReactNode;
}

export function BCardTitle({ children }: BCardTitleProps) {
  const { s } = useBootstrapStyles();
  return (
    <View style={s.cardTitle}>
      <Text style={[s.h5]}>{children}</Text>
    </View>
  );
}

import { Text } from "react-native";

export interface BCardTextProps {
  children: React.ReactNode;
  muted?: boolean;
}

export function BCardText({ children, muted = false }: BCardTextProps) {
  const { s } = useBootstrapStyles();
  return <Text style={[s.text, muted ? s.textMuted : {}]}>{children}</Text>;
}
