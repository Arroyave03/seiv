import type { DashboardSnapshot } from "@/types/finance";

export const mockDashboardSnapshot: DashboardSnapshot = {
  monthlyIncome: 5_000_000,
  fixedExpenses: [
    {
      id: "rent",
      title: "Arriendo",
      amount: 1_600_000,
      dueLabel: "5 de cada mes",
    },
    {
      id: "services",
      title: "Servicios y suscripciones",
      amount: 180_000,
      dueLabel: "10 de cada mes",
    },
    {
      id: "transport",
      title: "Transporte fijo",
      amount: 120_000,
      dueLabel: "Mensual",
    },
    {
      id: "groceries",
      title: "Mercado base",
      amount: 260_000,
      dueLabel: "Semanal",
    },
  ],
  savingsGoal: {
    id: "emergency-fund",
    title: "Fondo de emergencia",
    targetAmount: 900_000,
    savedAmount: 360_000,
  },
  recentTransactions: [
    {
      id: "coffee-breakfast",
      title: "Café y desayuno",
      amount: 24_000,
      kind: "expense",
      category: "variable",
      dateLabel: "Hoy · 08:12",
    },
    {
      id: "uber",
      title: "Viaje en app",
      amount: 31_500,
      kind: "expense",
      category: "variable",
      dateLabel: "Ayer · 19:40",
    },
    {
      id: "gym",
      title: "Membresía gym",
      amount: 95_000,
      kind: "expense",
      category: "fixed",
      dateLabel: "18 may · 07:00",
    },
    {
      id: "salary",
      title: "Salario mensual",
      amount: 5_000_000,
      kind: "income",
      category: "variable",
      dateLabel: "1 may · 09:00",
    },
  ],
};
