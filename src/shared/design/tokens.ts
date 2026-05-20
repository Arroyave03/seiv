/**
 * SEIV DESIGN TOKENS
 *
 * Sistema de diseño completo para "Seiv".
 * Incluye colores, tipografía, espaciado, bordes, sombras.
 *
 * Filosofía:
 * - Minimalista y limpio
 * - Accesible y legible
 * - Coherente entre plataformas
 * - Profesional y premium
 */

import { Platform } from "react-native";

/**
 * COLORES
 *
 * Paleta inspirada en aplicaciones modernas:
 * - Apple: minimalismo y claridad
 * - Monzo: color y personalidad
 * - Revolut: morado y modernidad
 *
 * "Seiv" usa teals y tonos neutrales para balance.
 */
const ColorPalette = {
  // Neutrales
  neutral: {
    50: "#FAFAF9",
    100: "#F5F5F4",
    200: "#E7E5E4",
    300: "#D6D3D1",
    400: "#A8A29E",
    500: "#78716F",
    600: "#57534E",
    700: "#3F3935",
    800: "#292521",
    900: "#1C1917",
  },

  // Primario: Teal (principal de Seiv)
  primary: {
    50: "#F0FDFA",
    100: "#CCFBF1",
    200: "#99F6E4",
    300: "#5EEAD4",
    400: "#2DD4BF",
    500: "#14B8A6",
    600: "#0D9488",
    700: "#0F766E",
    800: "#115E59",
    900: "#134E4A",
  },

  // Secundario: Azul
  blue: {
    50: "#F0F9FF",
    100: "#E0F2FE",
    200: "#BAE6FD",
    300: "#7DD3FC",
    400: "#38BDF8",
    500: "#0EA5E9",
    600: "#0284C7",
    700: "#0369A1",
    800: "#075985",
    900: "#0C4A6E",
  },

  // Estados
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#3B82F6",
};

export const Colors = {
  light: {
    // Fondos
    background: "#F6F2EB",
    surface: "#FFFFFF",
    surfaceSecondary: "#F9F8F7",

    // Texto
    text: ColorPalette.neutral[900],
    textSecondary: ColorPalette.neutral[600],
    textTertiary: ColorPalette.neutral[500],

    // Interactivos
    primary: ColorPalette.primary[600],
    primaryLight: ColorPalette.primary[50],
    secondary: ColorPalette.blue[600],

    // Bordes y divisores
    border: ColorPalette.neutral[200],
    divider: ColorPalette.neutral[100],

    // Estados
    success: ColorPalette.success,
    warning: ColorPalette.warning,
    danger: ColorPalette.danger,
    info: ColorPalette.info,

    // Especiales
    overlay: "rgba(0, 0, 0, 0.5)",
    shadowColor: ColorPalette.neutral[900],
  },

  dark: {
    // Fondos
    background: "#0F1419",
    surface: "#1A1F2E",
    surfaceSecondary: "#252D3D",

    // Texto
    text: ColorPalette.neutral[50],
    textSecondary: ColorPalette.neutral[400],
    textTertiary: ColorPalette.neutral[500],

    // Interactivos
    primary: ColorPalette.primary[400],
    primaryLight: ColorPalette.primary[900],
    secondary: ColorPalette.blue[400],

    // Bordes y divisores
    border: ColorPalette.neutral[700],
    divider: ColorPalette.neutral[800],

    // Estados
    success: "#34D399",
    warning: "#FBBF24",
    danger: "#F87171",
    info: "#60A5FA",

    // Especiales
    overlay: "rgba(0, 0, 0, 0.7)",
    shadowColor: ColorPalette.neutral[900],
  },
} as const;

export type ThemeType = "light" | "dark";
export type ColorKey = keyof typeof Colors.light;

/**
 * ESPACIADO
 *
 * Escala modular basada en 4px.
 */
export const Spacing = {
  0: 0,
  px: 1,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
} as const;

/**
 * BORDER RADIUS
 *
 * Sistema de bordes redondeados minimalista.
 */
export const Radius = {
  none: 0,
  sm: 6,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 28,
  "3xl": 36,
  pill: 999,
} as const;

/**
 * THEME - Objeto consolidado para fácil acceso
 */
export const Theme = {
  colors: Colors,
  spacing: Spacing,
  radius: Radius,
} as const;

/**
 * Platform-specific constants
 */
export const PlatformConstants = Platform.select({
  ios: {
    safeAreaBottomInset: 50,
    statusBarHeight: 50,
  },
  android: {
    safeAreaBottomInset: 80,
    statusBarHeight: 24,
  },
  default: {
    safeAreaBottomInset: 0,
    statusBarHeight: 0,
  },
});

export const MaxContentWidth = 520;
