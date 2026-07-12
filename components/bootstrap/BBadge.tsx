import React from "react";
import { View, Text } from "react-native";
import { useBootstrapStyles } from "@/lib/bootstrap-theme";

type Variant = "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark";

export interface BBadgeProps {
  children: React.ReactNode;
  variant?: Variant;
  pill?: boolean;
  style?: any;
}

export function BBadge({ children, variant = "secondary", pill = false, style }: BBadgeProps) {
  const { s, c } = useBootstrapStyles();
  const themeColor = c[variant.toUpperCase()] || c.SECONDARY;

  const badgeStyle: any[] = [s.badge];
  if (pill) badgeStyle.push(s.badgePill);
  badgeStyle.push({ backgroundColor: themeColor });
  if (style) badgeStyle.push(style);

  const textStyle: any[] = [s.badgeText, { color: c.WHITE }];

  return (
    <View style={badgeStyle}>
      <Text style={textStyle}>{children}</Text>
    </View>
  );
}
