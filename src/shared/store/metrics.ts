/**
 * METRICS CALCULATOR
 *
 * Funciones puras para calcular métricas financieras.
 * Sin dependencias de estado, reutilizable en cualquier contexto.
 */

import type { DashboardMetrics, Transaction } from "@/types/finance";
import { clamp } from "@/utils/money";

/**
 * Calcula todas las métricas del dashboard.
 *
 * @param monthlyIncome Ingreso mensual
 * @param transactions Array de transacciones
 * @returns Objeto con todas las métricas calculadas
 */
export function calculateDashboardMetrics(
  monthlyIncome: number,
  transactions: Transaction[],
): DashboardMetrics {
  // Gastos (todo lo que no es ingreso)
  const expenses = transactions.filter((t) => t.kind === "expense");
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);

  // Ingresos (cualquier transacción de ingreso)
  const incomes = transactions.filter((t) => t.kind === "income");
  const totalIncome =
    incomes.reduce((sum, t) => sum + t.amount, 0) || monthlyIncome;

  // Dinero disponible
  const availableBalance = totalIncome - totalExpenses;

  // Porcentaje de uso del presupuesto
  const usagePercent = clamp(totalExpenses / totalIncome, 0, 1);

  // Gasto promedio diario (en base a 30 días)
  const dailyAverageExpense = totalExpenses / 30;

  // Dinero restante para los días del mes (asume 30 días)
  const daysRemaining = Math.max(0, 30 - new Date().getDate() + 1);
  const dailyBudget = Math.max(0, availableBalance / daysRemaining);

  return {
    totalIncome,
    totalExpenses,
    availableBalance,
    usagePercent,
    dailyAverageExpense,
    dailyBudget,
    daysRemaining,
  };
}

/**
 * Agrupa transacciones por categoría.
 */
export function groupTransactionsByCategory(
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
 * Filtra transacciones del mes actual.
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
 * Ordena transacciones por fecha (más recientes primero).
 */
export function sortTransactionsByDate(
  transactions: Transaction[],
): Transaction[] {
  return [...transactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
