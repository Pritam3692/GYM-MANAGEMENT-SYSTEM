import React, { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator, Alert, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import * as Haptics from "expo-haptics";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import {
  Member,
  MembershipPlan,
  getMember,
  getPlans,
  updateMember,
  deleteMember,
  calculateExpiryDate,
} from "@/lib/storage";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type EditMemberRouteProp = RouteProp<RootStackParamList, "EditMember">;

export default function EditMemberScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const navigation = useNavigation();
  const route = useRoute<EditMemberRouteProp>();
  const { theme } = useTheme();

  const { memberId } = route.params;

  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [member, setMember] = useState<Member | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, [memberId]);

  const loadData = async () => {
    const [memberData, plansData] = await Promise.all([
      getMember(memberId),
      getPlans(),
    ]);

    setPlans(plansData);

    if (memberData) {
      setMember(memberData);
      setName(memberData.name);
      setEmail(memberData.email);
      setPhone(memberData.phone);
      setSelectedPlanId(memberData.planId);
      setAmountPaid(memberData.amountPaid.toString());
    }

    setIsLoading(false);
  };

  const selectedPlan = plans.find((p) => p.id === selectedPlanId);

  const handleSave = async () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !selectedPlan || !member) {
      setError("Please fill in all required fields");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const paidAmount = parseInt(amountPaid, 10) || 0;
      const planChanged = selectedPlanId !== member.planId;

      let expiryDate = member.expiryDate;
      if (planChanged) {
        expiryDate = calculateExpiryDate(member.startDate, selectedPlan.durationMonths);
      }

      await updateMember({
        ...member,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        planId: selectedPlanId,
        expiryDate,
        amountPaid: paidAmount,
        totalAmount: selectedPlan.price,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.goBack();
    } catch (e) {
      setError("Failed to update member. Please try again.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Member",
      `Are you sure you want to delete ${name}? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteMember(memberId);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            navigation.goBack();
          },
        },
      ]
    );
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
                Dues Remaining
              </ThemedText>
              <ThemedText
                type="h4"
                style={{
                  color:
                    selectedPlan.price - (parseInt(amountPaid, 10) || 0) > 0
                      ? theme.error
                      : theme.success,
                }}
              >
                Rs. {Math.max(0, selectedPlan.price - (parseInt(amountPaid, 10) || 0)).toLocaleString()}
              </ThemedText>
            </View>
          </View>
        ) : null}

        <Input
          label="Amount Paid"
          placeholder="Enter amount paid"
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
          disabled={isSaving}
          style={[styles.saveButton, { backgroundColor: theme.primary }]}
        >
          {isSaving ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            "Save Changes"
          )}
        </Button>

        <Button
          onPress={handleDelete}
          style={[styles.deleteButton, { backgroundColor: theme.error }]}
        >
          Delete Member
        </Button>
      </KeyboardAwareScrollViewCompat>
    </View>
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
  deleteButton: {
    marginTop: Spacing.md,
  },
});
