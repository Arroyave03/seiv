/**
 * FINANCIAL LOGIC
 *
 * Lógica financiera centralizada y reutilizable.
 * Todas las fórmulas, cálculos y utilitarios en un solo lugar.
 *
 * Principio: Funciones puras, sin dependencias de estado.
 * Patrón: input → cálculo → output
 */

import type { Transaction } from "@/types/finance";

/**
 * ESTRUCTURA DE CONFIGURACIÓN FINANCIERA
 * Lo que el usuario configura una sola vez en onboarding
 */
export type FinancialConfig = {
  monthlyIncome: number;
  monthlyTargetSavings: number; // Cuánto quiere ahorrar mensual
  fixedExpenses: Array<{
    id: string;
    title: string;
    amount: number;
  }>;
};

/**
 * RESUMEN FINANCIERO CALCULADO
 * Lo que se muestra en la pantalla
 */
export type FinancialSummary = {
  // Ingresos y gastos
  totalIncome: number;
  totalExpenses: number;
  totalFixed: number;
  totalVariable: number;

  // Disponibilidad
  availableForVariable: number; // Ingreso - Fijos - Ahorro
  availableBalance: number; // Ingreso - Todo

  // Ahorro
  savingsTarget: number;
  savedThisMonth: number;
  savingsPercentage: number;

  // Porcentajes
  usagePercent: number; // % del ingreso gastado
  savingsPercentage: number; // % ahorrado del ingreso

  // Diarios
  daysInMonth: number;
  daysRemaining: number;
  dailyBudget: number; // Disponible / días restantes
  dailyAverageExpense: number; // Total gastado / días transcurridos
};

/**
 * Calcula el resumen financiero completo
 *
 * ORDEN DE PRIORIDADES:
 * 1. Ingreso mensual
 * 2. Gastos fijos (obligatorios)
 * 3. Meta de ahorro (planificación)
 * 4. Gastos variables (dinámico)
 */
export function calculateFinancialSummary(
  config: FinancialConfig,
  transactions: Transaction[],
): FinancialSummary {
  // Gastos fijos (de config)
  const totalFixed = config.fixedExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Gastos variables (de transacciones)
  const expenseTransactions = transactions.filter((t) => t.kind === "expense");
  const totalVariable = expenseTransactions.reduce(
    (sum, t) => sum + t.amount,
    0,
  );
  const totalExpenses = totalFixed + totalVariable;

  // Ingreso
  const totalIncome = config.monthlyIncome;

  // Disponible (después de fijos y ahorro)
  const availableForVariable = Math.max(
    0,
    totalIncome - totalFixed - config.monthlyTargetSavings,
  );

  // Balance restante (después de TODO)
  const availableBalance = Math.max(
    0,
    totalIncome - totalExpenses - config.monthlyTargetSavings,
  );

  // Ahorro
  const savedThisMonth = Math.max(0, totalIncome - totalExpenses);
  const savingsPercentage = totalIncome > 0 ? savedThisMonth / totalIncome : 0;

  // Uso del presupuesto
  const usagePercent = Math.min(1, totalExpenses / totalIncome);

  // Días
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dayOfMonth = now.getDate();
  const daysRemaining = Math.max(1, daysInMonth - dayOfMonth + 1);

  // Presupuesto diario disponible
  const dailyBudget = availableBalance / daysRemaining;

  // Gasto promedio diario (de lo que ya pasó)
  const daysTranscurred = Math.max(1, dayOfMonth);
  const dailyAverageExpense = totalVariable / daysTranscurred;

  return {
    totalIncome,
    totalExpenses,
    totalFixed,
    totalVariable,
    availableForVariable,
    availableBalance,
    savingsTarget: config.monthlyTargetSavings,
    savedThisMonth,
    savingsPercentage,
    usagePercent,
    daysInMonth,
    daysRemaining,
    dailyBudget,
    dailyAverageExpense,
  };
}

/**
 * Agrupa gastos por categoría
 */
export function groupExpensesByCategory(
  transactions: Transaction[],
): Record<string, number> {
  const groups: Record<string, number> = {};

  transactions
    .filter((t) => t.kind === "expense")
    .forEach((t) => {
      groups[t.categoryId] = (groups[t.categoryId] ?? 0) + t.amount;
    });

  return groups;
}

/**
 * Filtra transacciones del mes actual
 */
export function getTransactionsThisMonth(
  transactions: Transaction[],
): Transaction[] {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return transactions.filter((t) => {
    const date = new Date(t.createdAt);
    return (
      date.getMonth() === currentMonth && date.getFullYear() === currentYear
    );
  });
}

/**
 * Agrupa gastos por fecha (para pantalla de historial)
 */
export function groupTransactionsByDate(
  transactions: Transaction[],
): Map<string, Transaction[]> {
  const groups = new Map<string, Transaction[]>();

  [...transactions]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .forEach((t) => {
      const date = new Date(t.createdAt);
      const dateKey = date.toLocaleDateString("es-CO", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      if (!groups.has(dateKey)) {
        groups.set(dateKey, []);
      }
      groups.get(dateKey)!.push(t);
    });

  return groups;
}

/**
 * Total gastado en un día específico
 */
export function getDailyTotal(transactions: Transaction[], date: Date): number {
  const dateStr = date.toLocaleDateString("es-CO");

  return transactions
    .filter((t) => {
      const tDate = new Date(t.createdAt).toLocaleDateString("es-CO");
      return tDate === dateStr && t.kind === "expense";
    })
    .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Valida si un gasto es lógico
 * (no puede ser mayor al presupuesto disponible)
 */
export function isExpenseValid(
  amount: number,
  config: FinancialConfig,
  transactions: Transaction[],
): boolean {
  const summary = calculateFinancialSummary(config, transactions);
  return amount > 0 && amount <= summary.availableBalance;
}

/**
 * Proyecta el balance a fin de mes
 * Asume el mismo ritmo de gastos
 */
export function projectMonthEnd(
  config: FinancialConfig,
  transactions: Transaction[],
): number {
  const summary = calculateFinancialSummary(config, transactions);
  const now = new Date();
  const yearEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const timeRemaining = yearEnd.getTime() - now.getTime();
  const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));

  return Math.max(
    0,
    summary.availableBalance - summary.dailyAverageExpense * daysRemaining,
  );
}
