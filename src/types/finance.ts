import type { CategoryId } from "@/shared/design/categories";

export type TransactionKind = "income" | "expense";

export type Transaction = {
  id: string;
  title: string;
  amount: number;
  kind: TransactionKind;
  categoryId: CategoryId;
  createdAt: string;
  note?: string;
};

export type DashboardSnapshot = {
  monthlyIncome: number;
  transactions: Transaction[];
  updatedAt: string;
};

export type DashboardMetrics = {
  totalIncome: number;
  totalExpenses: number;
  availableBalance: number;
  usagePercent: number;
  dailyAverageExpense: number;
  dailyBudget: number;
  daysRemaining: number;
};
