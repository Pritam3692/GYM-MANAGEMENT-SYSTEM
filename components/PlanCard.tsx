import React, { useState } from "react";
import { View, StyleSheet, TextInput, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { BorderRadius, Spacing } from "@/constants/theme";
import { MembershipPlan } from "@/lib/storage";

interface PlanCardProps {
  plan: MembershipPlan;
  onSave: (plan: MembershipPlan) => void;
}

export function PlanCard({ plan, onSave }: PlanCardProps) {
  const { theme } = useTheme();
  const [price, setPrice] = useState(plan.price.toString());
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    const newPrice = parseInt(price, 10);
    if (!isNaN(newPrice) && newPrice > 0) {
      onSave({ ...plan, price: newPrice });
      setIsEditing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.cardBackground }]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${theme.primary}20` }]}>
          <Feather name="calendar" size={20} color={theme.primary} />
        </View>
        <View style={styles.headerText}>
          <ThemedText type="h4">{plan.name}</ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {plan.durationMonths} {plan.durationMonths === 1 ? "month" : "months"} membership
          </ThemedText>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <View style={styles.priceRow}>
        <ThemedText type="body" style={{ color: theme.textSecondary }}>
          Price
        </ThemedText>
        <View style={styles.priceInput}>
          <ThemedText type="body" style={{ marginRight: Spacing.xs }}>
            Rs.
          </ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.backgroundSecondary,
                color: theme.text,
                borderColor: isEditing ? theme.primary : "transparent",
              },
            ]}
            value={price}
            onChangeText={(text) => {
              setPrice(text.replace(/[^0-9]/g, ""));
              setIsEditing(true);
            }}
            keyboardType="numeric"
            selectTextOnFocus
          />
          {isEditing ? (
            <Pressable
              onPress={handleSave}
              style={({ pressed }) => [
                styles.saveButton,
                { backgroundColor: theme.primary, opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Feather name="check" size={16} color="#FFFFFF" />
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  headerText: {
    flex: 1,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.md,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priceInput: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    width: 100,
    height: 40,
    borderRadius: BorderRadius.xs,
    paddingHorizontal: Spacing.md,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "right",
    borderWidth: 2,
  },
  saveButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Spacing.sm,
  },
});
