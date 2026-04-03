import React, { useState, useCallback } from "react";
import { View, StyleSheet, FlatList, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useFocusEffect } from "@react-navigation/native";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { ThemedText } from "@/components/ThemedText";
import { PlanCard } from "@/components/PlanCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useTheme } from "@/hooks/useTheme";
import { Spacing } from "@/constants/theme";
import { MembershipPlan, getPlans, updatePlan } from "@/lib/storage";

export default function PlanManagementScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();

  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadPlans = useCallback(async () => {
    const plansData = await getPlans();
    setPlans(plansData);
    setIsLoading(false);
    setIsRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPlans();
    }, [loadPlans])
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await loadPlans();
  };

  const handleSavePlan = async (plan: MembershipPlan) => {
    await updatePlan(plan);
    setPlans((prev) =>
      prev.map((p) => (p.id === plan.id ? plan : p))
    );
  };

  const renderPlan = ({ item, index }: { item: MembershipPlan; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
      <PlanCard plan={item} onSave={handleSavePlan} />
    </Animated.View>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
        <LoadingSpinner message="Loading plans..." />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <FlatList
        data={plans}
        keyExtractor={(item) => item.id}
        renderItem={renderPlan}
        contentContainerStyle={[
          styles.listContent,
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
        ListHeaderComponent={
          <View style={styles.header}>
            <ThemedText type="body" style={{ color: theme.textSecondary }}>
              Configure your membership plan prices. Changes will apply to new memberships.
            </ThemedText>
          </View>
        }
      />
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
  header: {
    marginBottom: Spacing.xl,
  },
});
