/**
 * CUSTOM HOOKS - FINANCIAL
 *
 * Hooks reutilizables para acceder a datos financieros.
 * Simplifican el acceso a datos y cálculos desde componentes.
 */

import type { FinancialSummary } from "@/shared/financial/logic";
import {
    calculateFinancialSummary,
    getDailyTotal,
    getTransactionsThisMonth,
    groupExpensesByCategory,
    groupTransactionsByDate,
} from "@/shared/financial/logic";
import { useFinanceStore } from "@/shared/store/finance";
import type { Transaction } from "@/types/finance";
import { useCallback, useMemo } from "react";

/**
 * useFinancialConfig
 * Accede a la configuración financiera del usuario
 */
export function useFinancialConfig() {
  const snapshot = useFinanceStore((state) => state.snapshot);

  return useMemo(
    () => ({
      monthlyIncome: snapshot.monthlyIncome,
      // Aquí iría monthlyTargetSavings cuando esté en snapshot
    }),
    [snapshot.monthlyIncome],
  );
}

/**
 * useSummary
 * Calcula el resumen financiero completo
 * Dependencia: se recalcula cuando cambian transacciones o config
 */
export function useSummary(): FinancialSummary {
  const snapshot = useFinanceStore((state) => state.snapshot);

  return useMemo(() => {
    const config = {
      monthlyIncome: snapshot.monthlyIncome,
      monthlyTargetSavings: 0, // TODO: agregar a snapshot
      fixedExpenses: [], // TODO: agregar a snapshot
    };

    return calculateFinancialSummary(config, snapshot.transactions);
  }, [snapshot]);
}

/**
 * useAvailableBalance
 * Solo el saldo disponible
 */
export function useAvailableBalance(): number {
  const summary = useSummary();
  return summary.availableBalance;
}

/**
 * useExpenses
 * Accede a los gastos del mes actual con helpers
 */
export function useExpenses() {
  const snapshot = useFinanceStore((state) => state.snapshot);
  const deleteTransaction = useFinanceStore((state) => state.deleteTransaction);
  const restoreTransaction = useFinanceStore(
    (state) => state.restoreTransaction,
  );
  const updateTransaction = useFinanceStore((state) => state.updateTransaction);

  const monthlyExpenses = useMemo(
    () => getTransactionsThisMonth(snapshot.transactions),
    [snapshot.transactions],
  );

  const expensesByCategory = useMemo(
    () => groupExpensesByCategory(monthlyExpenses),
    [monthlyExpenses],
  );

  const expensesByDate = useMemo(
    () => groupTransactionsByDate(monthlyExpenses),
    [monthlyExpenses],
  );

  const delete_ = useCallback(
    (id: string) => deleteTransaction(id),
    [deleteTransaction],
  );

  const update = useCallback(
    (id: string, updates: any) => updateTransaction(id, updates),
    [updateTransaction],
  );

  const restore = useCallback(
    (transaction: Transaction) => restoreTransaction(transaction),
    [restoreTransaction],
  );

  return {
    expenses: monthlyExpenses,
    byCategory: expensesByCategory,
    byDate: expensesByDate,
    delete: delete_,
    update,
    restore,
  };
}

/**
 * useDailyTotal
 * Total gastado en un día específico
 */
export function useDailyTotal(date: Date): number {
  const snapshot = useFinanceStore((state) => state.snapshot);

  return useMemo(
    () => getDailyTotal(snapshot.transactions, date),
    [snapshot.transactions, date],
  );
}

/**
 * useMonthlyStats
 * Estadísticas mensuales útiles
 */
export function useMonthlyStats() {
  const summary = useSummary();
  const expenses = useExpenses();

  return useMemo(
    () => ({
      totalIncome: summary.totalIncome,
      totalExpenses: summary.totalExpenses,
      totalFixed: summary.totalFixed,
      totalVariable: summary.totalVariable,
      availableBalance: summary.availableBalance,
      usagePercent: summary.usagePercent,
      savingsPercentage: summary.savingsPercentage,
      dailyBudget: summary.dailyBudget,
      dailyAverageExpense: summary.dailyAverageExpense,
      daysRemaining: summary.daysRemaining,
      topCategories: Object.entries(expenses.byCategory)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5),
    }),
    [summary, expenses.byCategory],
  );
}
