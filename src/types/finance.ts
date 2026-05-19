export type TransactionKind = "income" | "expense";

export type TransactionCategory = "fixed" | "variable" | "saving";

export type Transaction = {
  id: string;
  title: string;
  amount: number;
  kind: TransactionKind;
  category: TransactionCategory;
  dateLabel: string;
  note?: string;
};

export type FixedExpense = {
  id: string;
  title: string;
  amount: number;
  dueLabel: string;
};

export type SavingsGoal = {
  id: string;
  title: string;
  targetAmount: number;
  savedAmount: number;
};

export type DashboardSnapshot = {
  monthlyIncome: number;
  fixedExpenses: FixedExpense[];
  savingsGoal: SavingsGoal;
  recentTransactions: Transaction[];
};

export type DashboardMetrics = {
  fixedExpenseTotal: number;
  variableExpenseTotal: number;
  savingsProgress: number;
  availableBalance: number;
  monthlyUsagePercent: number;
};
