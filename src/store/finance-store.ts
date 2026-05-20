/**
 * LEGACY COMPATIBILITY LAYER
 *
 * Este archivo re-exporta el nuevo store de shared/store/finance
 * para mantener compatibilidad con código existente.
 *
 * Migración: Reemplaza imports de @/store/finance-store con @/shared/store/finance
 */

export { useFinanceStore, type FinanceState } from "@/shared/store/finance";

import { calculateDashboardMetrics as calcMetrics } from "@/shared/store/metrics";
import type {
    DashboardMetrics,
    DashboardSnapshot,
    Transaction,
} from "@/types/finance";

/**
 * Función de cálculo compatible.
 * Ahora recibe snapshot en lugar de múltiples parámetros.
 */
export function calculateDashboardMetrics(
  snapshotOrIncome: DashboardSnapshot | number,
  transactions?: Transaction[],
): DashboardMetrics {
  if (typeof snapshotOrIncome === "object" && snapshotOrIncome !== null) {
    // Caso: snapshot (nuevo formato)
    const snapshot = snapshotOrIncome as DashboardSnapshot;
    return calcMetrics(snapshot.monthlyIncome, snapshot.transactions);
  } else if (typeof snapshotOrIncome === "number" && transactions) {
    // Caso: (monthlyIncome, transactions)
    return calcMetrics(snapshotOrIncome, transactions);
  }

  return {
    totalIncome: 0,
    totalExpenses: 0,
    availableBalance: 0,
    usagePercent: 0,
    dailyAverageExpense: 0,
    dailyBudget: 0,
    daysRemaining: 0,
  };
}
