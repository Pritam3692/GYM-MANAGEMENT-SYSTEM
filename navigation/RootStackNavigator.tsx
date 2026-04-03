import React from "react";
import { Pressable } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { HeaderButton } from "@react-navigation/elements";
import * as Haptics from "expo-haptics";

import LoginScreen from "@/screens/LoginScreen";
import OwnerDashboardScreen from "@/screens/OwnerDashboardScreen";
import MemberDashboardScreen from "@/screens/MemberDashboardScreen";
import AddMemberScreen from "@/screens/AddMemberScreen";
import EditMemberScreen from "@/screens/EditMemberScreen";
import MemberDetailScreen from "@/screens/MemberDetailScreen";
import PlanManagementScreen from "@/screens/PlanManagementScreen";
import { HeaderTitle } from "@/components/HeaderTitle";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export type RootStackParamList = {
  Login: undefined;
  OwnerDashboard: undefined;
  MemberDashboard: undefined;
  AddMember: undefined;
  EditMember: { memberId: string };
  MemberDetail: { memberId: string };
  PlanManagement: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();
  const { user, isLoading, logout } = useAuth();
  const { theme } = useTheme();

  if (isLoading) {
    return <LoadingSpinner message="Loading..." />;
  }

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    logout();
  };

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      {!user ? (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      ) : user.role === "owner" ? (
        <>
          <Stack.Screen
            name="OwnerDashboard"
            component={OwnerDashboardScreen}
            options={({ navigation }) => ({
              headerTitle: () => <HeaderTitle title="The Fitness Empire" />,
              headerLeft: () => (
                <HeaderButton onPress={handleLogout}>
                  <Feather name="log-out" size={22} color={theme.text} />
                </HeaderButton>
              ),
              headerRight: () => (
                <HeaderButton
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    navigation.navigate("PlanManagement");
                  }}
                >
                  <Feather name="settings" size={22} color={theme.text} />
                </HeaderButton>
              ),
            })}
          />
          <Stack.Screen
            name="AddMember"
            component={AddMemberScreen}
            options={{
              headerTitle: "Add Member",
              presentation: "modal",
            }}
          />
          <Stack.Screen
            name="EditMember"
            component={EditMemberScreen}
            options={{
              headerTitle: "Edit Member",
              presentation: "modal",
            }}
          />
          <Stack.Screen
            name="MemberDetail"
            component={MemberDetailScreen}
            options={{
              headerTitle: "Member Details",
            }}
          />
          <Stack.Screen
            name="PlanManagement"
            component={PlanManagementScreen}
            options={{
              headerTitle: "Membership Plans",
            }}
          />
        </>
      ) : (
        <Stack.Screen
          name="MemberDashboard"
          component={MemberDashboardScreen}
          options={{
            headerTitle: () => <HeaderTitle title="My Membership" />,
            headerRight: () => (
              <HeaderButton onPress={handleLogout}>
                <Feather name="log-out" size={22} color={theme.text} />
              </HeaderButton>
            ),
          }}
        />
      )}
    </Stack.Navigator>
  );
}
