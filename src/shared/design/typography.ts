import { Platform } from "react-native";

/**
 * SEIV TYPOGRAPHY SYSTEM
 *
 * Basado en SF Pro Display (iOS nativa).
 * Escala tipográfica clara y jerárquica.
 * Valores en px, se convierten automáticamente a rem en web.
 */

export const Typography = {
  // Display/Heroic
  displayLarge: {
    fontSize: 48,
    lineHeight: 56,
    fontWeight: "700" as const,
    letterSpacing: -0.5,
  },
  displayMedium: {
    fontSize: 40,
    lineHeight: 48,
    fontWeight: "700" as const,
    letterSpacing: -0.3,
  },
  displaySmall: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700" as const,
    letterSpacing: -0.2,
  },

  // Headline
  headlineLarge: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "700" as const,
    letterSpacing: 0,
  },
  headlineMedium: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "700" as const,
    letterSpacing: 0,
  },
  headlineSmall: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "700" as const,
    letterSpacing: 0,
  },

  // Title
  titleLarge: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "600" as const,
    letterSpacing: 0,
  },
  titleMedium: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "600" as const,
    letterSpacing: 0,
  },
  titleSmall: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "600" as const,
    letterSpacing: 0,
  },

  // Body
  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500" as const,
    letterSpacing: 0.2,
  },
  bodyMedium: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "500" as const,
    letterSpacing: 0.2,
  },
  bodySmall: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "500" as const,
    letterSpacing: 0.3,
  },

  // Label/Caption
  labelLarge: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600" as const,
    letterSpacing: 0.5,
  },
  labelMedium: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "600" as const,
    letterSpacing: 0.5,
  },
  labelSmall: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: "600" as const,
    letterSpacing: 0.5,
  },
} as const;

/**
 * Font families por plataforma.
 * iOS usa system fonts nativos para máximo rendimiento.
 */
export const FontFamily = Platform.select({
  ios: {
    display: "SF Pro Display",
    body: "-apple-system",
    mono: "Menlo",
  },
  android: {
    display: "Roboto",
    body: "Roboto",
    mono: "Roboto Mono",
  },
  default: {
    display: "system-ui",
    body: "system-ui",
    mono: "monospace",
  },
});
