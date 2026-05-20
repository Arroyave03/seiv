/**
 * DATABASE SCHEMA & REPOSITORIES
 *
 * Estructura normalizada de SQLite para Seiv.
 * Usa Repository Pattern para encapsular acceso a datos.
 *
 * Tablas:
 * - config: Configuración financiera del usuario (una sola fila)
 * - transactions: Todos los gastos e ingresos
 * - fixed_expenses: Gastos fijos configurados
 */

import type { FinancialConfig } from "@/shared/financial/logic";
import type { Transaction } from "@/types/finance";
import { Platform } from "react-native";

// Lazy import para evitar problema con WASM en web
let openDatabaseAsync: any;

async function initDb() {
  if (Platform.OS !== "web") {
    if (!openDatabaseAsync) {
      const expo = await import("expo-sqlite");
      openDatabaseAsync = expo.openDatabaseAsync;
    }
  }
}

const DB_NAME = "seiv.db";

/**
 * Inicializa el schema de base de datos
 */
export async function initializeDatabase() {
  if (Platform.OS === "web") return;

  await initDb();

  try {
    const db = await openDatabaseAsync(DB_NAME);

    // Tabla de configuración (una sola fila)
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS config (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        monthly_income REAL NOT NULL,
        monthly_target_savings REAL NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    // Tabla de transacciones
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        amount REAL NOT NULL,
        kind TEXT NOT NULL CHECK(kind IN ('income', 'expense')),
        category_id TEXT NOT NULL,
        created_at TEXT NOT NULL,
        note TEXT,
        CREATED INDEX idx_kind_created ON transactions(kind, created_at DESC)
      );
    `);

    // Tabla de gastos fijos
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS fixed_expenses (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        amount REAL NOT NULL,
        created_at TEXT NOT NULL
      );
    `);

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}

/**
 * REPOSITORY: Configuración Financiera
 */
export const configRepository = {
  async load(): Promise<FinancialConfig | null> {
    if (Platform.OS === "web") return null;

    await initDb();

    try {
      const db = await openDatabaseAsync(DB_NAME);

      const result = await db.getFirstAsync<any>(
        "SELECT monthly_income, monthly_target_savings FROM config WHERE id = 1",
      );

      if (result) {
        return {
          monthlyIncome: result.monthly_income,
          monthlyTargetSavings: result.monthly_target_savings,
          fixedExpenses: await fixedExpensesRepository.list(),
        };
      }

      return null;
    } catch (error) {
      console.error("Error loading config:", error);
      return null;
    }
  },

  async save(config: FinancialConfig): Promise<void> {
    if (Platform.OS === "web") return;

    await initDb();

    try {
      const db = await openDatabaseAsync(DB_NAME);

      // Actualiza o inserta la config
      await db.runAsync(
        `INSERT OR REPLACE INTO config (id, monthly_income, monthly_target_savings, created_at, updated_at)
         VALUES (1, ?, ?, datetime('now'), datetime('now'))`,
        [config.monthlyIncome, config.monthlyTargetSavings],
      );

      // Actualiza gastos fijos
      await db.runAsync("DELETE FROM fixed_expenses");
      for (const expense of config.fixedExpenses) {
        await db.runAsync(
          "INSERT INTO fixed_expenses (id, title, amount, created_at) VALUES (?, ?, ?, ?)",
          [expense.id, expense.title, expense.amount, new Date().toISOString()],
        );
      }
    } catch (error) {
      console.error("Error saving config:", error);
      throw error;
    }
  },
};

/**
 * REPOSITORY: Transacciones
 */
export const transactionsRepository = {
  async create(transaction: Transaction): Promise<void> {
    if (Platform.OS === "web") return;

    await initDb();

    try {
      const db = await openDatabaseAsync(DB_NAME);

      await db.runAsync(
        `INSERT INTO transactions (id, title, amount, kind, category_id, created_at, note)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          transaction.id,
          transaction.title,
          transaction.amount,
          transaction.kind,
          transaction.categoryId,
          transaction.createdAt,
          transaction.note ?? null,
        ],
      );
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw error;
    }
  },

  async update(id: string, updates: Partial<Transaction>): Promise<void> {
    if (Platform.OS === "web") return;

    await initDb();

    try {
      const db = await openDatabaseAsync(DB_NAME);

      const fields: string[] = [];
      const values: any[] = [];

      if (updates.title !== undefined) {
        fields.push("title = ?");
        values.push(updates.title);
      }
      if (updates.amount !== undefined) {
        fields.push("amount = ?");
        values.push(updates.amount);
      }
      if (updates.categoryId !== undefined) {
        fields.push("category_id = ?");
        values.push(updates.categoryId);
      }
      if (updates.note !== undefined) {
        fields.push("note = ?");
        values.push(updates.note);
      }

      if (fields.length === 0) return;

      values.push(id);

      await db.runAsync(
        `UPDATE transactions SET ${fields.join(", ")} WHERE id = ?`,
        values,
      );
    } catch (error) {
      console.error("Error updating transaction:", error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    if (Platform.OS === "web") return;

    await initDb();

    try {
      const db = await openDatabaseAsync(DB_NAME);
      await db.runAsync("DELETE FROM transactions WHERE id = ?", [id]);
    } catch (error) {
      console.error("Error deleting transaction:", error);
      throw error;
    }
  },

  async list(): Promise<Transaction[]> {
    if (Platform.OS === "web") return [];

    await initDb();

    try {
      const db = await openDatabaseAsync(DB_NAME);

      const results = await db.getAllAsync<any>(
        "SELECT id, title, amount, kind, category_id, created_at, note FROM transactions ORDER BY created_at DESC",
      );

      return results.map((r: any) => ({
        id: r.id,
        title: r.title,
        amount: r.amount,
        kind: r.kind,
        categoryId: r.category_id,
        createdAt: r.created_at,
        note: r.note,
      }));
    } catch (error) {
      console.error("Error listing transactions:", error);
      return [];
    }
  },

  async findById(id: string): Promise<Transaction | null> {
    if (Platform.OS === "web") return null;

    await initDb();

    try {
      const db = await openDatabaseAsync(DB_NAME);

      const result = await db.getFirstAsync<any>(
        "SELECT id, title, amount, kind, category_id, created_at, note FROM transactions WHERE id = ?",
        [id],
      );

      if (result) {
        return {
          id: result.id,
          title: result.title,
          amount: result.amount,
          kind: result.kind,
          categoryId: result.category_id,
          createdAt: result.created_at,
          note: result.note,
        };
      }

      return null;
    } catch (error) {
      console.error("Error finding transaction:", error);
      return null;
    }
  },
};

/**
 * REPOSITORY: Gastos Fijos
 */
export const fixedExpensesRepository = {
  async list() {
    if (Platform.OS === "web") return [];

    await initDb();

    try {
      const db = await openDatabaseAsync(DB_NAME);

      const results = await db.getAllAsync<any>(
        "SELECT id, title, amount FROM fixed_expenses",
      );

      return results.map((r: any) => ({
        id: r.id,
        title: r.title,
        amount: r.amount,
      }));
    } catch (error) {
      console.error("Error listing fixed expenses:", error);
      return [];
    }
  },
};
