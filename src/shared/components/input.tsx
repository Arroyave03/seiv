import React from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";

import { Theme } from "@/shared/design/tokens";
import { Typography } from "@/shared/design/typography";

/**
 * INPUT COMPONENT
 *
 * Campo de entrada minimalista.
 * Usa border sutil y focus state limpio.
 */
export function Input({
  placeholder,
  placeholderTextColor,
  editable,
  ...props
}: TextInputProps) {
  return (
    <TextInput
      {...props}
      placeholder={placeholder}
      placeholderTextColor={
        placeholderTextColor || Theme.colors.light.text + "60"
      }
      editable={editable !== false}
      style={[styles.input, props.style]}
      allowFontScaling={false}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    ...Typography.titleLarge,
    backgroundColor: Theme.colors.light.surface,
    borderWidth: 1.5,
    borderColor: Theme.colors.light.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: Theme.colors.light.text,
    marginBottom: 12,
  },
});
