import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, type TouchableOpacityProps } from "react-native";
import { getBootstrapColor, useBootstrapStyles } from "@/lib/bootstrap-theme";

type Variant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "light"
  | "dark"
  | "outline-primary"
  | "outline-secondary"
  | "outline-success"
  | "outline-danger"
  | "outline-warning"
  | "outline-info"
  | "link";

type Size = "sm" | "md" | "lg";

export interface BButtonProps extends TouchableOpacityProps {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  loading?: boolean;
  title?: string;
  children?: React.ReactNode;
}

export function BButton({
  variant = "primary",
  size = "md",
  block = false,
  loading = false,
  title,
  children,
  style,
  disabled,
  ...props
}: BButtonProps) {
  const { s, c } = useBootstrapStyles();

  const isOutline = variant.startsWith("outline-");
  const isLink = variant === "link";
  const baseColor = isOutline ? variant.replace("outline-", "") : variant;
  const themeColor = getBootstrapColor(baseColor, c.PRIMARY);

  const buttonStyle: any[] = [s.btn];
  const textStyle: any[] = [s.btnText];

  if (isLink) {
    buttonStyle.push({ backgroundColor: "transparent", borderColor: "transparent" });
    textStyle.push({ color: c.PRIMARY });
  } else if (!isOutline) {
    buttonStyle.push({ backgroundColor: themeColor, borderColor: themeColor });
    textStyle.push({ color: c.WHITE });
  } else {
    buttonStyle.push({ backgroundColor: "transparent", borderColor: themeColor });
    textStyle.push({ color: themeColor });
  }

  if (size === "sm") {
    buttonStyle.push(s.btnSm);
    textStyle.push(s.btnSmText);
  } else if (size === "lg") {
    buttonStyle.push(s.btnLg);
    textStyle.push(s.btnLgText);
  }

  if (block) {
    buttonStyle.push(s.btnBlock);
  }

  if (disabled || loading) {
    buttonStyle.push(s.btnDisabled);
  }

  if (style) {
    buttonStyle.push(style);
  }

  const content = loading ? (
    <ActivityIndicator color={isOutline ? themeColor : c.WHITE} />
  ) : (
    <Text style={textStyle}>{title ?? children}</Text>
  );

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={buttonStyle}
      disabled={disabled || loading}
      {...props}
    >
      {content}
    </TouchableOpacity>
  );
}
