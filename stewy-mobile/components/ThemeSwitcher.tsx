import React from "react";
import { TouchableOpacity } from "react-native";
import { usePreferences } from "@/contexts/preferences.context";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useDesignTokens } from "@/hooks/useDesignTokens";

type Theme = "light" | "dark";

const CYCLE: Theme[] = ["light", "dark"];

const ICONS: Record<Theme, "sun-o" | "moon-o"> = {
  light: "sun-o",
  dark: "moon-o",
};

const LABELS: Record<Theme, string> = {
  light: "Light",
  dark: "Dark",
};

export function ThemeSwitcher() {
  const { theme, setTheme } = usePreferences();
  const { colors } = useDesignTokens();

  const cycle = () => {
    const idx = CYCLE.indexOf(theme);
    const next = CYCLE[(idx + 1) % CYCLE.length];
    setTheme(next);
  };

  return (
    <TouchableOpacity
      onPress={cycle}
      className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 active:opacity-80"
      accessibilityLabel={`Theme: ${LABELS[theme]}. Tap to switch.`}
    >
      <FontAwesome name={ICONS[theme]} size={20} color={colors.text} />
    </TouchableOpacity>
  );
}
