import React, { useState } from "react";
import { View, StyleSheet, Image, Pressable, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/context/AuthContext";
import { Spacing, BorderRadius } from "@/constants/theme";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const user = await login(email.trim().toLowerCase(), password);
      if (!user) {
        setError("Invalid credentials. Please try again.");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (e) {
      setError("Something went wrong. Please try again.");
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
            paddingTop: insets.top + Spacing["4xl"],
            paddingBottom: insets.bottom + Spacing["2xl"],
          },
        ]}
      >
        <View style={styles.logoContainer}>
          <View style={[styles.logoBackground, { backgroundColor: theme.accent }]}>
            <Image
              source={require("../../assets/images/icon.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <ThemedText type="h1" style={styles.title}>
            The Fitness Empire
          </ThemedText>
          <ThemedText type="body" style={{ color: theme.textSecondary }}>
            Gym Management Made Easy
          </ThemedText>
        </View>

        <View style={[styles.formContainer, { backgroundColor: theme.cardBackground }]}>
          <ThemedText type="h3" style={styles.formTitle}>
            Sign In
          </ThemedText>

          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {error ? (
            <ThemedText type="small" style={[styles.error, { color: theme.error }]}>
              {error}
            </ThemedText>
          ) : null}

          <Button
            onPress={handleLogin}
            disabled={isLoading}
            style={[styles.loginButton, { backgroundColor: theme.primary }]}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              "Sign In"
            )}
          </Button>

          <View style={styles.hint}>
            <ThemedText type="small" style={{ color: theme.textSecondary, textAlign: "center" }}>
              Owner: owner@fitnessempire.com / admin123
            </ThemedText>
          </View>
        </View>
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
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: Spacing["3xl"],
  },
  logoBackground: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.xl,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  logo: {
    width: 70,
    height: 70,
  },
  title: {
    marginBottom: Spacing.xs,
    textAlign: "center",
  },
  formContainer: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
  },
  formTitle: {
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  error: {
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  loginButton: {
    marginTop: Spacing.sm,
  },
  hint: {
    marginTop: Spacing.xl,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
});
