import React from "react";
import { View, Text, type ViewProps } from "react-native";
import { useBootstrapStyles } from "@/lib/bootstrap-theme";

export interface BListGroupProps extends ViewProps {
  children: React.ReactNode;
  flush?: boolean;
}

export function BListGroup({ children, flush = false, style, ...props }: BListGroupProps) {
  const { s } = useBootstrapStyles();
  const listStyle: any[] = [s.listGroup];
  if (flush) listStyle.push(s.listGroupFlush);
  if (style) listStyle.push(style);

  return (
    <View style={listStyle} {...props}>
      {children}
    </View>
  );
}

export interface BListGroupItemProps extends ViewProps {
  children: React.ReactNode;
  first?: boolean;
  last?: boolean;
  active?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark";
}

export function BListGroupItem({
  children,
  first = false,
  last = false,
  active = false,
  disabled = false,
  variant,
  style,
  ...props
}: BListGroupItemProps) {
  const { s } = useBootstrapStyles();
  const itemStyle: any[] = [s.listGroupItem];

  if (first) itemStyle.push(s.listGroupItemFirstChild(first));
  if (last) itemStyle.push(s.listGroupItemLastChild(last, 0));
  if (active) itemStyle.push(s.listGroupItemActive);
  if (disabled) itemStyle.push(s.listGroupItemDisabled);

  if (variant) {
    itemStyle.push((s as any)[`listGroupItem${capitalize(variant)}`]);
  }

  if (style) itemStyle.push(style);

  return (
    <View style={itemStyle} {...props}>
      {typeof children === "string" ? (
        <Text style={[s.listGroupItemText, active ? s.listGroupItemActiveText : {}, disabled ? s.listGroupItemDisabledText : {}]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
