import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Colors, Fonts, Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type FloatingActionButtonProps = {
  onPress?: () => void;
  label: string;
};

export function FloatingActionButton({
  onPress,
  label,
}: FloatingActionButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: theme.accent },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.innerRow}>
        <View
          style={[
            styles.iconBubble,
            { backgroundColor: Colors.light.background },
          ]}
        >
          <ThemedText style={[styles.icon, { color: theme.accent }]}>
            +
          </ThemedText>
        </View>
        <ThemedText style={styles.label}>{label}</ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  innerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  iconBubble: {
    width: 28,
    height: 28,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 20,
    lineHeight: 22,
    fontFamily: Fonts.rounded,
    fontWeight: "700",
  },
  label: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
