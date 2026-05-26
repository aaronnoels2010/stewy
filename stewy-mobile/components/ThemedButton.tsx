import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
  type TouchableOpacityProps,
} from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useDesignTokens } from "@/hooks/useDesignTokens";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "muted"
  | "pitch"
  | "outline";
export type ButtonSize = "sm" | "md" | "lg";

export type ThemedButtonProps = TouchableOpacityProps & {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  showArrow?: boolean;
  uppercase?: boolean;
  className?: string;
};

const containerSize: Record<ButtonSize, string> = {
  sm: "px-3 py-2",
  md: "px-5 py-3",
  lg: "px-6 py-4",
};

const labelVariant: Record<ButtonVariant, string> = {
  primary: "text-white",
  secondary: "text-pitch dark:text-pitch-fixed",
  ghost: "text-pitch dark:text-pitch-fixed",
  danger: "text-white",
  muted: "text-zinc-600 dark:text-zinc-400",
  pitch: "text-white",
  outline: "text-pitch dark:text-pitch-fixed",
};

const labelSize: Record<ButtonSize, string> = {
  sm: "text-sm font-semibold",
  md: "text-base font-semibold",
  lg: "text-lg font-bold",
};

export function ThemedButton({
  label,
  variant = "primary",
  size = "md",
  loading = false,
  leadingIcon,
  trailingIcon,
  showArrow = false,
  uppercase = false,
  disabled,
  className = "",
  ...rest
}: ThemedButtonProps) {
  const isDisabled = disabled || loading;
  const { colors, isDark } = useDesignTokens();

  const bgColor = (() => {
    if (variant === "pitch" || variant === "primary") {
      return isDark ? colors.accent : colors.accent;
    }
    if (variant === "danger") return "#EF4444";
    return "transparent";
  })();

  return (
    <TouchableOpacity
      {...rest}
      disabled={isDisabled}
      activeOpacity={0.85}
      className={`
        flex-row items-center justify-center gap-2
        ${containerSize[variant === "pitch" ? size : size]}
        ${variant === "pitch" || variant === "primary" ? "shadow-pitch-btn" : ""}
        ${isDisabled ? "opacity-50" : "opacity-100"}
        ${variant === "secondary" ? "border border-pitch" : ""}
        ${variant === "muted" ? "bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700" : ""}
        ${variant === "ghost" ? "bg-transparent" : ""}
        ${variant === "outline" ? "border border-pitch dark:border-pitch-fixed" : ""}
        ${className}
      `.trim()}
      style={{
        backgroundColor: bgColor,
      }}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === "primary" || variant === "pitch" || variant === "danger"
              ? "#FFFFFF"
              : colors.accent
          }
        />
      ) : (
        <>
          {leadingIcon && <View>{leadingIcon}</View>}
          <Text
            className={`
              ${labelVariant[variant]} ${labelSize[size]}
              ${variant === "pitch" ? "font-display" : ""}
              ${uppercase ? "uppercase tracking-wider" : ""}
            `.trim()}
          >
            {label}
          </Text>
          {showArrow && (
            <IconSymbol
              name="arrow.forward"
              size={size === "lg" ? 22 : size === "md" ? 18 : 16}
              color="#FFFFFF"
            />
          )}
          {trailingIcon && <View>{trailingIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
}
