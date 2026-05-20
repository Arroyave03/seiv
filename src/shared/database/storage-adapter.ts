/**
 * STORAGE ADAPTER
 *
 * Abstracción de almacenamiento que funciona en web y native.
 * - Web: almacenamiento en memoria (solo desarrollo)
 * - Native: usa expo-sqlite
 */

import type { DashboardSnapshot } from "@/types/finance";
import { Platform } from "react-native";

interface StorageAdapter {
  load: (key: string) => Promise<DashboardSnapshot | null>;
  save: (key: string, data: DashboardSnapshot) => Promise<void>;
}

// Cache en memoria para web
const memoryCache = new Map<string, DashboardSnapshot>();

/**
 * WEB ADAPTER - en memoria (sin persistencia)
 */
const webAdapter: StorageAdapter = {
  load: async (key: string) => {
    return memoryCache.get(key) ?? null;
  },

  save: async (key: string, data: DashboardSnapshot) => {
    memoryCache.set(key, data);
  },
};

/**
 * NATIVE ADAPTER - expo-sqlite
 */
const nativeAdapter: StorageAdapter = {
  load: async (key: string) => {
    try {
      const { openDatabaseAsync } = await import("expo-sqlite");
      const db = await openDatabaseAsync("seiv.db");

      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS storage (
          id TEXT PRIMARY KEY,
          payload TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );
      `);

      const result = await db.getFirstAsync<{ payload: string }>(
        "SELECT payload FROM storage WHERE id = ?",
        [key],
      );

      if (result) {
        return JSON.parse(result.payload);
      }
      return null;
    } catch (error) {
      console.error("Error loading from SQLite:", error);
      return null;
    }
  },

  save: async (key: string, data: DashboardSnapshot) => {
    try {
      const { openDatabaseAsync } = await import("expo-sqlite");
      const db = await openDatabaseAsync("seiv.db");

      await db.runAsync(
        `INSERT OR REPLACE INTO storage (id, payload, updated_at)
         VALUES (?, ?, ?)`,
        [key, JSON.stringify(data), new Date().toISOString()],
      );
    } catch (error) {
      console.error("Error saving to SQLite:", error);
    }
  },
};

/**
 * Selecciona el adapter según la plataforma
 */
export const storageAdapter: StorageAdapter = Platform.select({
  web: webAdapter,
  default: nativeAdapter,
}) as StorageAdapter;

/**
 * Helpers
 */
export const STORAGE_KEY = "seiv_dashboard";

export async function loadSnapshot(): Promise<DashboardSnapshot | null> {
  return storageAdapter.load(STORAGE_KEY);
}

export async function saveSnapshot(data: DashboardSnapshot): Promise<void> {
  return storageAdapter.save(STORAGE_KEY, data);
}
