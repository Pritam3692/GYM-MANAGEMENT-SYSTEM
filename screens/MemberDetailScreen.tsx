import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useRoute, RouteProp } from "@react-navigation/native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { StatusBadge } from "@/components/StatusBadge";
import { InfoCard } from "@/components/InfoCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import {
  Member,
  MembershipPlan,
  getMember,
  getPlans,
  getMembershipStatus,
  getDaysRemaining,
} from "@/lib/storage";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type MemberDetailRouteProp = RouteProp<RootStackParamList, "MemberDetail">;

export default function MemberDetailScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const route = useRoute<MemberDetailRouteProp>();
  const { theme } = useTheme();

  const { memberId } = route.params;

  const [member, setMember] = useState<Member | null>(null);
  const [plan, setPlan] = useState<MembershipPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [memberId]);

  const loadData = async () => {
    const [memberData, plansData] = await Promise.all([
      getMember(memberId),
      getPlans(),
    ]);

    setMember(memberData);
    if (memberData) {
      const memberPlan = plansData.find((p) => p.id === memberData.planId);
      setPlan(memberPlan || null);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
        <LoadingSpinner message="Loading member details..." />
      </View>
    );
  }

  if (!member) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.backgroundRoot }]}>
        <ThemedText type="h3">Member Not Found</ThemedText>
      </View>
    );
  }

  const status = getMembershipStatus(member.expiryDate);
  const daysRemaining = getDaysRemaining(member.expiryDate);
  const dues = member.totalAmount - member.amountPaid;
  const startDate = new Date(member.startDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
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
        <ThemedText type="body" style={{ color: theme.textSecondary }}>
          {member.email}
        </ThemedText>
        <ThemedText type="small" style={{ color: theme.textSecondary, marginTop: Spacing.xs }}>
          {member.phone}
        </ThemedText>
        <View style={styles.statusContainer}>
          <StatusBadge status={status} size="large" />
        </View>
        <ThemedText
          type="h4"
          style={{
            color:
              status === "active"
                ? theme.success
                : status === "expiring"
                ? theme.warning
                : theme.error,
          }}
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
        <Animated.View entering={FadeInDown.delay(150).springify()}>
          <InfoCard
            icon="award"
            label="Plan"
            value={plan?.name || "Unknown"}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <InfoCard
            icon="play-circle"
            label="Started On"
            value={startDate}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(250).springify()}>
          <InfoCard
            icon="calendar"
            label="Expires On"
            value={expiryDate}
          />
        </Animated.View>
      </View>

      <Animated.View entering={FadeInDown.delay(300).springify()}>
        <ThemedText type="h4" style={styles.sectionTitle}>
          Payment Details
        </ThemedText>
      </Animated.View>

      <View style={styles.infoGrid}>
        <Animated.View entering={FadeInDown.delay(350).springify()}>
          <InfoCard
            icon="dollar-sign"
            label="Total Amount"
            value={`Rs. ${member.totalAmount.toLocaleString()}`}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).springify()}>
          <InfoCard
            icon="check-circle"
            label="Amount Paid"
            value={`Rs. ${member.amountPaid.toLocaleString()}`}
            valueColor={theme.success}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(450).springify()}>
          <InfoCard
            icon="alert-circle"
            label="Dues Remaining"
            value={dues > 0 ? `Rs. ${dues.toLocaleString()}` : "Fully Paid"}
            valueColor={dues > 0 ? theme.error : theme.success}
          />
        </Animated.View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: Spacing.lg,
    flexGrow: 1,
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
  statusContainer: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  infoGrid: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
});
