import { useEffect, useMemo } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { ExpenseItem } from "@/components/ui/expense-item";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { MoneyDisplay } from "@/components/ui/money-display";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SectionTitle } from "@/components/ui/section-title";
import {
    BottomTabInset,
    MaxContentWidth,
    Radius,
    Spacing,
} from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import {
    calculateDashboardMetrics,
    useFinanceStore,
} from "@/store/finance-store";
import { formatMoney } from "@/utils/money";

export function DashboardScreen() {
  const theme = useTheme();
  const hydrate = useFinanceStore((state) => state.hydrate);
  const snapshot = useFinanceStore((state) => state.snapshot);
  const metrics = useMemo(
    () => calculateDashboardMetrics(snapshot),
    [snapshot],
  );

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.headerCopy}>
              <ThemedText
                themeColor="textSecondary"
                type="smallBold"
                style={styles.kicker}
              >
                Buen día, Samuel
              </ThemedText>
              <ThemedText type="title" style={styles.title}>
                Tu dinero, claro en 1 vistazo.
              </ThemedText>
            </View>
            <View style={[styles.pill, { backgroundColor: theme.accentSoft }]}>
              <ThemedText style={[styles.pillText, { color: theme.accent }]}>
                Abril 2026
              </ThemedText>
            </View>
          </View>

          <MoneyDisplay
            amount={metrics.availableBalance}
            label="Dinero disponible real"
            emphasized
          />

          <View style={styles.grid}>
            <Card
              style={[
                styles.metricCard,
                {
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.border,
                },
              ]}
            >
              <ThemedText themeColor="textSecondary" type="small">
                Ingreso mensual
              </ThemedText>
              <ThemedText style={styles.metricValue}>
                {formatMoney(snapshot.monthlyIncome)}
              </ThemedText>
            </Card>
            <Card
              style={[
                styles.metricCard,
                {
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.border,
                },
              ]}
            >
              <ThemedText themeColor="textSecondary" type="small">
                Gastos fijos
              </ThemedText>
              <ThemedText style={styles.metricValue}>
                {formatMoney(metrics.fixedExpenseTotal)}
              </ThemedText>
            </Card>
            <Card
              style={[
                styles.metricCard,
                {
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.border,
                },
              ]}
            >
              <ThemedText themeColor="textSecondary" type="small">
                Ahorro planificado
              </ThemedText>
              <ThemedText style={styles.metricValue}>
                {formatMoney(snapshot.savingsGoal.targetAmount)}
              </ThemedText>
            </Card>
            <Card
              style={[
                styles.metricCard,
                {
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.border,
                },
              ]}
            >
              <ThemedText themeColor="textSecondary" type="small">
                Ahorro acumulado
              </ThemedText>
              <ThemedText style={styles.metricValue}>
                {formatMoney(snapshot.savingsGoal.savedAmount)}
              </ThemedText>
            </Card>
          </View>

          <Card
            style={[
              styles.sectionCard,
              {
                backgroundColor: theme.backgroundElement,
                borderColor: theme.border,
              },
            ]}
          >
            <SectionTitle
              title="Progreso mensual"
              caption="Gastos fijos + ahorro + variable"
            />
            <View style={styles.progressBlock}>
              <ProgressBar
                value={metrics.monthlyUsagePercent}
                label="Uso del presupuesto"
              />
              <View style={styles.progressMeta}>
                <ThemedText themeColor="textSecondary" type="small">
                  Te quedan {formatMoney(metrics.availableBalance)} para cerrar
                  el mes con margen.
                </ThemedText>
                <ThemedText type="smallBold" style={{ color: theme.success }}>
                  {Math.round((1 - metrics.monthlyUsagePercent) * 100)}% libre
                </ThemedText>
              </View>
            </View>
          </Card>

          <Card
            style={[
              styles.sectionCard,
              {
                backgroundColor: theme.backgroundElement,
                borderColor: theme.border,
              },
            ]}
          >
            <SectionTitle
              title="Gastos fijos"
              caption="Lo que debes cubrir sí o sí cada mes"
            />
            <View style={styles.stack}>
              {snapshot.fixedExpenses.map((item) => (
                <ExpenseItem
                  key={item.id}
                  item={{
                    id: item.id,
                    title: item.title,
                    amount: item.amount,
                    kind: "expense",
                    category: "fixed",
                    dateLabel: item.dueLabel,
                  }}
                />
              ))}
            </View>
          </Card>

          <Card
            style={[
              styles.sectionCard,
              {
                backgroundColor: theme.backgroundElement,
                borderColor: theme.border,
              },
            ]}
          >
            <SectionTitle
              title="Movimientos recientes"
              caption="Entrada y gasto reciente, sin ruido"
            />
            <View style={styles.stack}>
              {snapshot.recentTransactions.map((item) => (
                <ExpenseItem key={item.id} item={item} />
              ))}
            </View>
          </Card>
        </ScrollView>

        <View style={styles.fabContainer}>
          <FloatingActionButton
            label="Registrar movimiento"
            onPress={() => {
              Alert.alert(
                "Próximo paso",
                "Aquí podrás registrar ingresos y gastos rápidamente.",
              );
            }}
          />
        </View>
      </SafeAreaView>
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
    width: "100%",
    maxWidth: MaxContentWidth,
    alignSelf: "center",
    gap: Spacing.four,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: BottomTabInset + Spacing.five,
  },
  header: {
    gap: Spacing.three,
  },
  headerCopy: {
    gap: Spacing.two,
  },
  kicker: {
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 38,
    lineHeight: 42,
    maxWidth: 320,
  },
  pill: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Radius.pill,
  },
  pillText: {
    fontSize: 13,
    fontWeight: "700",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.three,
  },
  metricCard: {
    width: "48%",
    gap: Spacing.one,
    borderRadius: Radius.large,
    borderWidth: StyleSheet.hairlineWidth,
  },
  metricValue: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "700",
  },
  sectionCard: {
    gap: Spacing.three,
    borderRadius: Radius.large,
    borderWidth: StyleSheet.hairlineWidth,
  },
  progressBlock: {
    gap: Spacing.three,
  },
  progressMeta: {
    gap: Spacing.one,
  },
  stack: {
    gap: Spacing.two,
  },
  fabContainer: {
    position: "absolute",
    right: Spacing.three,
    bottom: Spacing.five,
  },
});
