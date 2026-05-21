/**
 * EXPENSE MODAL
 *
 * Versión corregida:
 * - Usa TextInput nativo para debug
 * - Fondo visible
 * - Mejor validación
 * - Logs de debug
 * - Modal compatible
 */

import React, { useEffect, useState } from "react";

import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { CategorySelector } from "@/shared/components/category-selector";
import type { CategoryId } from "@/shared/design/categories";
import { getCategoryEmoji } from "@/shared/design/categories";
import { Shadows } from "@/shared/design/shadows";
import { Typography } from "@/shared/design/typography";
import { useFinanceStore } from "@/shared/store/finance";
import type { Transaction } from "@/types/finance";

export interface ExpenseModalProps {
  visible: boolean;
  onClose: () => void;
  editingExpense?: Transaction;
}

export function ExpenseModal({
  visible,
  onClose,
  editingExpense,
}: ExpenseModalProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>("food");
  const [isLoading, setIsLoading] = useState(false);

  const addTransaction = useFinanceStore((state) => state.addTransaction);

  const updateTransaction = useFinanceStore((state) => state.updateTransaction);

  /**
   * FORMATEAR MONTO
   * 10000 -> 10.000
   */
  const formatAmountInput = (text: string) => {
    const digits = text.replace(/\D/g, "");

    if (!digits) return "";

    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  /**
   * PARSEAR MONTO
   * 10.000 -> 10000
   */
  const parseAmount = (formatted: string) => {
    if (!formatted) return 0;

    return Number(formatted.replace(/\./g, ""));
  };

  /**
   * CARGAR DATOS EN EDICIÓN
   */
  useEffect(() => {
    if (editingExpense && visible) {
      setAmount(formatAmountInput(editingExpense.amount.toString()));
      setDescription(editingExpense.title);
      setSelectedCategory(editingExpense.categoryId);
    } else if (visible) {
      setAmount("");
      setDescription("");
      setSelectedCategory("food");
    }
  }, [visible, editingExpense]);

  const parsedAmount = parseAmount(amount);

  const isValid = parsedAmount > 0 && description.trim().length > 0;

  /**
   * DEBUG
   */
  console.log({
    amount,
    parsedAmount,
    description,
    selectedCategory,
    isValid,
  });

  /**
   * GUARDAR
   */
  const handleSave = async () => {
    if (!isValid || isLoading) {
      console.log("Formulario inválido");
      return;
    }

    setIsLoading(true);

    try {
      const numAmount = parseAmount(amount);

      if (editingExpense) {
        await updateTransaction(editingExpense.id, {
          title: description,
          amount: numAmount,
          categoryId: selectedCategory,
        });
      } else {
        await addTransaction(
          description,
          numAmount,
          selectedCategory,
          "expense",
        );
      }

      console.log("Gasto guardado correctamente");

      // Limpiar
      setAmount("");
      setDescription("");
      setSelectedCategory("food");
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
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardContainer}
        >
          <View style={styles.modalContainer}>
            <ScrollView
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* HEADER */}
              <View style={styles.header}>
                <ThemedText style={styles.title}>{title}</ThemedText>

                <TouchableOpacity onPress={onClose} hitSlop={10}>
                  <ThemedText style={styles.closeButton}>✕</ThemedText>
                </TouchableOpacity>
              </View>

              {/* MONTO */}
              <View style={styles.amountSection}>
                <View style={styles.amountInputWrapper}>
                  <ThemedText style={styles.currencySymbol}>$</ThemedText>

                  <TextInput
                    placeholder="0"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={(text) => setAmount(formatAmountInput(text))}
                    autoFocus
                    editable={!isLoading}
                    placeholderTextColor="#999"
                    style={styles.amountInput}
                  />
                </View>

                <ThemedText style={styles.selectedCategory}>
                  {getCategoryEmoji(selectedCategory)} {selectedCategory}
                </ThemedText>
              </View>

              {/* DESCRIPCIÓN */}
              <View style={styles.section}>
                <ThemedText style={styles.label}>Descripción *</ThemedText>

                <TextInput
                  placeholder="Ej. Almuerzo"
                  value={description}
                  onChangeText={setDescription}
                  editable={!isLoading}
                  placeholderTextColor="#999"
                  style={styles.input}
                />
              </View>

              {/* CATEGORÍAS */}
              <View style={styles.section}>
                <CategorySelector
                  selectedCategoryId={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  excludeCategories={["income"]}
                />
              </View>

              {/* BOTÓN */}
              <TouchableOpacity
                onPress={handleSave}
                disabled={!isValid || isLoading}
                style={[
                  styles.submitButton,
                  isValid
                    ? styles.submitButtonEnabled
                    : styles.submitButtonDisabled,
                ]}
              >
                <ThemedText style={styles.submitButtonText}>
                  {isLoading ? "Guardando..." : buttonText}
                </ThemedText>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },

  keyboardContainer: {
    width: "100%",
    justifyContent: "flex-end",
  },

  modalContainer: {
    backgroundColor: "#0B1120",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 5,
    minHeight: "45%",
  },

  content: {
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  title: {
    ...Typography.headlineSmall,
    fontWeight: "700",
  },

  closeButton: {
    fontSize: 24,
    color: "#999",
  },

  amountSection: {
    marginBottom: 24,
  },

  amountInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  currencySymbol: {
    fontSize: 42,
    fontWeight: "700",
    color: Colors.light.accent,
  },

  amountInput: {
    flex: 1,
    fontSize: 42,
    fontWeight: "700",
    color: Colors.light.accent,
    paddingVertical: 12,
  },

  selectedCategory: {
    marginTop: 8,
    color: "#666",
    fontSize: 14,
  },

  section: {
    marginBottom: 20,
  },

  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "600",
  },

  input: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#111",
  },

  submitButton: {
    marginTop: 12,
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
    ...Shadows.md,
  },

  submitButtonEnabled: {
    backgroundColor: Colors.light.accent,
  },

  submitButtonDisabled: {
    backgroundColor: "#CCC",
  },

  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
