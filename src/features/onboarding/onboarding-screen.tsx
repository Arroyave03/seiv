/**
 * ONBOARDING SCREEN
 *
 * Primera vez que se abre la app.
 * Pide:
 * - Ingreso mensual
 * - Meta de ahorro (opcional)
 * - Gastos fijos principales (opcional)
 *
 * Diseño: minimalista tipo Apple
 */

import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Shadows } from "@/shared/design/shadows";
import { Typography } from "@/shared/design/typography";
import { useFinanceStore } from "@/shared/store/finance";
import { formatMoney } from "@/utils/money";

export interface OnboardingScreenProps {
  onComplete: () => void;
}

/**
 * ONBOARDING SCREEN
 *
 * UX Philosophy:
 * - Una pregunta a la vez
 * - No abrumar
 * - Todos los campos son opcionales excepto ingreso
 * - Botón "Continuar" solo cuando hay dato válido
 * - Preview en tiempo real
 */
export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const theme = useTheme();
  const storeSetMonthlyIncome = useFinanceStore(
    (state) => state.setMonthlyIncome,
  );

  const [step, setStep] = useState<"income" | "savings" | "done">("income");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [savingsTarget, setSavingsTarget] = useState("");

  // Formatea con puntos mientras el usuario escribe: 5000 -> 5.000
  const formatNumberInput = (text: string) => {
    const digits = text.replace(/\D/g, "");
    if (!digits) return "";
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  const parseNumber = (formatted: string) => {
    if (!formatted) return 0;
    return Number(formatted.replace(/\./g, ""));
  };

  const isValidIncome = monthlyIncome && parseFloat(monthlyIncome) > 0;
  const isValidSavings = !savingsTarget || parseFloat(savingsTarget) > 0;
  const isDisabled = step === "income" ? !isValidIncome : false;
  const buttonBackground = isDisabled ? theme.accentSoft : theme.accent;
  const buttonTextColor = isDisabled ? theme.textSecondary : "#fff";

  const handleNext = async () => {
    if (step === "income" && isValidIncome) {
      setStep("savings");
    } else if (step === "savings") {
      // Guardar configuración (convertir formato con puntos a número)
      await storeSetMonthlyIncome(parseNumber(monthlyIncome));
      setStep("done");
      // Esperar a que se complete la animación
      setTimeout(onComplete, 500);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboard}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Logo/Titulo */}
            <View style={styles.header}>
              <ThemedText style={styles.logo}>Seiv</ThemedText>
              <ThemedText
                style={[styles.subtitle, { color: theme.textSecondary }]}
              >
                Control tu dinero fácilmente
              </ThemedText>
            </View>

            {/* Step 1: Ingreso Mensual */}
            {step === "income" && (
              <View style={styles.step}>
                <ThemedText style={styles.stepTitle}>
                  ¿Cuál es tu ingreso mensual?
                </ThemedText>
                {/* nota informativa eliminada por petición del usuario */}

                <View style={styles.inputWrapper}>
                  <View
                    style={[
                      styles.currencyField,
                      {
                        backgroundColor: theme.backgroundElement,
                        borderColor: theme.border,
                      },
                    ]}
                  >
                    <ThemedText
                      style={[styles.currencySymbol, { color: theme.accent }]}
                    >
                      $
                    </ThemedText>
                    <TextInput
                      placeholder="Ej: 3.500.000"
                      placeholderTextColor={theme.textSecondary}
                      keyboardType="number-pad"
                      value={monthlyIncome}
                      onChangeText={(t) =>
                        setMonthlyIncome(formatNumberInput(t))
                      }
                      style={[styles.currencyInput, { color: theme.text }]}
                      autoFocus
                      allowFontScaling={false}
                    />
                  </View>
                </View>

                {/* Preview eliminado según petición del usuario */}
              </View>
            )}

            {/* Step 2: Meta de Ahorro */}
            {step === "savings" && (
              <View style={styles.step}>
                <ThemedText style={styles.stepTitle}>
                  ¿Cuánto quieres ahorrar mensual?
                </ThemedText>
                <ThemedText
                  style={[styles.stepCaption, { color: theme.textSecondary }]}
                >
                  Opcional. Seiv restará esto de tu disponible.
                </ThemedText>

                <View style={styles.inputWrapper}>
                  <View
                    style={[
                      styles.currencyField,
                      {
                        backgroundColor: theme.backgroundElement,
                        borderColor: theme.border,
                      },
                    ]}
                  >
                    <ThemedText
                      style={[styles.currencySymbol, { color: theme.accent }]}
                    >
                      $
                    </ThemedText>
                    <TextInput
                      placeholder="Ej: 500.000 (opcional)"
                      placeholderTextColor={theme.textSecondary}
                      keyboardType="number-pad"
                      value={savingsTarget}
                      onChangeText={(t) =>
                        setSavingsTarget(formatNumberInput(t))
                      }
                      style={[styles.currencyInput, { color: theme.text }]}
                      autoFocus
                      allowFontScaling={false}
                    />
                  </View>
                </View>

                {isValidSavings && savingsTarget && (
                  <View
                    style={[
                      styles.preview,
                      { backgroundColor: theme.surfaceSecondary },
                    ]}
                  >
                    <ThemedText
                      style={[
                        styles.previewLabel,
                        { color: theme.textSecondary },
                      ]}
                    >
                      Para gastar (después de ahorrar)
                    </ThemedText>
                    <ThemedText
                      style={[styles.previewAmount, { color: theme.accent }]}
                    >
                      {formatMoney(
                        parseNumber(monthlyIncome) - parseNumber(savingsTarget),
                      )}
                    </ThemedText>
                  </View>
                )}
              </View>
            )}

            {/* Step 3: Completado */}
            {step === "done" && (
              <View style={styles.step}>
                <ThemedText style={styles.doneEmoji}>✓</ThemedText>
                <ThemedText style={styles.stepTitle}>¡Listo!</ThemedText>
                <ThemedText
                  style={[styles.stepCaption, { color: theme.textSecondary }]}
                >
                  Tu app está configurada. Ahora puedes registrar gastos.
                </ThemedText>
              </View>
            )}

            {/* Spacer */}
            <View style={styles.spacer} />
          </ScrollView>

          {/* Action Button */}
          {step !== "done" && (
            <View style={styles.footer}>
              <TouchableOpacity
                onPress={handleNext}
                disabled={isDisabled}
                style={[
                  styles.button,
                  {
                    backgroundColor: buttonBackground,
                  },
                  Shadows.md,
                ]}
              >
                <ThemedText
                  style={[styles.buttonText, { color: buttonTextColor }]}
                >
                  {step === "savings" ? "Completar" : "Continuar"}
                </ThemedText>
              </TouchableOpacity>
            </View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboard: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.six,
    paddingBottom: Spacing.six,
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing.six,
    gap: Spacing.two,
  },
  logo: {
    ...Typography.displayLarge,
    marginBottom: Spacing.two,
  },
  subtitle: {
    ...Typography.bodyLarge,
  },
  step: {
    gap: Spacing.four,
    marginVertical: Spacing.six,
  },
  stepTitle: {
    ...Typography.headlineMedium,
  },
  stepCaption: {
    ...Typography.bodyMedium,
  },
  currencyField: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  currencySymbol: {
    ...Typography.headlineSmall,
    fontWeight: "700",
  },
  currencyInput: {
    flex: 1,
    padding: 0,
    margin: 0,
    ...Typography.headlineSmall,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  inputWrapper: {
    marginTop: Spacing.two,
  },
  preview: {
    padding: Spacing.four,
    borderRadius: 12,
    alignItems: "center",
    gap: Spacing.one,
  },
  previewLabel: {
    ...Typography.labelSmall,
  },
  previewAmount: {
    ...Typography.headlineSmall,
  },
  spacer: {
    height: Spacing.six,
  },
  footer: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    gap: Spacing.three,
  },
  button: {
    paddingVertical: Spacing.four,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    ...Typography.titleMedium,
    color: "#fff",
  },
  doneEmoji: {
    fontSize: 48,
    textAlign: "center",
  },
});
