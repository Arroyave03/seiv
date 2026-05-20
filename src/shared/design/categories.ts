/**
 * EXPENSE CATEGORIES
 *
 * Sistema de categorías reutilizable.
 * Cada categoría tiene:
 * - ID único
 * - Nombre en español
 * - Color suave
 * - Icono (emoji o nombre de símbolo)
 *
 * Pensado para ser:
 * - Visual y fácil de entender
 * - Minimalista pero completo
 * - Extensible sin complejidad
 */

export type CategoryId =
  | "food"
  | "transport"
  | "groceries"
  | "entertainment"
  | "health"
  | "education"
  | "home"
  | "other"
  | "income";

export type Category = {
  id: CategoryId;
  name: string;
  emoji: string;
  color: string;
  colorLight: string;
};

export const EXPENSE_CATEGORIES: Record<CategoryId, Category> = {
  food: {
    id: "food",
    name: "Comida",
    emoji: "🍽️",
    color: "#F59E0B",
    colorLight: "#FEF3C7",
  },
  transport: {
    id: "transport",
    name: "Transporte",
    emoji: "🚗",
    color: "#3B82F6",
    colorLight: "#DBEAFE",
  },
  groceries: {
    id: "groceries",
    name: "Mercado",
    emoji: "🛒",
    color: "#10B981",
    colorLight: "#D1FAE5",
  },
  entertainment: {
    id: "entertainment",
    name: "Entretenimiento",
    emoji: "🎬",
    color: "#8B5CF6",
    colorLight: "#EDE9FE",
  },
  health: {
    id: "health",
    name: "Salud",
    emoji: "⚕️",
    color: "#EF4444",
    colorLight: "#FEE2E2",
  },
  education: {
    id: "education",
    name: "Educación",
    emoji: "📚",
    color: "#06B6D4",
    colorLight: "#CFFAFE",
  },
  home: {
    id: "home",
    name: "Hogar",
    emoji: "🏠",
    color: "#EC4899",
    colorLight: "#FCE7F3",
  },
  other: {
    id: "other",
    name: "Otros",
    emoji: "•••",
    color: "#6B7280",
    colorLight: "#F3F4F6",
  },
  income: {
    id: "income",
    name: "Ingreso",
    emoji: "💰",
    color: "#15803D",
    colorLight: "#DCFCE7",
  },
};

/**
 * Helpers para categorías
 */
export function getCategoryById(id: CategoryId): Category {
  return EXPENSE_CATEGORIES[id];
}

export function getCategoryColor(id: CategoryId): string {
  return EXPENSE_CATEGORIES[id].color;
}

export function getCategoryName(id: CategoryId): string {
  return EXPENSE_CATEGORIES[id].name;
}

export function getCategoryEmoji(id: CategoryId): string {
  return EXPENSE_CATEGORIES[id].emoji;
}
