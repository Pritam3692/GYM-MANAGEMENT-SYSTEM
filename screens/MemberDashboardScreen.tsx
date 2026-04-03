import React, { useState, useCallback } from "react";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useFocusEffect } from "@react-navigation/native";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { ThemedText } from "@/components/ThemedText";
import { StatusBadge } from "@/components/StatusBadge";
import { InfoCard } from "@/components/InfoCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/context/AuthContext";
import { Spacing, BorderRadius } from "@/constants/theme";
import {
  Member,
  MembershipPlan,
  getMember,
  getPlans,
  getMembershipStatus,
  getDaysRemaining,
} from "@/lib/storage";

export default function MemberDashboardScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { user } = useAuth();

  const [member, setMember] = useState<Member | null>(null);
  const [plan, setPlan] = useState<MembershipPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    if (!user?.memberId) {
      setIsLoading(false);
      return;
    }

    const [memberData, plansData] = await Promise.all([
      getMember(user.memberId),
      getPlans(),
    ]);

    setMember(memberData);
    if (memberData) {
      const memberPlan = plansData.find((p) => p.id === memberData.planId);
      setPlan(memberPlan || null);
    }
    setIsLoading(false);
    setIsRefreshing(false);
  }, [user?.memberId]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await loadData();
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
        <LoadingSpinner message="Loading your membership..." />
      </View>
    );
  }

  if (!member) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
        <View style={styles.centered}>
          <ThemedText type="h3">Member Not Found</ThemedText>
          <ThemedText type="body" style={{ color: theme.textSecondary, marginTop: Spacing.sm }}>
            Please contact the gym owner for assistance.
          </ThemedText>
        </View>
      </View>
    );
  }

  const status = getMembershipStatus(member.expiryDate);
  const daysRemaining = getDaysRemaining(member.expiryDate);
  const dues = member.totalAmount - member.amountPaid;
  const expiryDate = new Date(member.expiryDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: headerHeight + Spacing.lg,
          paddingBottom: insets.bottom + Spacing.xl,
        },
      ]}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          tintColor={theme.primary}
          colors={[theme.primary]}
        />
      }
    >
      <Animated.View
        entering={FadeInDown.delay(0).springify()}
        style={[styles.heroCard, { backgroundColor: theme.cardBackground }]}
      >
        <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
          <ThemedText style={styles.avatarText}>
            {member.name.charAt(0).toUpperCase()}
          </ThemedText>
        </View>
        <ThemedText type="h1" style={styles.memberName}>
          {member.name}
        </ThemedText>
        <ThemedText type="body" style={{ color: theme.textSecondary, marginBottom: Spacing.lg }}>
          {member.email}
        </ThemedText>
        <StatusBadge status={status} size="large" />
        <ThemedText
          type="h4"
          style={[
            styles.daysText,
            {
              color:
                status === "active"
                  ? theme.success
                  : status === "expiring"
                  ? theme.warning
                  : theme.error,
            },
          ]}
        >
          {daysRemaining >= 0
            ? `${daysRemaining} days remaining`
            : `Expired ${Math.abs(daysRemaining)} days ago`}
        </ThemedText>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(100).springify()}>
        <ThemedText type="h4" style={styles.sectionTitle}>
          Membership Details
        </ThemedText>
      </Animated.View>

      <View style={styles.infoGrid}>
        <Animated.View entering={FadeInDown.delay(150).springify()} style={styles.infoItem}>
          <InfoCard
            icon="calendar"
            label="Plan"
            value={plan?.name || "Unknown"}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.infoItem}>
          <InfoCard
            icon="clock"
            label="Expires On"
            value={expiryDate}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(250).springify()} style={styles.infoItem}>
          <InfoCard
            icon="check-circle"
            label="Amount Paid"
            value={`Rs. ${member.amountPaid.toLocaleString()}`}
            valueColor={theme.success}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.infoItem}>
          <InfoCard
            icon="alert-circle"
            label="Dues Remaining"
            value={dues > 0 ? `Rs. ${dues.toLocaleString()}` : "Fully Paid"}
            valueColor={dues > 0 ? theme.error : theme.success}
          />
        </Animated.View>
      </View>

      <Animated.View
        entering={FadeInDown.delay(350).springify()}
        style={[styles.totalCard, { backgroundColor: theme.cardBackground }]}
      >
        <View style={styles.totalRow}>
          <ThemedText type="body" style={{ color: theme.textSecondary }}>
            Total Membership Fee
          </ThemedText>
          <ThemedText type="h3">Rs. {member.totalAmount.toLocaleString()}</ThemedText>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xl,
  },
  heroCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "700",
  },
  memberName: {
    marginBottom: Spacing.xs,
  },
  daysText: {
    marginTop: Spacing.md,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  infoGrid: {
    gap: Spacing.md,
  },
  infoItem: {
    marginBottom: 0,
  },
  totalCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.xl,
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
