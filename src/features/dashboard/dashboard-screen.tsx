/**
 * DASHBOARD SCREEN
 *
 * Pantalla principal de "Seiv".
 * Muestra:
 * - Dinero disponible (dato principal)
 * - Métricas clave
 * - Transacciones recientes
 * - FAB para agregar gastos
 */

import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { Spacing } from "@/constants/theme";
import { ExpenseModal } from "@/features/expenses/expense-modal";
import { useTheme } from "@/hooks/use-theme";
import { getCategoryEmoji, getCategoryName } from "@/shared/design/categories";
import { Shadows } from "@/shared/design/shadows";
import { Typography } from "@/shared/design/typography";
import { useExpenses, useSummary } from "@/shared/hooks/financial";
import { useFinanceStore } from "@/shared/store/finance";
import { formatMoney } from "@/utils/money";

export function DashboardScreen() {
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const theme = useTheme();
  const navigation = useNavigation();
  const hydrate = useFinanceStore((state) => state.hydrate);
  const monthlyIncome = useFinanceStore((state) => state.monthlyIncome);

  // Hooks financieros
  const summary = useSummary();
  const { expenses } = useExpenses();

  const recentTransactions = useMemo(
    () => [...expenses].reverse().slice(0, 6),
    [expenses],
  );

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  const currentMonth = new Date().toLocaleDateString("es-CO", {
    month: "long",
    year: "numeric",
  });

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <ThemedText
              style={[styles.greeting, { color: theme.textSecondary }]}
            >
              Buen día
            </ThemedText>
            <ThemedText
              style={[styles.monthLabel, { color: theme.textSecondary }]}
            >
              {currentMonth}
            </ThemedText>
          </View>

          {/* Main Balance Card */}
          <View
            style={[
              styles.balanceCard,
              { backgroundColor: theme.backgroundElement },
              Shadows.md,
            ]}
          >
            <ThemedText
              style={[styles.balanceLabel, { color: theme.textSecondary }]}
            >
              Dinero disponible
            </ThemedText>
            <ThemedText style={[styles.balanceAmount, { color: theme.accent }]}>
              {formatMoney(summary.availableBalance)}
            </ThemedText>
            <ThemedText
              style={[styles.balanceCaption, { color: theme.textSecondary }]}
            >
              {summary.daysRemaining} días en el mes
            </ThemedText>
          </View>

          {/* Quick Metrics Grid */}
          <View style={styles.metricsGrid}>
            <View
              style={[
                styles.metricSmall,
                { backgroundColor: theme.backgroundElement },
                Shadows.xs,
              ]}
            >
              <ThemedText
                style={[
                  styles.metricSmallLabel,
                  { color: theme.textSecondary },
                ]}
              >
                Ingreso
              </ThemedText>
              <ThemedText
                style={[styles.metricSmallValue, { color: theme.text }]}
              >
                {formatMoney(monthlyIncome)}
              </ThemedText>
            </View>

            <View
              style={[
                styles.metricSmall,
                { backgroundColor: theme.backgroundElement },
                Shadows.xs,
              ]}
            >
              <ThemedText
                style={[
                  styles.metricSmallLabel,
                  { color: theme.textSecondary },
                ]}
              >
                Gastado
              </ThemedText>
              <ThemedText
                style={[styles.metricSmallValue, { color: theme.danger }]}
              >
                {formatMoney(summary.totalExpenses)}
              </ThemedText>
            </View>

            <View
              style={[
                styles.metricSmall,
                { backgroundColor: theme.backgroundElement },
                Shadows.xs,
              ]}
            >
              <ThemedText
                style={[
                  styles.metricSmallLabel,
                  { color: theme.textSecondary },
                ]}
              >
                Diario
              </ThemedText>
              <ThemedText
                style={[styles.metricSmallValue, { color: theme.text }]}
              >
                {formatMoney(summary.dailyBudget)}
              </ThemedText>
            </View>

            <View
              style={[
                styles.metricSmall,
                { backgroundColor: theme.backgroundElement },
                Shadows.xs,
              ]}
            >
              <ThemedText
                style={[
                  styles.metricSmallLabel,
                  { color: theme.textSecondary },
                ]}
              >
                Uso
              </ThemedText>
              <ThemedText
                style={[
                  styles.metricSmallValue,
                  {
                    color:
                      summary.usagePercent > 0.8
                        ? theme.warning
                        : theme.success,
                  },
                ]}
              >
                {Math.round(summary.usagePercent * 100)}%
              </ThemedText>
            </View>
          </View>

          {/* Recent Transactions */}
          {recentTransactions.length > 0 && (
            <View>
              <View style={styles.sectionHeader}>
                <ThemedText
                  style={[styles.sectionTitle, { color: theme.text }]}
                >
                  Movimientos recientes
                </ThemedText>
                <TouchableOpacity
                  onPress={() => navigation.navigate("explore" as never)}
                >
                  <ThemedText
                    style={[styles.sectionLink, { color: theme.accent }]}
                  >
                    Ver todo →
                  </ThemedText>
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.transactionsList,
                  { backgroundColor: theme.backgroundElement },
                  Shadows.xs,
                ]}
              >
                {recentTransactions.map((expense, index) => (
                  <View
                    key={expense.id}
                    style={[
                      styles.transactionItem,
                      index < recentTransactions.length - 1 &&
                        styles.transactionItemBorder,
                      { borderColor: theme.border },
                    ]}
                  >
                    <View style={styles.transactionLeft}>
                      <ThemedText style={styles.transactionEmoji}>
                        {getCategoryEmoji(expense.categoryId)}
                      </ThemedText>
                      <View style={styles.transactionInfo}>
                        <ThemedText
                          style={[
                            styles.transactionTitle,
                            { color: theme.text },
                          ]}
                          numberOfLines={1}
                        >
                          {expense.title}
                        </ThemedText>
                        <ThemedText
                          style={[
                            styles.transactionCategory,
                            { color: theme.textSecondary },
                          ]}
                        >
                          {getCategoryName(expense.categoryId)}
                        </ThemedText>
                      </View>
                    </View>

                    <ThemedText
                      style={[
                        styles.transactionAmount,
                        { color: theme.danger },
                      ]}
                    >
                      -{formatMoney(expense.amount)}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Empty State */}
          {expenses.length === 0 && (
            <View style={styles.emptyState}>
              <ThemedText
                style={[styles.emptyText, { color: theme.textSecondary }]}
              >
                No hay movimientos aún
              </ThemedText>
              <ThemedText
                style={[styles.emptySubtext, { color: theme.textSecondary }]}
              >
                Agrega tu primer gasto con el botón "Nuevo gasto"
              </ThemedText>
            </View>
          )}
        </ScrollView>

        {/* FAB para agregar gasto */}
        <FloatingActionButton
          onPress={() => setShowExpenseModal(true)}
          label="Nuevo gasto"
        />
      </SafeAreaView>

      {/* Modal para agregar/editar gastos */}
      <ExpenseModal
        visible={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    gap: Spacing.five,
  },
  header: {
    gap: Spacing.one,
  },
  greeting: {
    ...Typography.bodyLarge,
  },
  monthLabel: {
    ...Typography.labelSmall,
  },
  balanceCard: {
    borderRadius: 16,
    paddingVertical: Spacing.six,
    paddingHorizontal: Spacing.four,
    gap: Spacing.one,
  },
  balanceLabel: {
    ...Typography.labelSmall,
  },
  balanceAmount: {
    ...Typography.displayMedium,
  },
  balanceCaption: {
    ...Typography.labelSmall,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.three,
  },
  metricSmall: {
    flex: 1,
    minWidth: "45%",
    borderRadius: 12,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
    gap: Spacing.one,
  },
  metricSmallLabel: {
    ...Typography.labelSmall,
  },
  metricSmallValue: {
    ...Typography.labelLarge,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.two,
  },
  sectionTitle: {
    ...Typography.titleSmall,
  },
  sectionLink: {
    ...Typography.labelSmall,
  },
  transactionsList: {
    borderRadius: 12,
    overflow: "hidden",
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
  },
  transactionItemBorder: {
    borderBottomWidth: 1,
  },
  transactionLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  transactionEmoji: {
    fontSize: 20,
  },
  transactionInfo: {
    flex: 1,
    gap: 1,
  },
  transactionTitle: {
    ...Typography.bodySmall,
  },
  transactionCategory: {
    ...Typography.labelSmall,
  },
  transactionAmount: {
    ...Typography.labelSmall,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 96,
    gap: Spacing.one,
  },
  emptyText: {
    ...Typography.bodyLarge,
  },
  emptySubtext: {
    ...Typography.labelSmall,
  },
});
