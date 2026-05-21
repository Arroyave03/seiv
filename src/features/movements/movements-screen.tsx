/**
 * MOVEMENTS SCREEN
 *
 * Pantalla de historial completo de transacciones.
 * Características:
 * - Agrupación por fecha
 * - Totales diarios
 * - Búsqueda
 * - Filtros por categoría
 * - Editar/eliminar transacciones
 *
 * Diseño inspirado en Wallet, Revolut, Monzo
 */

import { ThemedText } from "@/components/themed-text";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { Spacing } from "@/constants/theme";
import { ExpenseModal } from "@/features/expenses/expense-modal";
import { useTheme } from "@/hooks/use-theme";
import type { CategoryId } from "@/shared/design/categories";
import { getCategoryEmoji, getCategoryName } from "@/shared/design/categories";
import { Shadows } from "@/shared/design/shadows";
import { Typography } from "@/shared/design/typography";
import { useExpenses } from "@/shared/hooks/financial";
import type { Transaction } from "@/types/finance";
import { formatMoney } from "@/utils/money";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * MOVEMENTS SCREEN
 *
 * Vista principal de transacciones con búsqueda y filtros
 */
export function MovementsScreen() {
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const handleOpenExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const handleCloseExpenseModal = () => {
    setIsExpenseModalVisible(false);
  };

  const theme = useTheme();
  const { expenses, byDate, delete: deleteExpense, restore } = useExpenses();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(
    null,
  );
  const [editingExpense, setEditingExpense] = useState<Transaction | null>(
    null,
  );
  const [showModal, setShowModal] = useState(false);
  const [undoState, setUndoState] = useState<{
    transaction: Transaction;
    timeoutId: ReturnType<typeof setTimeout> | null;
  } | null>(null);

  const handleDelete = (transaction: Transaction) => {
    deleteExpense(transaction.id);

    if (undoState?.timeoutId) {
      clearTimeout(undoState.timeoutId);
    }

    const timeoutId = setTimeout(() => {
      setUndoState(null);
    }, 5000);

    setUndoState({ transaction, timeoutId });
  };

  const handleUndo = () => {
    if (!undoState) return;

    if (undoState.timeoutId) {
      clearTimeout(undoState.timeoutId);
    }

    restore(undoState.transaction);
    setUndoState(null);
  };

  // Filtrar por búsqueda y categoría
  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesSearch = expense.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        !selectedCategory || expense.categoryId === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [expenses, searchQuery, selectedCategory]);

  // Agrupar por fecha los gastos filtrados
  const groupedByDate = useMemo(() => {
    const map = new Map<string, typeof filteredExpenses>();

    filteredExpenses
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .forEach((exp) => {
        const date = new Date(exp.createdAt);
        const dateKey = date.toLocaleDateString("es-CO", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        if (!map.has(dateKey)) {
          map.set(dateKey, []);
        }
        map.get(dateKey)!.push(exp);
      });

    return Array.from(map.entries());
  }, [filteredExpenses]);

  // Categorías únicas en gastos
  const uniqueCategories = useMemo(() => {
    const categories = new Set(expenses.map((e) => e.categoryId));
    return Array.from(categories);
  }, [expenses]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.title}>Movimientos</ThemedText>
        </View>

        {/* Search */}
        <View style={styles.searchSection}>
          <View
            style={[
              styles.searchInput,
              {
                backgroundColor: theme.backgroundElement,
                borderColor: theme.border,
              },
            ]}
          >
            <ThemedText style={styles.searchIcon}>🔍</ThemedText>
            <TextInput
              placeholder="Buscar transacción..."
              placeholderTextColor={theme.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={[styles.input, { color: theme.text }]}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <ThemedText style={styles.clearIcon}>✕</ThemedText>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Category Filter */}
        {uniqueCategories.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
            contentContainerStyle={styles.categoriesContent}
          >
            <TouchableOpacity
              onPress={() => setSelectedCategory(null)}
              style={[
                styles.categoryTag,
                {
                  backgroundColor:
                    selectedCategory === null
                      ? theme.accent
                      : theme.surfaceSecondary,
                },
              ]}
            >
              <ThemedText
                style={[
                  styles.categoryTagText,
                  {
                    color: selectedCategory === null ? "#fff" : theme.text,
                  },
                ]}
              >
                Todo
              </ThemedText>
            </TouchableOpacity>

            {uniqueCategories.map((categoryId) => (
              <TouchableOpacity
                key={categoryId}
                onPress={() => setSelectedCategory(categoryId)}
                style={[
                  styles.categoryTag,
                  {
                    backgroundColor:
                      selectedCategory === categoryId
                        ? theme.accent
                        : theme.surfaceSecondary,
                  },
                ]}
              >
                <ThemedText style={styles.categoryTagEmoji}>
                  {getCategoryEmoji(categoryId)}
                </ThemedText>
                <ThemedText
                  style={[
                    styles.categoryTagText,
                    {
                      color:
                        selectedCategory === categoryId ? "#fff" : theme.text,
                    },
                  ]}
                >
                  {getCategoryName(categoryId)}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Transactions List */}
        {groupedByDate.length > 0 ? (
          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {groupedByDate.map(([dateKey, dayExpenses]) => {
              const dailyTotal = dayExpenses.reduce(
                (sum, exp) => sum + exp.amount,
                0,
              );

              return (
                <View key={dateKey} style={styles.daySection}>
                  {/* Fecha + Total */}
                  <View style={styles.dayHeader}>
                    <ThemedText
                      style={[styles.dayDate, { color: theme.textSecondary }]}
                    >
                      {dateKey}
                    </ThemedText>
                    <ThemedText
                      style={[styles.dayTotal, { color: theme.danger }]}
                    >
                      -{formatMoney(dailyTotal)}
                    </ThemedText>
                  </View>

                  {/* Transacciones del día */}
                  <View
                    style={[
                      styles.dayTransactions,
                      { backgroundColor: theme.backgroundElement },
                      Shadows.xs,
                    ]}
                  >
                    {dayExpenses.map((expense, index) => (
                      <View
                        key={expense.id}
                        style={[
                          styles.transactionRow,
                          index < dayExpenses.length - 1 &&
                            styles.transactionRowBorder,
                          { borderColor: theme.border },
                        ]}
                      >
                        <View style={styles.transactionLeft}>
                          <ThemedText style={styles.emoji}>
                            {getCategoryEmoji(expense.categoryId)}
                          </ThemedText>
                          <View style={styles.transactionInfo}>
                            <ThemedText
                              style={[
                                styles.transactionTitle,
                                { color: theme.text },
                              ]}
                              numberOfLines={1}
                            >
                              {expense.title}
                            </ThemedText>
                            <ThemedText
                              style={[
                                styles.transactionTime,
                                { color: theme.textSecondary },
                              ]}
                            >
                              {new Date(expense.createdAt).toLocaleTimeString(
                                "es-CO",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </ThemedText>
                          </View>
                        </View>

                        {/* Amount + Actions */}
                        <View style={styles.transactionRight}>
                          <ThemedText
                            style={[
                              styles.transactionAmount,
                              { color: theme.danger },
                            ]}
                          >
                            -{formatMoney(expense.amount)}
                          </ThemedText>
                          <View style={styles.actionButtons}>
                            <TouchableOpacity
                              onPress={() => {
                                setEditingExpense(expense);
                                setShowModal(true);
                              }}
                              hitSlop={8}
                            >
                              <ThemedText style={styles.actionButton}>
                                ✏️
                              </ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => handleDelete(expense)}
                              hitSlop={8}
                            >
                              <ThemedText style={styles.actionButton}>
                                🗑
                              </ThemedText>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              );
            })}
          </ScrollView>
        ) : (
          <View style={styles.emptyState}>
            <ThemedText
              style={[styles.emptyText, { color: theme.textSecondary }]}
            >
              {searchQuery || selectedCategory
                ? "Sin movimientos con estos filtros"
                : "Sin movimientos aún"}
            </ThemedText>
          </View>
        )}
      </SafeAreaView>

      {/* Modal para editar/crear gasto */}
      <ExpenseModal
        visible={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingExpense(null);
        }}
        editingExpense={editingExpense || undefined}
      />

      {undoState && (
        <View
          style={[
            styles.undoBar,
            {
              backgroundColor: theme.backgroundElement,
              borderColor: theme.border,
            },
            Shadows.md,
          ]}
        >
          <ThemedText style={[styles.undoText, { color: theme.text }]}>
            Movimiento eliminado
          </ThemedText>
          <TouchableOpacity onPress={handleUndo} hitSlop={8}>
            <ThemedText style={[styles.undoAction, { color: theme.accent }]}>
              Deshacer
            </ThemedText>
          </TouchableOpacity>
        </View>
      )}
      <FloatingActionButton onPress={handleOpenExpenseModal} />

      <ExpenseModal
        visible={isExpenseModalVisible}
        onClose={handleCloseExpenseModal}
      />
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
  header: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
  },
  title: {
    ...Typography.headlineLarge,
  },
  searchSection: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
  },
  searchInput: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 12,
    borderWidth: 1,
    gap: Spacing.two,
  },
  searchIcon: {
    fontSize: 20,
  },
  input: {
    flex: 1,
    ...Typography.titleLarge,
    padding: 0,
  },
  clearIcon: {
    fontSize: 18,
  },
  categoriesScroll: {
    flexGrow: 0,
    marginBottom: Spacing.three,
  },
  categoriesContent: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
  categoryTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: 20,
    gap: Spacing.one,
  },
  categoryTagEmoji: {
    fontSize: 18,
  },
  categoryTagText: {
    ...Typography.bodyMedium,
    ...Typography.labelSmall,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    gap: Spacing.four,
  },
  daySection: {
    gap: Spacing.two,
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dayDate: {
    ...Typography.bodySmall,
  },
  dayTotal: {
    ...Typography.bodyMedium,
    fontWeight: "600",
  },
  dayTransactions: {
    borderRadius: 12,
    overflow: "hidden",
  },
  transactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    gap: Spacing.two,
  },
  transactionRowBorder: {
    borderBottomWidth: 1,
  },
  transactionLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  emoji: {
    fontSize: 22,
    marginRight: Spacing.two,
  },
  transactionInfo: {
    flex: 1,
    gap: Spacing.one,
  },
  transactionTitle: {
    ...Typography.bodyMedium,
    fontWeight: "600",
  },
  transactionTime: {
    ...Typography.bodySmall,
    color: "#999",
  },
  transactionRight: {
    alignItems: "flex-end",
    gap: Spacing.two,
  },
  transactionAmount: {
    ...Typography.bodyLarge,
    fontWeight: "700",
  },
  actionButtons: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  actionButton: {
    fontSize: 22,
    marginHorizontal: Spacing.two,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    ...Typography.bodyLarge,
  },
  undoBar: {
    position: "absolute",
    left: Spacing.four,
    right: Spacing.four,
    bottom: Spacing.four,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  undoText: {
    ...Typography.bodyMedium,
  },
  undoAction: {
    ...Typography.titleSmall,
    fontWeight: "700",
  },
});
