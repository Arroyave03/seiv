import { type ReactNode } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";

import { Radius, Spacing } from "@/constants/theme";

type CardProps = {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
};

export function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.large,
    padding: Spacing.four,
  },
});
