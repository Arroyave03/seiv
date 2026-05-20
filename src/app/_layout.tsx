import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import React from "react";
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";

  return (
    <SafeAreaProvider>
      <ThemeProvider
        value={
          theme === "dark"
            ? {
                ...DarkTheme,
                colors: {
                  ...DarkTheme.colors,
                  background: Colors.dark.background,
                  card: Colors.dark.backgroundElement,
                  text: Colors.dark.text,
                  border: Colors.dark.border,
                  primary: Colors.dark.accent,
                },
              }
            : {
                ...DefaultTheme,
                colors: {
                  ...DefaultTheme.colors,
                  background: Colors.light.background,
                  card: Colors.light.backgroundElement,
                  text: Colors.light.text,
                  border: Colors.light.border,
                  primary: Colors.light.accent,
                },
              }
        }
      >
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: Colors[theme].background,
            },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen
            name="explore"
            options={{
              headerShown: true,
              title: "Movimientos",
              headerBackTitle: "Inicio",
            }}
          />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
