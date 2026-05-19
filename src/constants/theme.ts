/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import "@/global.css";

import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#0E1116",
    textSecondary: "#667085",
    background: "#F6F2EB",
    backgroundElement: "#FFFFFF",
    backgroundSelected: "#EAE3D8",
    surface: "#FFFFFF",
    surfaceSecondary: "#F3EEE5",
    border: "rgba(15, 23, 42, 0.08)",
    accent: "#0E7490",
    accentSoft: "#D9F2F6",
    success: "#15803D",
    warning: "#B45309",
    danger: "#B91C1C",
    shadow: "rgba(15, 23, 42, 0.12)",
  },
  dark: {
    text: "#F4F7FB",
    textSecondary: "#A7B0BC",
    background: "#090D12",
    backgroundElement: "#111823",
    backgroundSelected: "#1A2431",
    surface: "#111823",
    surfaceSecondary: "#182131",
    border: "rgba(255, 255, 255, 0.08)",
    accent: "#4DD0E1",
    accentSoft: "rgba(77, 208, 225, 0.14)",
    success: "#4ADE80",
    warning: "#FBBF24",
    danger: "#F87171",
    shadow: "rgba(0, 0, 0, 0.35)",
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "var(--font-display)",
    serif: "var(--font-serif)",
    rounded: "var(--font-rounded)",
    mono: "var(--font-mono)",
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  small: 14,
  medium: 20,
  large: 28,
  extraLarge: 36,
  pill: 999,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 520;
