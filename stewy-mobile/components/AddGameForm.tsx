/**
 * AddGameForm — uses the Stewy design system.
 * ThemedInput replaces all raw TextInput elements.
 * ThemedButton replaces the raw TouchableOpacity submit button.
 * ThemedCard wraps the form container.
 */
import React, { useState } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { IconSymbol } from './ui/IconSymbol';
import { ThemedCard } from './ThemedCard';
import { ThemedText } from './ThemedText';
import { ThemedInput } from './ThemedInput';
import { ThemedButton } from './ThemedButton';
import { ThemedView } from './ThemedView';
import { useDesignTokens } from '@/hooks/useDesignTokens';

interface AddGameFormProps {
  onSubmit: (game: { opponent: string; date: string; time: string; location: string }) => void;
  onCancel: () => void;
}

export function AddGameForm({ onSubmit, onCancel }: AddGameFormProps) {
  const [opponent, setOpponent] = useState('');
  const [date,     setDate]     = useState('');
  const [time,     setTime]     = useState('');
  const [location, setLocation] = useState('');
  const { colors } = useDesignTokens();

  const isComplete = !!(opponent && date && time && location);

  const handleSubmit = () => {
    if (!isComplete) return;
    onSubmit({ opponent, date, time, location });
  };

  const iconColor = colors.textMuted;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ThemedView variant="default" className="flex-1 p-6">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="flex-row justify-between items-center mb-8">
            <ThemedText type="h2">Plan New Game</ThemedText>
            <ThemedButton
              label=""
              variant="muted"
              size="sm"
              onPress={onCancel}
              leadingIcon={<IconSymbol name="xmark" size={18} color={iconColor} />}
              className="w-10 h-10 rounded-full p-0"
            />
          </View>

          {/* Form fields */}
          <View className="gap-5">
            <ThemedInput
              label="Opponent Team"
              placeholder="e.g. Real Madrid"
              value={opponent}
              onChangeText={setOpponent}
              leadingIcon={<IconSymbol name="person.2" size={18} color={iconColor} />}
            />

            <View className="flex-row gap-4">
              <View className="flex-1">
                <ThemedInput
                  label="Date"
                  placeholder="MM/DD/YYYY"
                  value={date}
                  onChangeText={setDate}
                  leadingIcon={<IconSymbol name="calendar" size={18} color={iconColor} />}
                />
              </View>
              <View className="flex-1">
                <ThemedInput
                  label="Time"
                  placeholder="HH:MM"
                  value={time}
                  onChangeText={setTime}
                  leadingIcon={<IconSymbol name="clock" size={18} color={iconColor} />}
                />
              </View>
            </View>

            <ThemedInput
              label="Location"
              placeholder="Stadium or Field Name"
              value={location}
              onChangeText={setLocation}
              leadingIcon={<IconSymbol name="mappin" size={18} color={iconColor} />}
            />
          </View>

          {/* Submit */}
          <View className="pt-8 pb-12">
            <ThemedButton
              label="Plan Game"
              variant="primary"
              size="lg"
              onPress={handleSubmit}
              disabled={!isComplete}
              className="w-full"
            />
          </View>
        </ScrollView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}
