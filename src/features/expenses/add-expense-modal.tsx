import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { CategorySelector } from "@/shared/components/category-selector";
import { Input } from "@/shared/components/input";
import { Modal } from "@/shared/components/modal";
import type { CategoryId } from "@/shared/design/categories";
import { Shadows } from "@/shared/design/shadows";
import { Theme } from "@/shared/design/tokens";
import { Typography } from "@/shared/design/typography";
import { useFinanceStore } from "@/shared/store/finance";

export interface AddExpenseModalProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * ADD EXPENSE MODAL
 *
 * Modal para agregar una nueva transacción de gasto.
 * Incluye:
 * - Campo de monto
 * - Selector de categoría
 * - Campo de nota (opcional)
 * - Validación básica
 *
 * UX enfocado en rapidez:
 * - Monto es el primer campo (teclado abierto)
 * - Categorías visibles (no dropdown)
 * - Envío con un botón grande
 */
export function AddExpenseModal({ visible, onClose }: AddExpenseModalProps) {
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>("food");
  const [note, setNote] = useState("");
  const [description, setDescription] = useState("");

  const addTransaction = useFinanceStore((state) => state.addTransaction);

  const handleAddExpense = async () => {
    if (!amount || !selectedCategory || !description) {
      // Mostrar validación
      return;
    }

    const numAmount = parseFloat(amount);

    try {
      await addTransaction(
        description,
        numAmount,
        selectedCategory,
        "expense",
        note || undefined,
      );

      // Limpiar form
      setAmount("");
      setDescription("");
      setNote("");
      setSelectedCategory("food");

      // Cerrar modal
      onClose();
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const isValid = amount && selectedCategory && description;

  return (
    <Modal visible={visible} onClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <ThemedText style={styles.title}>Nuevo gasto</ThemedText>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <ThemedText style={styles.closeButton}>✕</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Amount Input - First thing user sees */}
          <View style={styles.amountSection}>
            <ThemedText style={styles.label}>Monto</ThemedText>
            <View style={styles.amountInputWrapper}>
              <ThemedText style={styles.currencySymbol}>$</ThemedText>
              <Input
                placeholder="0"
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
                style={styles.amountInput}
                autoFocus
              />
            </View>
          </View>

          {/* Description Input */}
          <View style={styles.section}>
            <ThemedText style={styles.label}>Descripción</ThemedText>
            <Input
              placeholder="ej. Almuerzo en restaurante"
              value={description}
              onChangeText={setDescription}
            />
          </View>

          {/* Category Selector */}
          <View style={styles.section}>
            <CategorySelector
              selectedCategoryId={selectedCategory}
              onSelectCategory={setSelectedCategory}
              excludeCategories={["income"]}
            />
          </View>

          {/* Optional Note */}
          <View style={styles.section}>
            <ThemedText style={styles.label}>Nota (opcional)</ThemedText>
            <Input
              placeholder="Detalles adicionales..."
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={2}
            />
          </View>

          {/* Action Button */}
          <TouchableOpacity
            onPress={handleAddExpense}
            disabled={!isValid}
            style={[
              styles.submitButton,
              !isValid && styles.submitButtonDisabled,
              styles.shadow,
            ]}
          >
            <ThemedText style={styles.submitButtonText}>
              Agregar gasto
            </ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    ...Typography.headlineSmall,
  },
  closeButton: {
    fontSize: 24,
    color: Theme.colors.light.textSecondary,
  },
  amountSection: {
    marginBottom: 20,
  },
  amountInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  currencySymbol: {
    ...Typography.displaySmall,
    color: Theme.colors.light.primary,
  },
  amountInput: {
    flex: 1,
    ...Typography.displaySmall,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    ...Typography.titleSmall,
    marginBottom: 8,
    color: Theme.colors.light.text,
  },
  submitButton: {
    backgroundColor: Theme.colors.light.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    ...Typography.titleMedium,
    color: "#fff",
  },
  shadow: Shadows.md,
});
