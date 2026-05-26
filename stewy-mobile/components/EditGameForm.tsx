import React, { useState, useEffect } from 'react';
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
import { Game } from '@/contexts/games.context';
import { ThemedDatePickerModal } from './ThemedDatePickerModal';
import { ThemedTimePickerModal } from './ThemedTimePickerModal';
import { formatDateForDisplay, formatTimeForDisplay } from '@/lib/dateUtils';

interface EditGameFormProps {
  game: Game;
  onSubmit: (updates: Partial<Game>) => void;
  onCancel: () => void;
}

function parseAppointment(appointment: string): { date: Date; time: Date } {
  const d = new Date(appointment);
  if (isNaN(d.getTime())) {
    const now = new Date();
    return { date: now, time: now };
  }
  return { date: d, time: d };
}

export function EditGameForm({ game, onSubmit, onCancel }: EditGameFormProps) {
  const { date: initialDate, time: initialTime } = parseAppointment(game.appointment);
  const [date, setDate] = useState<Date>(initialDate);
  const [time, setTime] = useState<Date>(initialTime);
  const [location, setLocation] = useState(game.location);
  const [accessibility, setAccessibility] = useState(game.accessibility || '');
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

  const isComplete = !!(date && time && location);

  const handleSubmit = () => {
    if (!isComplete) return;
    const combinedDate = new Date(date);
    combinedDate.setHours(time.getHours(), time.getMinutes(), 0, 0);
    onSubmit({
      location,
      appointment: combinedDate.toISOString(),
      accessibility: accessibility.trim() || undefined,
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
          <View className="flex-row justify-between items-center mb-8 mt-2">
            <ThemedText type="h2">Edit Game</ThemedText>
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
            <View className="flex-row gap-4">
              <View className="flex-1">
                <ThemedInput
                  label="Date"
                  placeholder="dd-MM-yyyy"
                  value={formatDateForDisplay(date)}
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
                  value={formatTimeForDisplay(time)}
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

            <ThemedInput
              label="Accessibility Notes"
              placeholder="e.g. Wheelchair access..."
              value={accessibility}
              onChangeText={setAccessibility}
              leadingIcon={<IconSymbol name="info.circle" size={18} color={iconColor} />}
            />
          </View>

          <View className="pt-8 pb-12">
            <ThemedButton
              label="Save Changes"
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
