import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { ThemedText } from "@/components/ThemedText";
import { StatusBadge } from "@/components/StatusBadge";
import { useTheme } from "@/hooks/useTheme";
import { BorderRadius, Spacing } from "@/constants/theme";
import { Member, getMembershipStatus, getDaysRemaining } from "@/lib/storage";

interface MemberCardProps {
  member: Member;
  planName: string;
  onPress: () => void;
  onEdit: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function MemberCard({ member, planName, onPress, onEdit }: MemberCardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const status = getMembershipStatus(member.expiryDate);
  const daysRemaining = getDaysRemaining(member.expiryDate);
  const dues = member.totalAmount - member.amountPaid;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const handleEdit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onEdit();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.container,
        { backgroundColor: theme.cardBackground },
        animatedStyle,
      ]}
    >
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
            <ThemedText style={styles.avatarText}>
              {member.name.charAt(0).toUpperCase()}
            </ThemedText>
          </View>
        </View>
        <View style={styles.headerInfo}>
          <ThemedText type="h4" style={styles.name}>
            {member.name}
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {planName}
          </ThemedText>
        </View>
        <Pressable
          onPress={handleEdit}
          hitSlop={8}
          style={({ pressed }) => [
            styles.editButton,
            { backgroundColor: theme.backgroundSecondary, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Feather name="edit-2" size={16} color={theme.primary} />
        </Pressable>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <StatusBadge status={status} />
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {daysRemaining >= 0
              ? `${daysRemaining} days left`
              : `${Math.abs(daysRemaining)} days overdue`}
          </ThemedText>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Feather name="credit-card" size={14} color={theme.textSecondary} />
            <ThemedText type="small" style={{ color: theme.textSecondary, marginLeft: Spacing.xs }}>
              Paid: Rs. {member.amountPaid.toLocaleString()}
            </ThemedText>
          </View>
          {dues > 0 ? (
            <ThemedText type="small" style={{ color: theme.error, fontWeight: "600" }}>
              Due: Rs. {dues.toLocaleString()}
            </ThemedText>
          ) : null}
        </View>
      </View>
    </AnimatedPressable>
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
  avatarContainer: {
    marginRight: Spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    marginBottom: 2,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    height: 1,
    marginVertical: Spacing.md,
  },
  details: {
    gap: Spacing.sm,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
});
