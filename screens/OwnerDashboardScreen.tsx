import React, { useState, useCallback } from "react";
import { View, StyleSheet, FlatList, Pressable, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { ThemedText } from "@/components/ThemedText";
import { MemberCard } from "@/components/MemberCard";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { Member, MembershipPlan, getMembers, getPlans } from "@/lib/storage";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function OwnerDashboardScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();

  const [members, setMembers] = useState<Member[]>([]);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const [membersData, plansData] = await Promise.all([
      getMembers(),
      getPlans(),
    ]);
    setMembers(membersData);
    setPlans(plansData);
    setIsLoading(false);
    setIsRefreshing(false);
  }, []);

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

  const getPlanName = (planId: string) => {
    const plan = plans.find((p) => p.id === planId);
    return plan ? plan.name : "Unknown Plan";
  };

  const handleAddMember = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("AddMember");
  };

  const handleEditMember = (member: Member) => {
    navigation.navigate("EditMember", { memberId: member.id });
  };

  const handleViewMember = (member: Member) => {
    navigation.navigate("MemberDetail", { memberId: member.id });
  };

  const renderMember = ({ item, index }: { item: Member; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 50).springify()}>
      <MemberCard
        member={item}
        planName={getPlanName(item.planId)}
        onPress={() => handleViewMember(item)}
        onEdit={() => handleEditMember(item)}
      />
    </Animated.View>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
        <LoadingSpinner message="Loading members..." />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        renderItem={renderMember}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingTop: headerHeight + Spacing.lg,
            paddingBottom: insets.bottom + Spacing["5xl"],
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
        ListEmptyComponent={
          <EmptyState
            title="No Members Yet"
            message="Start building your fitness empire by adding your first gym member."
          />
        }
        ListHeaderComponent={
          members.length > 0 ? (
            <View style={styles.statsContainer}>
              <View style={[styles.statCard, { backgroundColor: theme.cardBackground }]}>
                <ThemedText type="hero" style={{ color: theme.primary }}>
                  {members.length}
                </ThemedText>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  Total Members
                </ThemedText>
              </View>
              <View style={[styles.statCard, { backgroundColor: theme.cardBackground }]}>
                <ThemedText type="hero" style={{ color: theme.success }}>
                  {members.filter((m) => {
                    const expiry = new Date(m.expiryDate);
                    return expiry > new Date();
                  }).length}
                </ThemedText>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  Active
                </ThemedText>
              </View>
            </View>
          ) : null
        }
      />

      <Pressable
        onPress={handleAddMember}
        style={({ pressed }) => [
          styles.fab,
          {
            backgroundColor: theme.primary,
            bottom: insets.bottom + Spacing.xl,
            opacity: pressed ? 0.9 : 1,
            transform: [{ scale: pressed ? 0.95 : 1 }],
          },
        ]}
      >
        <Feather name="user-plus" size={24} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    flexGrow: 1,
  },
  statsContainer: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    right: Spacing.xl,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
