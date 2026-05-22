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
import { Game } from '@/contexts/games.context';
import { ThemedDatePickerModal } from './ThemedDatePickerModal';
import { ThemedTimePickerModal } from './ThemedTimePickerModal';

interface EditGameFormProps {
  game: Game;
  onSubmit: (updates: Partial<Game>) => void;
  onCancel: () => void;
}

const getDaysInMonth = (m: number, y: number) => {
  const daysInMonthList = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (m === 2) {
    return (y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0)) ? 29 : 28;
  }
  return daysInMonthList[m - 1] || 31;
};

const formatDatePickerText = (text: string, prev: string) => {
  if (text.length < prev.length) return text;
  const digits = text.replace(/\D/g, '');
  if (digits.length <= 2) {
    return digits;
  } else if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  } else {
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
  }
};

const formatTimePickerText = (text: string, prev: string) => {
  if (text.length < prev.length) return text;
  const digits = text.replace(/\D/g, '');
  if (digits.length <= 2) {
    return digits;
  } else {
    return `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
  }
};

export function EditGameForm({ game, onSubmit, onCancel }: EditGameFormProps) {
  const [date, setDate] = useState(game.date);
  const [time, setTime] = useState(game.time);
  const [location, setLocation] = useState(game.location);
  const [accessibility, setAccessibility] = useState(game.accessibility || '');
  const { colors } = useDesignTokens();

  // Picker Modal State
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Validation State (Initialized as undefined because current saved values are assumed valid)
  const [dateError, setDateError] = useState<string | undefined>(undefined);
  const [timeError, setTimeError] = useState<string | undefined>(undefined);

  const validateAndSetDate = (value: string) => {
    if (!value) {
      setDateError(undefined);
      return;
    }

    const digitsOnly = value.replace(/\D/g, '');
    
    if (digitsOnly.length >= 2) {
      const month = parseInt(digitsOnly.slice(0, 2), 10);
      if (month < 1 || month > 12) {
        setDateError('Month must be 01 - 12');
        return;
      }
    }

    if (digitsOnly.length >= 4) {
      const month = parseInt(digitsOnly.slice(0, 2), 10);
      const day = parseInt(digitsOnly.slice(2, 4), 10);
      const year = digitsOnly.length >= 8 ? parseInt(digitsOnly.slice(4, 8), 10) : new Date().getFullYear();
      
      const maxDays = getDaysInMonth(month, year);
      if (day < 1 || day > maxDays) {
        setDateError(`Day must be 01 - ${maxDays}`);
        return;
      }
    }

    if (value.length < 10) {
      setDateError(undefined);
      return;
    }

    const parts = value.split('/');
    if (parts.length !== 3 || parts[2].length !== 4) {
      setDateError('Use MM/DD/YYYY format');
      return;
    }

    const month = parseInt(parts[0], 10);
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    const dateObj = new Date(year, month - 1, day);
    if (isNaN(dateObj.getTime())) {
      setDateError('Invalid calendar date');
      return;
    }

    setDateError(undefined);
  };

  const validateAndSetTime = (value: string) => {
    if (!value) {
      setTimeError(undefined);
      return;
    }

    const digitsOnly = value.replace(/\D/g, '');

    if (digitsOnly.length >= 2) {
      const hour = parseInt(digitsOnly.slice(0, 2), 10);
      if (hour < 0 || hour > 23) {
        setTimeError('Hour must be 00 - 23');
        return;
      }
    }

    if (value.length < 5) {
      setTimeError(undefined);
      return;
    }

    const parts = value.split(':');
    if (parts.length !== 2 || parts[0].length !== 2 || parts[1].length !== 2) {
      setTimeError('Use HH:MM format');
      return;
    }

    const hour = parseInt(parts[0], 10);
    const minute = parseInt(parts[1], 10);

    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      setTimeError('Hour (00-23), Minute (00-59)');
      return;
    }

    setTimeError(undefined);
  };

  const handleDateChange = (text: string) => {
    const formatted = formatDatePickerText(text, date);
    setDate(formatted);
    validateAndSetDate(formatted);
  };

  const handleTimeChange = (text: string) => {
    const formatted = formatTimePickerText(text, time);
    setTime(formatted);
    validateAndSetTime(formatted);
  };

  const isDateValid = date.length === 10 && !dateError;
  const isTimeValid = time.length === 5 && !timeError;
  const isComplete = !!(location && isDateValid && isTimeValid);

  const handleSubmit = () => {
    if (!isComplete) return;
    onSubmit({
      date,
      time,
      location,
      accessibility: accessibility.trim() || undefined,
    });
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

          {/* Form fields */}
          <View className="gap-5">
            <View className="flex-row gap-4">
              <View className="flex-1">
                <ThemedInput
                  label="Date"
                  placeholder="MM/DD/YYYY"
                  value={date}
                  onChangeText={handleDateChange}
                  keyboardType="number-pad"
                  maxLength={10}
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
                  placeholder="HH:MM"
                  value={time}
                  onChangeText={handleTimeChange}
                  keyboardType="number-pad"
                  maxLength={5}
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

          {/* Submit */}
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

      {/* Pickers */}
      <ThemedDatePickerModal
        visible={showDatePicker}
        value={date}
        onChange={(newDate) => {
          setDate(newDate);
          validateAndSetDate(newDate);
        }}
        onClose={() => setShowDatePicker(false)}
      />

      <ThemedTimePickerModal
        visible={showTimePicker}
        value={time}
        onChange={(newTime) => {
          setTime(newTime);
          validateAndSetTime(newTime);
        }}
        onClose={() => setShowTimePicker(false)}
      />
    </KeyboardAvoidingView>
  );
}
