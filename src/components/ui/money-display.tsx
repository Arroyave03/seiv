import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Colors, Fonts, Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { formatMoney } from "@/utils/money";

type MoneyDisplayProps = {
  amount: number;
  label: string;
  emphasized?: boolean;
};

export function MoneyDisplay({
  amount,
  label,
  emphasized = false,
}: MoneyDisplayProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: emphasized
            ? theme.accentSoft
            : theme.backgroundElement,
          borderColor: theme.border,
        },
      ]}
    >
      <ThemedText themeColor="textSecondary" type="small" style={styles.label}>
        {label}
      </ThemedText>
      <ThemedText style={[styles.amount, { color: theme.text }]}>
        {formatMoney(amount)}
      </ThemedText>
      {emphasized ? (
        <View style={[styles.glow, { backgroundColor: Colors.light.accent }]} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.large,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  label: {
    fontSize: 13,
    marginBottom: Spacing.one,
  },
  amount: {
    fontFamily: Fonts.rounded,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "700",
  },
  glow: {
    position: "absolute",
    right: -18,
    top: -18,
    width: 72,
    height: 72,
    borderRadius: 999,
    opacity: 0.06,
  },
});
