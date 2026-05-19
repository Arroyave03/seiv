import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Colors, Fonts, Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { Transaction } from "@/types/finance";
import { formatMoney } from "@/utils/money";

type ExpenseItemProps = {
  item: Transaction;
};

export function ExpenseItem({ item }: ExpenseItemProps) {
  const theme = useTheme();
  const amountColor = item.kind === "income" ? theme.success : theme.text;

  return (
    <View
      style={[
        styles.container,
        { borderColor: theme.border, backgroundColor: theme.backgroundElement },
      ]}
    >
      <View
        style={[
          styles.indicator,
          {
            backgroundColor:
              item.kind === "income" ? theme.success : Colors.light.accent,
          },
        ]}
      />
      <View style={styles.content}>
        <View style={styles.headingRow}>
          <ThemedText type="smallBold" style={styles.title}>
            {item.title}
          </ThemedText>
          <ThemedText style={[styles.amount, { color: amountColor }]}>
            {formatMoney(item.amount)}
          </ThemedText>
        </View>
        <ThemedText themeColor="textSecondary" type="small" style={styles.meta}>
          {item.dateLabel}
          {"\n"}
          {item.category === "fixed"
            ? "Gasto fijo"
            : item.kind === "income"
              ? "Ingreso"
              : "Gasto diario"}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: Spacing.three,
    borderRadius: Radius.medium,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.three,
    alignItems: "flex-start",
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 999,
    marginTop: 5,
  },
  content: {
    flex: 1,
    gap: Spacing.one,
  },
  headingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  title: {
    flex: 1,
  },
  amount: {
    fontFamily: Fonts.rounded,
    fontSize: 15,
    fontWeight: "700",
  },
  meta: {
    lineHeight: 18,
  },
});
