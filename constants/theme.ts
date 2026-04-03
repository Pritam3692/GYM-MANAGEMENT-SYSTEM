import { Platform } from "react-native";

const primaryOrange = "#FF6B00";
const accentBlack = "#000000";

export const Colors = {
  light: {
    text: "#1A1A1A",
    textSecondary: "#666666",
    buttonText: "#FFFFFF",
    tabIconDefault: "#687076",
    tabIconSelected: primaryOrange,
    link: primaryOrange,
    primary: primaryOrange,
    accent: accentBlack,
    backgroundRoot: "#F5F5F5",
    backgroundDefault: "#FFFFFF",
    backgroundSecondary: "#EEEEEE",
    backgroundTertiary: "#E0E0E0",
    border: "#E0E0E0",
    success: "#00C853",
    warning: "#FFA000",
    error: "#D32F2F",
    cardBackground: "#FFFFFF",
  },
  dark: {
    text: "#ECEDEE",
    textSecondary: "#9BA1A6",
    buttonText: "#FFFFFF",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: primaryOrange,
    link: primaryOrange,
    primary: primaryOrange,
    accent: "#FFFFFF",
    backgroundRoot: "#1A1A1A",
    backgroundDefault: "#2A2A2A",
    backgroundSecondary: "#353535",
    backgroundTertiary: "#404040",
    border: "#404040",
    success: "#00E676",
    warning: "#FFB300",
    error: "#EF5350",
    cardBackground: "#2A2A2A",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  inputHeight: 52,
  buttonHeight: 52,
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
  "3xl": 40,
  full: 9999,
};

export const Typography = {
  hero: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700" as const,
  },
  h1: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600" as const,
  },
  h3: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600" as const,
  },
  h4: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400" as const,
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
