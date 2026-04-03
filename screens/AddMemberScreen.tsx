import React, { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator, Pressable, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import * as Haptics from "expo-haptics";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import {
  MembershipPlan,
  getPlans,
  addMember,
  calculateExpiryDate,
} from "@/lib/storage";

export default function AddMemberScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const navigation = useNavigation();
  const { theme } = useTheme();

  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    const plansData = await getPlans();
    setPlans(plansData);
    if (plansData.length > 0) {
      setSelectedPlanId(plansData[0].id);
    }
  };

  const selectedPlan = plans.find((p) => p.id === selectedPlanId);

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Please enter member name");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (!email.trim()) {
      setError("Please enter email address");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (!phone.trim()) {
      setError("Please enter phone number");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (!selectedPlan) {
      setError("Please select a membership plan");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const startDate = new Date().toISOString();
      const expiryDate = calculateExpiryDate(startDate, selectedPlan.durationMonths);
      const paidAmount = parseInt(amountPaid, 10) || 0;

      await addMember({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        planId: selectedPlanId,
        startDate,
        expiryDate,
        amountPaid: paidAmount,
        totalAmount: selectedPlan.price,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.goBack();
    } catch (e) {
      setError("Failed to add member. Please try again.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <KeyboardAwareScrollViewCompat
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: headerHeight + Spacing.lg,
            paddingBottom: insets.bottom + Spacing.xl,
          },
        ]}
      >
        <Input
          label="Full Name"
          placeholder="Enter member's full name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <Input
          label="Email"
          placeholder="Enter email address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Input
          label="Phone Number"
          placeholder="Enter phone number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <View style={styles.inputGroup}>
          <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
            Membership Plan
          </ThemedText>
          <View
            style={[
              styles.pickerContainer,
              { backgroundColor: theme.backgroundDefault, borderColor: theme.border },
            ]}
          >
            <Picker
              selectedValue={selectedPlanId}
              onValueChange={(value) => setSelectedPlanId(value)}
              style={[styles.picker, { color: theme.text }]}
              dropdownIconColor={theme.text}
            >
              {plans.map((plan) => (
                <Picker.Item
                  key={plan.id}
                  label={`${plan.name} - Rs. ${plan.price.toLocaleString()}`}
                  value={plan.id}
                />
              ))}
            </Picker>
          </View>
        </View>

        {selectedPlan ? (
          <View style={[styles.planSummary, { backgroundColor: theme.cardBackground }]}>
            <View style={styles.planRow}>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Plan Price
              </ThemedText>
              <ThemedText type="h4">Rs. {selectedPlan.price.toLocaleString()}</ThemedText>
            </View>
            <View style={styles.planRow}>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Duration
              </ThemedText>
              <ThemedText type="body">
                {selectedPlan.durationMonths} {selectedPlan.durationMonths === 1 ? "month" : "months"}
              </ThemedText>
            </View>
          </View>
        ) : null}

        <Input
          label="Amount Paid"
          placeholder="Enter amount paid (optional)"
          value={amountPaid}
          onChangeText={(text) => setAmountPaid(text.replace(/[^0-9]/g, ""))}
          keyboardType="numeric"
        />

        {error ? (
          <ThemedText type="small" style={[styles.error, { color: theme.error }]}>
            {error}
          </ThemedText>
        ) : null}

        <Button
          onPress={handleSave}
          disabled={isLoading}
          style={[styles.saveButton, { backgroundColor: theme.primary }]}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            "Add Member"
          )}
        </Button>

        <ThemedText type="small" style={[styles.hint, { color: theme.textSecondary }]}>
          Member's login password will be the last 4 digits of their phone number.
        </ThemedText>
      </KeyboardAwareScrollViewCompat>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    marginBottom: Spacing.xs,
    fontWeight: "500",
  },
  pickerContainer: {
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    overflow: "hidden",
  },
  picker: {
    height: Platform.OS === "ios" ? 180 : 52,
  },
  planSummary: {
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  planRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  error: {
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  saveButton: {
    marginTop: Spacing.lg,
  },
  hint: {
    textAlign: "center",
    marginTop: Spacing.lg,
  },
});
