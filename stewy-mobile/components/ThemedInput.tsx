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
  label?: string;
  hint?: string;
  error?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  /** Apply uppercase style to label */
  uppercaseLabel?: boolean;
  /** Label font size variant */
  labelSize?: 'sm' | 'md';
};

export function ThemedInput({
  label,
  hint,
  error,
  leadingIcon,
  trailingIcon,
  uppercaseLabel = false,
  labelSize = 'sm',
  style,
  className = '',
  ...rest
}: ThemedInputProps) {
  const { colors, isDark } = useDesignTokens();
  const [focused, setFocused] = useState(false);

  const hasError = !!error;

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
    <View className={`${className}`}>
      {label && (
        <Text
          style={{ color: labelColor }}
          className={`
            ${labelSize === 'sm' ? 'text-xs' : 'text-sm'}
            font-semibold mb-1.5 ml-1
            ${uppercaseLabel ? 'uppercase tracking-wider' : ''}
          `.trim()}
        >
          {label}
        </Text>
      )}

      <View
        style={{
          backgroundColor: inputBg,
          borderColor,
          borderWidth: focused || hasError ? 1.5 : 1,
        }}
        className="flex-row items-center rounded-pitch-md overflow-hidden"
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
          className={`
            py-4 text-base
            ${leadingIcon ? 'pl-2' : 'pl-5'}
            ${trailingIcon ? 'pr-2' : 'pr-5'}
            outline-none
          `.trim()}
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
