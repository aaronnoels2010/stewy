import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { useDesignTokens } from '@/hooks/useDesignTokens';
import { IconSymbol } from './ui/IconSymbol';

interface ThemedDatePickerModalProps {
  visible: boolean;
  value: string; // MM/DD/YYYY
  onChange: (date: string) => void;
  onClose: () => void;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function ThemedDatePickerModal({
  visible,
  value,
  onChange,
  onClose,
}: ThemedDatePickerModalProps) {
  const { colors, isDark } = useDesignTokens();
  
  // Internal view state
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Initialize values when modal becomes visible
  useEffect(() => {
    if (visible) {
      const parts = value.split('/');
      if (parts.length === 3) {
        const m = parseInt(parts[0], 10) - 1;
        const d = parseInt(parts[1], 10);
        const y = parseInt(parts[2], 10);
        if (!isNaN(m) && !isNaN(d) && !isNaN(y) && m >= 0 && m < 12) {
          setCurrentMonth(m);
          setCurrentYear(y);
          setSelectedDay(d);
          return;
        }
      }
      // Fallback to today
      const today = new Date();
      setCurrentMonth(today.getMonth());
      setCurrentYear(today.getFullYear());
      setSelectedDay(null);
    }
  }, [visible, value]);

  // Calendar calculations
  const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const firstDayIndex = (y: number, m: number) => new Date(y, m, 1).getDay();

  const totalDays = daysInMonth(currentYear, currentMonth);
  const startOffset = firstDayIndex(currentYear, currentMonth);

  const days: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) {
    days.push(null);
  }
  for (let i = 1; i <= totalDays; i++) {
    days.push(i);
  }

  // Handle month navigation
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const selectDate = (day: number) => {
    const formattedMonth = String(currentMonth + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const formattedDate = `${formattedMonth}/${formattedDay}/${currentYear}`;
    onChange(formattedDate);
    onClose();
  };

  // Check if cell matches today's date
  const isToday = (day: number | null) => {
    if (!day) return false;
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear
    );
  };

  // Check if cell is the selected date
  const isSelected = (day: number | null) => {
    if (!day || selectedDay !== day) return false;
    // Check if the source value matches current view's month/year
    const parts = value.split('/');
    if (parts.length === 3) {
      const m = parseInt(parts[0], 10) - 1;
      const y = parseInt(parts[2], 10);
      return m === currentMonth && y === currentYear;
    }
    return false;
  };

  const modalBg = isDark ? colors.surface : '#FFFFFF';
  const overlayBg = 'rgba(0, 0, 0, 0.4)';
  const cellTextColor = colors.text;
  const headerTextColor = colors.text;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 justify-center items-center p-6"
        style={{ backgroundColor: overlayBg }}
        onPress={onClose}
      >
        <Pressable
          className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl p-5"
          style={{ backgroundColor: modalBg }}
          onPress={(e) => e.stopPropagation()} // Prevent closing when tapping modal content
        >
          {/* Modal Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text style={{ color: headerTextColor }} className="text-lg font-bold">
              Select Date
            </Text>
            <TouchableOpacity onPress={onClose} className="p-1">
              <IconSymbol name="xmark" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Month/Year Navigation */}
          <View className="flex-row justify-between items-center mb-4 bg-gray-50 dark:bg-zinc-800/40 p-2 rounded-2xl">
            <TouchableOpacity onPress={prevMonth} className="p-2 rounded-lg bg-gray-200/50 dark:bg-zinc-700/50">
              <IconSymbol name="chevron.left" size={16} color={colors.text} />
            </TouchableOpacity>
            
            <Text style={{ color: headerTextColor }} className="text-base font-semibold">
              {MONTHS[currentMonth]} {currentYear}
            </Text>
            
            <TouchableOpacity onPress={nextMonth} className="p-2 rounded-lg bg-gray-200/50 dark:bg-zinc-700/50">
              <IconSymbol name="chevron.right" size={16} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Weekday Labels */}
          <View className="flex-row flex-wrap mb-2 border-b border-gray-100 dark:border-zinc-800 pb-1">
            {WEEK_DAYS.map((day, idx) => (
              <View key={idx} style={{ width: '14.28%' }} className="items-center justify-center py-1">
                <Text style={{ color: colors.textMuted }} className="text-xs font-bold uppercase">
                  {day}
                </Text>
              </View>
            ))}
          </View>

          {/* Days Grid */}
          <View className="flex-row flex-wrap">
            {days.map((day, idx) => {
              const active = isSelected(day);
              const today = isToday(day);

              return (
                <View
                  key={idx}
                  style={{ width: '14.28%', aspectRatio: 1 }}
                  className="items-center justify-center p-0.5"
                >
                  {day !== null ? (
                    <TouchableOpacity
                      onPress={() => selectDate(day)}
                      style={[
                        {
                          width: '85%',
                          height: '85%',
                          borderRadius: 999,
                          alignItems: 'center',
                          justifyContent: 'center',
                        },
                        active && { backgroundColor: colors.accent },
                        today && !active && { borderWidth: 1.5, borderColor: colors.accent },
                      ]}
                    >
                      <Text
                        style={{
                          color: active ? '#FFFFFF' : cellTextColor,
                          fontWeight: active || today ? 'bold' : 'normal',
                        }}
                        className="text-sm"
                      >
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={{ width: '85%', height: '85%' }} />
                  )}
                </View>
              );
            })}
          </View>

          {/* Bottom Actions */}
          <View className="flex-row justify-between items-center mt-6 pt-4 border-t border-gray-100 dark:border-zinc-800">
            <TouchableOpacity
              onPress={() => {
                const today = new Date();
                const m = String(today.getMonth() + 1).padStart(2, '0');
                const d = String(today.getDate()).padStart(2, '0');
                onChange(`${m}/${d}/${today.getFullYear()}`);
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-zinc-800/80"
            >
              <Text style={{ color: colors.text }} className="text-sm font-semibold">
                Today
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onClose}
              className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-zinc-800/80"
            >
              <Text style={{ color: colors.text }} className="text-sm font-semibold">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
