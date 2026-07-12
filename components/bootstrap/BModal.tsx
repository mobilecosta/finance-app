import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  type ModalProps,
} from "react-native";
import { useBootstrapStyles } from "@/lib/bootstrap-theme";

export interface BModalProps extends Omit<ModalProps, "children"> {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export function BModal({
  visible,
  onClose,
  title,
  children,
  footer,
  animationType = "slide",
  transparent = true,
  ...props
}: BModalProps) {
  const { s } = useBootstrapStyles();

  return (
    <Modal
      visible={visible}
      animationType={animationType}
      transparent={transparent}
      onRequestClose={onClose}
      {...props}
    >
      <View style={[s.modal, { justifyContent: "flex-end" }]}>
        <View style={[s.modalDialog]}>
          <View style={[s.modalContent]}>
            {title ? (
              <View style={[s.modalHeader]}>
                <Text style={[s.modalTitle, s.h5]}>{title}</Text>
                <TouchableOpacity onPress={onClose} style={[s.modalHeaderClose]}>
                  <Text style={{ fontSize: 20, fontWeight: "bold" }}>×</Text>
                </TouchableOpacity>
              </View>
            ) : null}
            <ScrollView style={[s.modalBody]}>{children}</ScrollView>
            {footer ? <View style={[s.modalFooter]}>{footer}</View> : null}
          </View>
        </View>
      </View>
    </Modal>
  );
}
