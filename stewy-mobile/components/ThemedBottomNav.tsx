import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol, type IconSymbolName } from "@/components/ui/IconSymbol";
import { useDesignTokens } from "@/hooks/useDesignTokens";

export type BottomNavItem = {
  key: string;
  label: string;
  icon: IconSymbolName;
  href: string;
};

export type ThemedBottomNavProps = {
  items: BottomNavItem[];
  activeKey?: string;
  className?: string;
};

export function ThemedBottomNav({
  items,
  activeKey,
  className = "",
}: ThemedBottomNavProps) {
  const router = useRouter();
  const { colors, isDark } = useDesignTokens();

  return (
    <ThemedView
      variant={isDark ? "surfaceAlt" : "surface"}
      style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 50 }}
      className={`
        flex-row items-center justify-around
        h-20 pb-safe px-4
        border-t
        ${isDark ? "border-[#3F4A3D]" : "border-[#BECAB9]"}
        shadow-pitch-md
        ${className}
      `.trim()}
    >
      {items.map((item) => {
        const isActive = item.key === activeKey;

        return (
          <TouchableOpacity
            key={item.key}
            onPress={() => router.push(item.href as any)}
            activeOpacity={0.7}
            className={`
              flex-row items-center justify-center gap-2
              px-5 py-1.5 rounded-xl
            `.trim()}
            style={{
              backgroundColor: isActive
                ? isDark
                  ? colors.accent
                  : colors.accentLight
                : "transparent",
            }}
          >
            <IconSymbol
              name={item.icon}
              size={20}
              color={isActive ? "#FFFFFF" : colors.textMuted}
            />
            <ThemedText
              type="caption"
              className={isActive ? "font-bold" : ""}
              style={{ color: isActive ? colors.textWhite : colors.text }}
              muted={!isActive}
              uppercase
            >
              {item.label}
            </ThemedText>
          </TouchableOpacity>
        );
      })}
    </ThemedView>
  );
}
