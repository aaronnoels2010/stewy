import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useDesignTokens } from '@/hooks/useDesignTokens';
import { IconSymbol } from './ui/IconSymbol';

interface ThemedTimePickerModalProps {
  visible: boolean;
  value: Date | null;
  onChange: (date: Date) => void;
  onClose: () => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));

export function ThemedTimePickerModal({
  visible,
  value,
  onChange,
  onClose,
}: ThemedTimePickerModalProps) {
  const { colors, isDark } = useDesignTokens();

  const [selectedHour, setSelectedHour] = useState('12');
  const [selectedMinute, setSelectedMinute] = useState('00');

  useEffect(() => {
    if (visible && value) {
      setSelectedHour(String(value.getHours()).padStart(2, '0'));
      const roundedMin = String(Math.round(value.getMinutes() / 5) * 5 % 60).padStart(2, '0');
      setSelectedMinute(roundedMin);
    } else if (visible && !value) {
      setSelectedHour('12');
      setSelectedMinute('00');
    }
  }, [visible, value]);

  const handleConfirm = () => {
    const baseDate = value || new Date();
    const date = new Date(baseDate);
    date.setHours(parseInt(selectedHour, 10), parseInt(selectedMinute, 10), 0, 0);
    onChange(date);
    onClose();
  };

  const modalBg = isDark ? colors.surface : '#FFFFFF';
  const overlayBg = 'rgba(0, 0, 0, 0.4)';
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
          className="w-full max-w-xs rounded-3xl overflow-hidden shadow-2xl p-5"
          style={{ backgroundColor: modalBg }}
          onPress={(e) => e.stopPropagation()}
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text style={{ color: headerTextColor }} className="text-lg font-bold">
              Select Time
            </Text>
            <TouchableOpacity onPress={onClose} className="p-1">
              <IconSymbol name="xmark" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <View className="flex-row h-56 justify-center items-stretch my-2 border-y border-gray-100 dark:border-zinc-800 py-3">
            <View className="flex-1 items-center">
              <Text style={{ color: colors.textMuted }} className="text-xs font-bold uppercase mb-2">
                Hour
              </Text>
              <ScrollView showsVerticalScrollIndicator={false} className="w-full">
                <View className="items-center px-2 pb-6">
                  {HOURS.map((hour) => {
                    const isSelected = selectedHour === hour;
                    return (
                      <TouchableOpacity
                        key={hour}
                        onPress={() => setSelectedHour(hour)}
                        style={[
                          {
                            width: '100%',
                            paddingVertical: 10,
                            borderRadius: 12,
                            alignItems: 'center',
                          },
                          isSelected && { backgroundColor: colors.accent },
                        ]}
                      >
                        <Text
                          style={{
                            color: isSelected ? '#FFFFFF' : colors.text,
                            fontWeight: isSelected ? 'bold' : 'normal',
                          }}
                          className="text-base"
                        >
                          {hour}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            </View>

            <View className="w-[1px] bg-gray-100 dark:bg-zinc-800 self-stretch my-2 mx-1" />

            <View className="flex-1 items-center">
              <Text style={{ color: colors.textMuted }} className="text-xs font-bold uppercase mb-2">
                Minute
              </Text>
              <ScrollView showsVerticalScrollIndicator={false} className="w-full">
                <View className="items-center px-2 pb-6">
                  {MINUTES.map((minute) => {
                    const isSelected = selectedMinute === minute;
                    return (
                      <TouchableOpacity
                        key={minute}
                        onPress={() => setSelectedMinute(minute)}
                        style={[
                          {
                            width: '100%',
                            paddingVertical: 10,
                            borderRadius: 12,
                            alignItems: 'center',
                          },
                          isSelected && { backgroundColor: colors.accent },
                        ]}
                      >
                        <Text
                          style={{
                            color: isSelected ? '#FFFFFF' : colors.text,
                            fontWeight: isSelected ? 'bold' : 'normal',
                          }}
                          className="text-base"
                        >
                          {minute}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          </View>

          <View className="flex-row justify-between items-center mt-4">
            <TouchableOpacity
              onPress={onClose}
              className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-zinc-800/80 w-[45%] items-center"
            >
              <Text style={{ color: colors.text }} className="text-sm font-semibold">
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleConfirm}
              style={{ backgroundColor: colors.accent }}
              className="px-4 py-2.5 rounded-xl w-[45%] items-center"
            >
              <Text className="text-sm font-bold text-white">
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
