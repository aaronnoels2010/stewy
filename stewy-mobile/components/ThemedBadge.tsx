/**
 * Stewy Design System — ThemedBadge
 *
 * A small status/label pill used to indicate game state, player roles,
 * and other categorical data.
 *
 * @example
 * <ThemedBadge variant="success" label="Completed" />
 * <ThemedBadge variant="info"    label="Upcoming" />
 * <ThemedBadge variant="danger"  label="Cancelled" />
 */
import React from 'react';
import { View, Text } from 'react-native';
import { useDesignTokens } from '@/hooks/useDesignTokens';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'muted';

export type ThemedBadgeProps = {
  variant?: BadgeVariant;
  label: string;
  /** Show a small colored dot before the label */
  dot?: boolean;
  className?: string;
};

/** Maps a Game status string to a BadgeVariant */
export function gameStatusToBadge(status: string): BadgeVariant {
  switch (status) {
    case 'upcoming':
    case 'CREATE':    return 'info';
    case 'completed':
    case 'CLOSED':    return 'success';
    case 'cancelled':
    case 'OPEN':      return 'warning';
    default:          return 'muted';
  }
}

const DOT_COLOR: Record<BadgeVariant, string> = {
  success: '#10B981',
  warning: '#F59E0B',
  danger:  '#EF4444',
  info:    '#3B82F6',
  muted:   '#71717A',
};

export function ThemedBadge({
  variant = 'muted',
  label,
  dot = false,
  className = '',
}: ThemedBadgeProps) {
  const { classes } = useDesignTokens();

  const bgClass: Record<BadgeVariant, string> = {
    success: classes.successBg,
    warning: classes.warningBg,
    danger:  classes.dangerBg,
    info:    classes.infoBg,
    muted:   classes.surfaceAlt,
  };

  const textClass: Record<BadgeVariant, string> = {
    success: classes.successText,
    warning: classes.warningText,
    danger:  classes.dangerText,
    info:    classes.infoText,
    muted:   classes.textMuted,
  };

  return (
    <View
      className={`flex-row items-center gap-1.5 px-3 py-1 rounded-full ${bgClass[variant]} ${className}`}
    >
      {dot && (
        <View
          style={{ backgroundColor: DOT_COLOR[variant] }}
          className="w-1.5 h-1.5 rounded-full"
        />
      )}
      <Text className={`text-xs font-bold uppercase tracking-wider ${textClass[variant]}`}>
        {label}
      </Text>
    </View>
  );
}
