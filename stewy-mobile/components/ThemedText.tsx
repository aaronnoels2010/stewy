import { Text, type TextProps } from "react-native";
import { useDesignTokens } from "@/hooks/useDesignTokens";
import {
  Typography,
  TypographyAliases,
  type TypographyVariant,
} from "@/constants/Typography";

export type ThemedTextProps = TextProps & {
  type?: TypographyVariant;
  /** @deprecated Use `muted` boolean instead */
  variant?: "muted" | "subtle" | "accent" | "inverse";
  muted?: boolean;
  subtle?: boolean;
  accent?: boolean;
  inverse?: boolean;
  uppercase?: boolean;
};

export function ThemedText({
  style,
  type = "body",
  variant,
  muted = false,
  subtle = false,
  accent = false,
  inverse = false,
  uppercase = false,
  className = "",
  ...rest
}: ThemedTextProps) {
  const { classes } = useDesignTokens();

  const resolvedType =
    type in TypographyAliases
      ? TypographyAliases[type as keyof typeof TypographyAliases]
      : (type as keyof typeof Typography);

  let colorClass: string = classes.text;
  if (muted || variant === "muted") colorClass = classes.textMuted;
  if (subtle || variant === "subtle") colorClass = classes.textSubtle;
  if (accent || variant === "accent") colorClass = classes.textAccent;
  if (inverse || variant === "inverse") colorClass = classes.textInverse;

  const scale = Typography[resolvedType];
  const typographyClasses = [
    scale.fontFamily,
    scale.fontSize,
    scale.lineHeight,
    scale.letterSpacing,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Text
      {...rest}
      style={style}
      className={`${colorClass} ${typographyClasses} ${uppercase ? "uppercase" : ""} ${className}`.trim()}
    />
  );
}
