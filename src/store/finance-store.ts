import { create } from "zustand";

import {
    loadDashboardSnapshot,
    saveDashboardSnapshot,
} from "@/database/finance-db";
import { mockDashboardSnapshot } from "@/features/dashboard/mock-dashboard";
import type {
    DashboardMetrics,
    DashboardSnapshot,
    Transaction,
} from "@/types/finance";
import { clamp } from "@/utils/money";

type FinanceState = {
  snapshot: DashboardSnapshot;
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  addTransaction: (transaction: Transaction) => Promise<void>;
};

export function calculateDashboardMetrics(
  snapshot: DashboardSnapshot,
): DashboardMetrics {
  const fixedExpenseTotal = snapshot.fixedExpenses.reduce(
    (total, item) => total + item.amount,
    0,
  );
  const variableExpenseTotal = snapshot.recentTransactions
    .filter((item) => item.kind === "expense")
    .reduce((total, item) => total + item.amount, 0);
  const savingsProgress =
    snapshot.savingsGoal.savedAmount / snapshot.savingsGoal.targetAmount;
  const availableBalance =
    snapshot.monthlyIncome -
    fixedExpenseTotal -
    snapshot.savingsGoal.savedAmount -
    variableExpenseTotal;
  const monthlyUsagePercent = clamp(
    (fixedExpenseTotal +
      snapshot.savingsGoal.savedAmount +
      variableExpenseTotal) /
      snapshot.monthlyIncome,
    0,
    1,
  );

  return {
    fixedExpenseTotal,
    variableExpenseTotal,
    savingsProgress,
    availableBalance,
    monthlyUsagePercent,
  };
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  snapshot: mockDashboardSnapshot,
  isHydrated: false,
  hydrate: async () => {
    const snapshot = await loadDashboardSnapshot();

    set({
      snapshot: snapshot ?? mockDashboardSnapshot,
      isHydrated: true,
    });

    if (!snapshot) {
      await saveDashboardSnapshot(mockDashboardSnapshot);
    }
  },
  addTransaction: async (transaction) => {
    const nextSnapshot: DashboardSnapshot = {
      ...get().snapshot,
      recentTransactions: [
        transaction,
        ...get().snapshot.recentTransactions,
      ].slice(0, 6),
    };

    set({ snapshot: nextSnapshot });
    await saveDashboardSnapshot(nextSnapshot);
  },
}));
