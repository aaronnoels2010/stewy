/**
 * Stewy Design System — ThemedButton
 *
 * Full button system with semantic variants, sizes, loading state, and
 * optional leading/trailing icon support.
 *
 * @example
 * <ThemedButton label="Sign In" variant="primary" size="lg" onPress={…} />
 * <ThemedButton label="Cancel" variant="ghost" onPress={…} />
 * <ThemedButton label="Delete" variant="danger" size="sm" />
 */
import { Text, TouchableOpacity, ActivityIndicator, View, type TouchableOpacityProps } from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'muted';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ThemedButtonProps = TouchableOpacityProps & {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  /** Icon element rendered before the label */
  leadingIcon?: React.ReactNode;
  /** Icon element rendered after the label */
  trailingIcon?: React.ReactNode;
  className?: string;
};

// ─── Style maps ───────────────────────────────────────────────────────────────

const containerVariant: Record<ButtonVariant, string> = {
  primary:   'bg-accent-500 shadow-accent-sm',
  secondary: 'bg-transparent border border-accent-500',
  ghost:     'bg-transparent',
  danger:    'bg-red-500',
  muted:     'bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700',
};

const containerSize: Record<ButtonSize, string> = {
  sm: 'px-3 py-2 rounded-xl',
  md: 'px-5 py-3 rounded-2xl',
  lg: 'px-6 py-4 rounded-3xl',
};

const labelVariant: Record<ButtonVariant, string> = {
  primary:   'text-white',
  secondary: 'text-accent-600 dark:text-accent-400',
  ghost:     'text-accent-600 dark:text-accent-400',
  danger:    'text-white',
  muted:     'text-zinc-600 dark:text-zinc-400',
};

const labelSize: Record<ButtonSize, string> = {
  sm: 'text-sm  font-semibold',
  md: 'text-base font-semibold',
  lg: 'text-lg  font-bold',
};

// ─── Component ────────────────────────────────────────────────────────────────

export function ThemedButton({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  leadingIcon,
  trailingIcon,
  disabled,
  className = '',
  ...rest
}: ThemedButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      {...rest}
      disabled={isDisabled}
      activeOpacity={0.75}
      className={`
        flex-row items-center justify-center gap-2
        ${containerVariant[variant]}
        ${containerSize[size]}
        ${isDisabled ? 'opacity-50' : 'opacity-100'}
        ${className}
      `.trim()}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? '#FFFFFF' : '#10B981'}
        />
      ) : (
        <>
          {leadingIcon && <View>{leadingIcon}</View>}
          <Text className={`${labelVariant[variant]} ${labelSize[size]}`}>
            {label}
          </Text>
          {trailingIcon && <View>{trailingIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
}
