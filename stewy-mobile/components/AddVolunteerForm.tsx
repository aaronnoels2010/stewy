import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { IconSymbol } from './ui/IconSymbol';
import { ThemedText } from './ThemedText';
import { ThemedInput } from './ThemedInput';
import { ThemedButton } from './ThemedButton';
import { ThemedView } from './ThemedView';
import { useDesignTokens } from '@/hooks/useDesignTokens';

interface AddVolunteerFormProps {
  onSubmit: (name: string) => void;
  onCancel: () => void;
}

export function AddVolunteerForm({ onSubmit, onCancel }: AddVolunteerFormProps) {
  const [name, setName] = useState('');
  const { colors } = useDesignTokens();

  const handleSubmit = () => {
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  const iconColor = colors.textMuted;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ThemedView variant="default" className="flex-1 p-6">
        <View className="flex-row justify-between items-center mb-8 mt-2">
          <ThemedText type="h2">Add Volunteer</ThemedText>
          <ThemedButton
            label=""
            variant="muted"
            size="sm"
            onPress={onCancel}
            leadingIcon={<IconSymbol name="xmark" size={18} color={iconColor} />}
            className="w-10 h-10 rounded-full p-0"
          />
        </View>

        <View className="gap-5 flex-1">
          <ThemedInput
            label="Volunteer Name"
            placeholder="Enter name"
            value={name}
            onChangeText={setName}
            leadingIcon={<IconSymbol name="person" size={18} color={iconColor} />}
          />
        </View>

        <View className="pt-8 pb-12">
          <ThemedButton
            label="Add Volunteer"
            variant="primary"
            size="lg"
            onPress={handleSubmit}
            disabled={!name.trim()}
            className="w-full"
          />
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}
