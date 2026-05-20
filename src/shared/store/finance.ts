/**
 * SEIV FINANCE STORE
 *
 * Estado global de finanzas.
 * Maneja:
 * - Transacciones guardadas
 * - Ingreso mensual
 * - Cálculos automáticos
 * - Persistencia en web (localStorage) y native (SQLite)
 */

import { create } from "zustand";

import { loadSnapshot, saveSnapshot } from "@/shared/database/storage-adapter";
import type {
    DashboardMetrics,
    DashboardSnapshot,
    Transaction,
} from "@/types/finance";
import { calculateDashboardMetrics as calcMetrics } from "./metrics";

/**
 * Genera un UUID simple (no criptográfico, solo para IDs locales)
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export type FinanceState = {
  // Datos primitivos
  monthlyIncome: number;
  transactions: Transaction[];
  isHydrated: boolean;

  // Snapshot para compatibilidad con código antiguo
  snapshot: DashboardSnapshot;

  // Acciones
  hydrate: () => Promise<void>;
  setMonthlyIncome: (amount: number) => Promise<void>;
  addTransaction: (
    title: string,
    amount: number,
    categoryId: string,
    kind: "income" | "expense",
    note?: string,
  ) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  updateTransaction: (
    id: string,
    updates: Partial<Transaction>,
  ) => Promise<void>;

  // Cálculos (derivados)
  getMetrics: () => DashboardMetrics;
};

export const useFinanceStore = create<FinanceState>((set, get) => ({
  // Estado inicial
  monthlyIncome: 5_000_000,
  transactions: [],
  isHydrated: false,
  snapshot: {
    monthlyIncome: 5_000_000,
    transactions: [],
    updatedAt: new Date().toISOString(),
  },

  // Hydrate desde almacenamiento (web o native)
  hydrate: async () => {
    try {
      const saved = await loadSnapshot();

      if (saved) {
        set({
          monthlyIncome: saved.monthlyIncome,
          transactions: saved.transactions,
          snapshot: saved,
          isHydrated: true,
        });
      } else {
        // Datos por defecto si no hay nada guardado
        const defaultTransactions: Transaction[] = [
          {
            id: generateId(),
            title: "Café y desayuno",
            amount: 24_000,
            kind: "expense",
            categoryId: "food",
            createdAt: new Date(2026, 4, 18, 8, 12).toISOString(),
          },
          {
            id: generateId(),
            title: "Viaje en app",
            amount: 31_500,
            kind: "expense",
            categoryId: "transport",
            createdAt: new Date(2026, 4, 17, 19, 40).toISOString(),
          },
          {
            id: generateId(),
            title: "Membresía gym",
            amount: 95_000,
            kind: "expense",
            categoryId: "health",
            createdAt: new Date(2026, 4, 18, 7, 0).toISOString(),
          },
          {
            id: generateId(),
            title: "Salario",
            amount: 5_000_000,
            kind: "income",
            categoryId: "income",
            createdAt: new Date(2026, 4, 1, 9, 0).toISOString(),
          },
        ];

        const monthlyIncome = 5_000_000;
        const snapshot: DashboardSnapshot = {
          monthlyIncome,
          transactions: defaultTransactions,
          updatedAt: new Date().toISOString(),
        };

        set({
          monthlyIncome,
          transactions: defaultTransactions,
          snapshot,
          isHydrated: true,
        });

        // Guardar datos por defecto
        await saveSnapshot(snapshot);
      }
    } catch (error) {
      console.error("Error hydrating store:", error);
      set({ isHydrated: true });
    }
  },

  // Setter para ingreso mensual
  setMonthlyIncome: async (amount: number) => {
    set((state) => ({
      monthlyIncome: amount,
      snapshot: { ...state.snapshot, monthlyIncome: amount },
    }));
    // Guardar cambios
    const state = get();
    await saveSnapshot(state.snapshot);
  },

  // Agregar transacción
  addTransaction: async (title, amount, categoryId, kind, note) => {
    const newTransaction: Transaction = {
      id: generateId(),
      title,
      amount,
      kind,
      categoryId: categoryId as any,
      createdAt: new Date().toISOString(),
      note,
    };

    set((state) => {
      const transactions = [newTransaction, ...state.transactions];
      return {
        transactions,
        snapshot: { ...state.snapshot, transactions },
      };
    });

    // Guardar cambios
    const state = get();
    await saveSnapshot(state.snapshot);
  },

  // Eliminar transacción
  deleteTransaction: async (id: string) => {
    set((state) => {
      const transactions = state.transactions.filter((t) => t.id !== id);
      return {
        transactions,
        snapshot: { ...state.snapshot, transactions },
      };
    });

    // Guardar cambios
    const state = get();
    await saveSnapshot(state.snapshot);
  },

  // Actualizar transacción
  updateTransaction: async (id: string, updates: Partial<Transaction>) => {
    set((state) => {
      const transactions = state.transactions.map((t) =>
        t.id === id ? { ...t, ...updates } : t,
      );
      return {
        transactions,
        snapshot: { ...state.snapshot, transactions },
      };
    });

    // Guardar cambios
    const state = get();
    await saveSnapshot(state.snapshot);
  },

  // Calcular métricas
  getMetrics: () => {
    const state = get();
    return calcMetrics(state.monthlyIncome, state.transactions);
  },
}));
