/**
 * EXPENSE MODAL
 *
 * Modal ultra-rápido para:
 * - Crear gasto
 * - Editar gasto
 * - Soporte CRUD completo
 *
 * UX ultra-minimalista:
 * - Monto enfocado (teclado abierto)
 * - Categorías visibles (swipe)
 * - 3 segundos máximo
 *
 * Optimizaciones:
 * - Auto-focus en monto
 * - Categoría preseleccionada
 * - Descripción es requerida
 * - Nota es opcional
 */

import React, { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Colors, Spacing } from "@/constants/theme";
import { CategorySelector } from "@/shared/components/category-selector";
import { Input } from "@/shared/components/input";
import type { CategoryId } from "@/shared/design/categories";
import { getCategoryEmoji } from "@/shared/design/categories";
import { Shadows } from "@/shared/design/shadows";
import { Typography } from "@/shared/design/typography";
import { useFinanceStore } from "@/shared/store/finance";
import type { Transaction } from "@/types/finance";
import { Modal } from "../../shared/components/modal";

export interface ExpenseModalProps {
  visible: boolean;
  onClose: () => void;
  editingExpense?: Transaction; // Si existe, es modo edición
}

/**
 * EXPENSE MODAL
 *
 * Componente ultra-rápido para crear/editar gastos
 */
export function ExpenseModal({
  visible,
  onClose,
  editingExpense,
}: ExpenseModalProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>("food");
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const addTransaction = useFinanceStore((state) => state.addTransaction);
  const updateTransaction = useFinanceStore((state) => state.updateTransaction);

  // Cargar datos si estamos editando
  useEffect(() => {
    if (editingExpense && visible) {
      setAmount(editingExpense.amount.toString());
      setDescription(editingExpense.title);
      setSelectedCategory(editingExpense.categoryId);
      setNote(editingExpense.note || "");
    } else if (visible) {
      // Limpiar si es nuevo gasto
      setAmount("");
      setDescription("");
      setSelectedCategory("food");
      setNote("");
    }
  }, [visible, editingExpense]);

  const isValid = amount && selectedCategory && description;

  const handleSave = async () => {
    if (!isValid || isLoading) return;

    setIsLoading(true);
    try {
      const numAmount = parseFloat(amount);

      if (editingExpense) {
        // Editar gasto existente
        await updateTransaction(editingExpense.id, {
          title: description,
          amount: numAmount,
          categoryId: selectedCategory,
          note: note || undefined,
        });
      } else {
        // Crear nuevo gasto
        await addTransaction(
          description,
          numAmount,
          selectedCategory,
          "expense",
          note || undefined,
        );
      }

      // Limpiar y cerrar
      setAmount("");
      setDescription("");
      setSelectedCategory("food");
      setNote("");
      onClose();
    } catch (error) {
      console.error("Error saving expense:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const title = editingExpense ? "Editar gasto" : "Nuevo gasto";
  const buttonText = editingExpense ? "Actualizar" : "Guardar";

  return (
    <Modal visible={visible} onClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <ThemedText style={styles.title}>{title}</ThemedText>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <ThemedText style={styles.closeButton}>✕</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Amount Input - ENFOCADO */}
          <View style={styles.amountSection}>
            <View style={styles.amountInputWrapper}>
              <ThemedText style={styles.currencySymbol}>$</ThemedText>
              <Input
                placeholder="0"
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
                style={styles.amountInput}
                autoFocus
                editable={!isLoading}
                placeholderTextColor={Colors.light.accent + "40"}
              />
            </View>
            {selectedCategory && (
              <ThemedText style={styles.selectedCategory}>
                {getCategoryEmoji(selectedCategory)} {selectedCategory}
              </ThemedText>
            )}
          </View>

          {/* Description Input - REQUERIDO */}
          <View style={styles.section}>
            <ThemedText style={styles.label}>Descripción *</ThemedText>
            <Input
              placeholder="Ej. Almuerzo en restaurante"
              value={description}
              onChangeText={setDescription}
              placeholderTextColor={Colors.light.textSecondary}
              editable={!isLoading}
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
            onPress={handleSave}
            disabled={!isValid || isLoading}
            style={[
              styles.submitButton,
              !isValid || isLoading
                ? styles.submitButtonDisabled
                : styles.submitButtonEnabled,
              Shadows.md,
            ]}
          >
            <ThemedText style={styles.submitButtonText}>
              {isLoading ? "Guardando..." : buttonText}
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
    paddingBottom: Spacing.four,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.four,
  },
  title: {
    ...Typography.headlineSmall,
  },
  closeButton: {
    fontSize: 24,
    color: Colors.light.textSecondary,
  },
  amountSection: {
    marginBottom: Spacing.four,
    gap: Spacing.two,
  },
  amountInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  currencySymbol: {
    ...Typography.headlineSmall,
    color: Colors.light.accent,
    fontWeight: "700",
  },
  amountInput: {
    flex: 1,
    ...Typography.displaySmall,
    fontWeight: "700",
    color: Colors.light.accent,
  },
  selectedCategory: {
    ...Typography.labelSmall,
    color: Colors.light.textSecondary,
  },
  section: {
    marginBottom: Spacing.three,
  },
  label: {
    ...Typography.titleSmall,
    marginBottom: Spacing.one,
    color: Colors.light.text,
  },
  submitButton: {
    borderRadius: 12,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    alignItems: "center",
    marginTop: Spacing.two,
  },
  submitButtonEnabled: {
    backgroundColor: Colors.light.accent,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.light.accent,
    opacity: 0.5,
  },
  submitButtonText: {
    ...Typography.titleMedium,
    color: "#fff",
  },
});
