import React from "react";
import { View, type ViewProps } from "react-native";
import { useBootstrapStyles } from "@/lib/bootstrap-theme";

export interface BContainerProps extends ViewProps {
  children: React.ReactNode;
  fluid?: boolean;
}

export function BContainer({ children, fluid = false, style, ...props }: BContainerProps) {
  const { s } = useBootstrapStyles();
  const styleArray: any[] = [fluid ? s.containerFluid : s.containerMd];
  if (style) styleArray.push(style);
  return (
    <View style={styleArray} {...props}>
      {children}
    </View>
  );
}

export interface BRowProps extends ViewProps {
  children: React.ReactNode;
  noGutters?: boolean;
}

export function BRow({ children, noGutters = false, style, ...props }: BRowProps) {
  const { s } = useBootstrapStyles();
  const styleArray: any[] = [s.row];
  if (noGutters) styleArray.push(s.noGutters);
  if (style) styleArray.push(style);
  return (
    <View style={styleArray} {...props}>
      {children}
    </View>
  );
}

export interface BColProps extends ViewProps {
  children: React.ReactNode;
  size?: number;
}

export function BCol({ children, size, style, ...props }: BColProps) {
  const { s } = useBootstrapStyles();
  const styleArray: any[] = size ? [(s as any)[`col${size}`]] : [s.col];
  if (style) styleArray.push(style);
  return (
    <View style={styleArray} {...props}>
      {children}
    </View>
  );
}
