import React from "react";
import {
    ModalProps,
    Platform,
    Modal as RNModal,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Shadows } from "@/shared/design/shadows";

interface Props extends Pick<ModalProps, "visible"> {
  onClose: () => void;
  children?: React.ReactNode;
}

export function Modal({ visible, onClose, children }: Props) {
  const theme = useTheme();

  return (
    <RNModal
      transparent
      visible={visible}
      animationType={Platform.OS === "ios" ? "slide" : "fade"}
      onRequestClose={onClose}
    >
      <View style={[styles.backdrop, { backgroundColor: theme.backdrop }]}>
        <TouchableOpacity
          style={styles.fill}
          activeOpacity={1}
          onPress={onClose}
        />

        <View
          style={[
            styles.container,
            { backgroundColor: theme.backgroundElement },
            Shadows.md,
          ]}
        >
          {children}
        </View>

        <TouchableOpacity
          style={styles.fill}
          activeOpacity={1}
          onPress={onClose}
        />
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.four,
  },
  fill: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  container: {
    width: "100%",
    maxWidth: 720,
    borderRadius: 16,
    padding: Spacing.four,
    zIndex: 10,
  },
});

export default Modal;
