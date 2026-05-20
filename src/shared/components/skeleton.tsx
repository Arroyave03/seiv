/**
 * SKELETON LOADER
 *
 * Componente de placeholder animado que aparece mientras se carga data.
 * Mejor UX que un spinner genérico.
 */

import React, { useEffect } from "react";
import { Animated, StyleSheet, View } from "react-native";

import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Shadows } from "@/shared/design/shadows";

export interface SkeletonProps {
  width?: number | string;
  height: number | string;
  borderRadius?: number;
  style?: object;
  animated?: boolean;
}

/**
 * SKELETON
 *
 * Componente skeleton reutilizable con pulso opcional
 */
export function Skeleton({
  width = "100%",
  height,
  borderRadius = 8,
  style,
  animated = true,
}: SkeletonProps) {
  const theme = useTheme();
  const opacity = React.useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    if (!animated) return;

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [animated, opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          backgroundColor: theme.border,
          borderRadius,
          opacity: animated ? opacity : 1,
        },
        style,
      ]}
    />
  );
}

/**
 * DASHBOARD SKELETON
 *
 * Loader skeleton para el dashboard
 */
export function DashboardSkeleton() {
  const theme = useTheme();

  return (
    <View style={{ gap: Spacing.four, paddingHorizontal: Spacing.four }}>
      {/* Header */}
      <View style={{ gap: Spacing.one }}>
        <Skeleton height={16} width="40%" />
        <Skeleton height={12} width="20%" />
      </View>

      {/* Balance Card */}
      <View
        style={[
          styles.card,
          { backgroundColor: theme.backgroundElement },
          Shadows.md,
        ]}
      >
        <Skeleton
          height={14}
          width="30%"
          style={{ marginBottom: Spacing.two }}
        />
        <Skeleton
          height={40}
          width="80%"
          style={{ marginBottom: Spacing.two }}
        />
        <Skeleton height={12} width="50%" />
      </View>

      {/* Metrics Grid */}
      <View
        style={{ flexDirection: "row", gap: Spacing.two, flexWrap: "wrap" }}
      >
        {[1, 2, 3, 4].map((i) => (
          <View
            key={i}
            style={[
              styles.metricSkeleton,
              { backgroundColor: theme.backgroundElement },
              Shadows.xs,
            ]}
          >
            <Skeleton
              height={12}
              width="60%"
              style={{ marginBottom: Spacing.one }}
            />
            <Skeleton height={20} width="70%" />
          </View>
        ))}
      </View>

      {/* Recent Transactions */}
      <View
        style={[
          styles.card,
          { backgroundColor: theme.backgroundElement },
          Shadows.xs,
        ]}
      >
        {[1, 2, 3].map((i) => (
          <View
            key={i}
            style={[
              styles.transactionSkeleton,
              { borderBottomColor: theme.border, borderBottomWidth: 1 },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Skeleton
                height={14}
                width="60%"
                style={{ marginBottom: Spacing.one }}
              />
              <Skeleton height={12} width="40%" />
            </View>
            <Skeleton height={14} width="30%" />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    overflow: "hidden",
  },
  card: {
    borderRadius: 16,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  metricSkeleton: {
    flex: 1,
    minWidth: "45%",
    borderRadius: 12,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  transactionSkeleton: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
  },
});
