import React, { useState } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { IconSymbol } from './ui/IconSymbol';
import { ThemedText } from './ThemedText';
import { ThemedInput } from './ThemedInput';
import { ThemedButton } from './ThemedButton';
import { ThemedView } from './ThemedView';
import { useDesignTokens } from '@/hooks/useDesignTokens';
import { ThemedDatePickerModal } from './ThemedDatePickerModal';
import { ThemedTimePickerModal } from './ThemedTimePickerModal';
import { formatDateForDisplay, formatTimeForDisplay, formatDateForApi } from '@/lib/dateUtils';

interface AddGameFormProps {
  onSubmit: (game: { opponent: string; date: string; time: string; location: string }) => void;
  onCancel: () => void;
}

export function AddGameForm({ onSubmit, onCancel }: AddGameFormProps) {
  const [opponent, setOpponent] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [location, setLocation] = useState('');
  const { colors } = useDesignTokens();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [dateError, setDateError] = useState<string | undefined>(undefined);
  const [timeError, setTimeError] = useState<string | undefined>(undefined);

  const handleDateChange = (d: Date) => {
    setDate(d);
    setDateError(undefined);
  };

  const handleTimeChange = (t: Date) => {
    setTime(t);
    setTimeError(undefined);
  };

  const isComplete = !!(opponent && date && time && location);

  const handleSubmit = () => {
    if (!isComplete || !date || !time) return;
    const combinedDate = new Date(date);
    combinedDate.setHours(time.getHours(), time.getMinutes(), 0, 0);
    onSubmit({
      opponent,
      date: formatDateForDisplay(date),
      time: formatTimeForDisplay(time),
      location,
    });
    setShowTimePicker(false);
    setShowDatePicker(false);
  };

  const iconColor = colors.textMuted;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ThemedView variant="default" className="flex-1 p-6">
        <ScrollView showsVerticalScrollIndicator={false}>
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
                  placeholder="dd-MM-yyyy"
                  value={date ? formatDateForDisplay(date) : ''}
                  onChangeText={() => {}}
                  editable={false}
                  error={dateError}
                  leadingIcon={<IconSymbol name="calendar" size={18} color={iconColor} />}
                  trailingIcon={
                    <TouchableOpacity onPress={() => setShowDatePicker(true)} className="p-1">
                      <IconSymbol name="calendar" size={18} color={colors.accent} />
                    </TouchableOpacity>
                  }
                />
              </View>
              <View className="flex-1">
                <ThemedInput
                  label="Time"
                  placeholder="HH:mm"
                  value={time ? formatTimeForDisplay(time) : ''}
                  onChangeText={() => {}}
                  editable={false}
                  error={timeError}
                  leadingIcon={<IconSymbol name="clock" size={18} color={iconColor} />}
                  trailingIcon={
                    <TouchableOpacity onPress={() => setShowTimePicker(true)} className="p-1">
                      <IconSymbol name="clock" size={18} color={colors.accent} />
                    </TouchableOpacity>
                  }
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

      <ThemedDatePickerModal
        visible={showDatePicker}
        value={date}
        onChange={handleDateChange}
        onClose={() => setShowDatePicker(false)}
      />

      <ThemedTimePickerModal
        visible={showTimePicker}
        value={time}
        onChange={handleTimeChange}
        onClose={() => setShowTimePicker(false)}
      />
    </KeyboardAvoidingView>
  );
}
