import * as SQLite from "expo-sqlite";

import { mockDashboardSnapshot } from "@/features/dashboard/mock-dashboard";
import type { DashboardSnapshot } from "@/types/finance";

const databaseName = "money-app.db";
const tableName = "dashboard_snapshot";

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

function getDatabase() {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync(databaseName);
  }

  return databasePromise;
}

export async function initializeFinanceDatabase() {
  const database = await getDatabase();

  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS ${tableName} (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      payload TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  const existingSnapshot = await database.getFirstAsync<{ payload: string }>(
    `SELECT payload FROM ${tableName} WHERE id = 1;`,
  );

  if (!existingSnapshot) {
    await saveDashboardSnapshot(mockDashboardSnapshot);
  }

  return database;
}

export async function loadDashboardSnapshot() {
  const database = await initializeFinanceDatabase();
  const row = await database.getFirstAsync<{ payload: string }>(
    `SELECT payload FROM ${tableName} WHERE id = 1;`,
  );

  if (!row) {
    return null;
  }

  return JSON.parse(row.payload) as DashboardSnapshot;
}

export async function saveDashboardSnapshot(snapshot: DashboardSnapshot) {
  const database = await getDatabase();
  await database.runAsync(
    `
      INSERT INTO ${tableName} (id, payload, updated_at)
      VALUES (1, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        payload = excluded.payload,
        updated_at = excluded.updated_at;
    `,
    JSON.stringify(snapshot),
    new Date().toISOString(),
  );
}
