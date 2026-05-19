/**
 * Stewy Design System — ThemedDivider
 *
 * A horizontal rule that uses the theme's border color.
 *
 * @example
 * <ThemedDivider />
 * <ThemedDivider className="my-4" />
 */
import React from 'react';
import { View } from 'react-native';
import { useDesignTokens } from '@/hooks/useDesignTokens';

type ThemedDividerProps = {
  className?: string;
};

export function ThemedDivider({ className = '' }: ThemedDividerProps) {
  const { colors } = useDesignTokens();

  return (
    <View
      style={{ borderBottomColor: colors.border, borderBottomWidth: 1 }}
      className={`w-full ${className}`}
    />
  );
}
