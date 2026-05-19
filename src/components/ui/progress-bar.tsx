import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { clamp } from "@/utils/money";

type ProgressBarProps = {
  value: number;
  label?: string;
};

export function ProgressBar({ value, label }: ProgressBarProps) {
  const theme = useTheme();
  const progress = clamp(value, 0, 1);

  return (
    <View style={styles.wrapper}>
      {label ? (
        <View style={styles.labelRow}>
          <ThemedText type="smallBold">{label}</ThemedText>
          <ThemedText themeColor="textSecondary" type="small">
            {Math.round(progress * 100)}%
          </ThemedText>
        </View>
      ) : null}
      <View
        style={[styles.track, { backgroundColor: theme.backgroundSelected }]}
      >
        <View
          style={[
            styles.fill,
            { backgroundColor: theme.accent, width: `${progress * 100}%` },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.one,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  track: {
    width: "100%",
    height: 12,
    borderRadius: Radius.pill,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: Radius.pill,
  },
});
