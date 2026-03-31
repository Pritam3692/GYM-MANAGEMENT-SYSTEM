import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { BorderRadius, Spacing } from "@/constants/theme";

interface StatusBadgeProps {
  status: "active" | "expiring" | "expired";
  size?: "small" | "large";
}

export function StatusBadge({ status, size = "small" }: StatusBadgeProps) {
  const { theme } = useTheme();

  const getStatusConfig = () => {
    switch (status) {
      case "active":
        return {
          color: theme.success,
          label: "Active",
          icon: "check-circle" as const,
        };
      case "expiring":
        return {
          color: theme.warning,
          label: "Expiring Soon",
          icon: "clock" as const,
        };
      case "expired":
        return {
          color: theme.error,
          label: "Expired",
          icon: "x-circle" as const,
        };
    }
  };

  const config = getStatusConfig();
  const isLarge = size === "large";

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: `${config.color}20`,
          paddingHorizontal: isLarge ? Spacing.lg : Spacing.sm,
          paddingVertical: isLarge ? Spacing.sm : Spacing.xs,
        },
      ]}
    >
      <Feather
        name={config.icon}
        size={isLarge ? 18 : 14}
        color={config.color}
      />
      <ThemedText
        style={[
          styles.label,
          {
            color: config.color,
            fontSize: isLarge ? 14 : 12,
            marginLeft: isLarge ? Spacing.sm : Spacing.xs,
          },
        ]}
      >
        {config.label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.full,
  },
  label: {
    fontWeight: "600",
  },
});
