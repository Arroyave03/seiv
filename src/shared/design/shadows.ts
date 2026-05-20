/**
 * SEIV SHADOW SYSTEM
 *
 * Sombras minimalistas para iOS, sin exageración.
 * Crean profundidad sutil y ayudan a la jerarquía visual.
 */

export const Shadows = {
  // Sombra sutil para cards y elements elevados
  sm: {
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  // Sombra estándar para modales y popovers
  md: {
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },

  // Sombra profunda para FAB y elementos destacados
  lg: {
    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },

  // Sombra muy sutil para bordes
  xs: {
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
} as const;
