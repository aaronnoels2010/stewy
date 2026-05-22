/**
 * Stewy Design System — ThemedInput
 *
 * A controlled text input that respects the active color scheme. Supports
 * labels, hint text, error state, and leading/trailing icon slots.
 *
 * @example
 * <ThemedInput
 *   label="Email"
 *   placeholder="Enter your email"
 *   value={email}
 *   onChangeText={setEmail}
 *   leadingIcon={<IconSymbol name="envelope" size={18} color="#6B8060" />}
 * />
 * <ThemedInput label="Password" error="Invalid password" secureTextEntry />
 */
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  Platform,
  type TextInputProps,
} from 'react-native';
import { useDesignTokens } from '@/hooks/useDesignTokens';

export type ThemedInputProps = TextInputProps & {
  /** Label shown above the input */
  label?: string;
  /** Helper text shown below the input */
  hint?: string;
  /** Error message — replaces hint and turns border red */
  error?: string;
  /** Icon rendered on the left inside the input */
  leadingIcon?: React.ReactNode;
  /** Icon rendered on the right inside the input */
  trailingIcon?: React.ReactNode;
};

export function ThemedInput({
  label,
  hint,
  error,
  leadingIcon,
  trailingIcon,
  style,
  className = '',
  ...rest
}: ThemedInputProps) {
  const { colors, isDark } = useDesignTokens();
  const [focused, setFocused] = useState(false);

  const hasError = !!error;

  // Border color selection
  const borderColor = hasError
    ? colors.danger
    : focused
    ? colors.accent
    : colors.border;

  const inputBg = isDark ? colors.surfaceAlt : colors.surface;
  const textColor = colors.text;
  const placeholderColor = colors.textSubtle;
  const labelColor = hasError ? colors.danger : colors.textMuted;

  return (
    <View className={`mb-1 ${className}`}>
      {/* Label */}
      {label && (
        <Text
          style={{ color: labelColor }}
          className="text-sm font-semibold mb-1.5 ml-1"
        >
          {label}
        </Text>
      )}

      {/* Input row */}
      <View
        style={{
          backgroundColor: inputBg,
          borderColor,
          borderWidth: focused || hasError ? 1.5 : 1,
        }}
        className="flex-row items-center rounded-2xl overflow-hidden"
      >
        {leadingIcon && (
          <View className="pl-4 pr-1">{leadingIcon}</View>
        )}

        <TextInput
          {...rest}
          style={[
            { color: textColor, flex: 1 },
            Platform.OS === 'web' && ({ outlineStyle: 'none' } as any),
            style,
          ]}
          placeholderTextColor={placeholderColor}
          className={`py-4 ${leadingIcon ? 'pl-2' : 'pl-5'} ${trailingIcon ? 'pr-2' : 'pr-5'} text-base outline-none`}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
        />

        {trailingIcon && (
          <View className="pr-4 pl-1">{trailingIcon}</View>
        )}
      </View>

      {/* Hint / Error */}
      {(hint || error) && (
        <Text
          style={{ color: hasError ? colors.danger : colors.textMuted }}
          className="text-xs mt-1.5 ml-1"
        >
          {error ?? hint}
        </Text>
      )}
    </View>
  );
}
