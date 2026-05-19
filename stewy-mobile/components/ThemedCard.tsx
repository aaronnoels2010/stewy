/**
 * Stewy Design System — ThemedCard
 *
 * A base card container that applies the correct surface color, border,
 * border radius, and shadow for the active theme. Supports pressable mode.
 *
 * @example
 * <ThemedCard>
 *   <ThemedText type="h3">Match Details</ThemedText>
 * </ThemedCard>
 *
 * <ThemedCard pressable onPress={handlePress} noPadding>
 *   <Image … />
 * </ThemedCard>
 */
import React from 'react';
import { TouchableOpacity, View, type ViewProps, type TouchableOpacityProps } from 'react-native';
import { useDesignTokens } from '@/hooks/useDesignTokens';

type BaseCardProps = {
  /** Whether the card should respond to touch */
  pressable?: boolean;
  /** Remove default padding */
  noPadding?: boolean;
  /** Surface variant — defaults to 'surface' */
  surface?: 'surface' | 'surfaceAlt';
  className?: string;
  children?: React.ReactNode;
};

type PressableCardProps = BaseCardProps & TouchableOpacityProps & { pressable: true };
type StaticCardProps   = BaseCardProps & ViewProps               & { pressable?: false };
type ThemedCardProps   = PressableCardProps | StaticCardProps;

export function ThemedCard({
  pressable = false,
  noPadding = false,
  surface = 'surface',
  className = '',
  children,
  ...rest
}: ThemedCardProps) {
  const { classes, colors } = useDesignTokens();

  const bgClass  = surface === 'surfaceAlt' ? classes.surfaceAlt : classes.surface;
  const padding  = noPadding ? '' : 'p-5';
  const base     = `${bgClass} rounded-3xl ${padding} overflow-hidden`;
  const combined = `${base} ${className}`.trim();

  const borderStyle = { borderWidth: 1, borderColor: colors.border };

  if (pressable) {
    return (
      <TouchableOpacity
        activeOpacity={0.75}
        style={borderStyle}
        className={combined}
        {...(rest as TouchableOpacityProps)}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={borderStyle}
      className={combined}
      {...(rest as ViewProps)}
    >
      {children}
    </View>
  );
}
