import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import {
  EXPENSE_CATEGORIES,
  type CategoryId,
} from "@/shared/design/categories";
import { Typography } from "@/shared/design/typography";

export interface CategorySelectorProps {
  selectedCategoryId?: CategoryId;
  onSelectCategory: (categoryId: CategoryId) => void;
  excludeCategories?: CategoryId[];
}

/**
 * CATEGORY SELECTOR
 *
 * Selector visual de categorías con emojis.
 * Optimizado para selección rápida en modal.
 */
export function CategorySelector({
  selectedCategoryId,
  onSelectCategory,
  excludeCategories = [],
}: CategorySelectorProps) {
  const categories = Object.values(EXPENSE_CATEGORIES).filter(
    (cat) => !excludeCategories.includes(cat.id),
  );

  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>Categoría</ThemedText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.grid}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => onSelectCategory(category.id)}
            style={[
              styles.categoryButton,
              selectedCategoryId === category.id &&
                styles.categoryButtonSelected,
            ]}
          >
            <View
              style={[
                styles.categoryIcon,
                {
                  backgroundColor:
                    selectedCategoryId === category.id
                      ? category.color
                      : category.colorLight,
                },
              ]}
            >
              <ThemedText
                style={[
                  styles.emoji,
                  {
                    color:
                      selectedCategoryId === category.id
                        ? "#fff"
                        : category.color,
                  },
                ]}
              >
                {category.emoji}
              </ThemedText>
            </View>
            <ThemedText
              style={[
                styles.categoryName,
                selectedCategoryId === category.id &&
                  styles.categoryNameSelected,
              ]}
            >
              {category.name}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    ...Typography.titleSmall,
    marginBottom: 10,
  },
  scrollView: {
    flexGrow: 0,
  },
  grid: {
    flexDirection: "row",
    gap: 12,
    paddingRight: 16,
  },
  categoryButton: {
    alignItems: "center",
    gap: 6,
  },
  categoryButtonSelected: {
    // Visual feedback is in the circle color
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    transition: "background-color 0.2s",
  },
  emoji: {
    fontSize: 28,
    lineHeight: 32,
    paddingTop: 2,
  },
  categoryName: {
    ...Typography.labelSmall,
    maxWidth: 60,
    textAlign: "center",
  },
  categoryNameSelected: {
    fontWeight: "700",
  },
});
