import React, { useState, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useDesignTokens } from '@/hooks/useDesignTokens';
import { ThemedText } from './ThemedText';
import { IconSymbol } from './ui/IconSymbol';
import type { ClubDto } from '@/types/api';

interface ClubComboboxProps {
  clubs: ClubDto[];
  selectedClubId: string;
  onSelect: (clubId: string) => void;
  userHomeClubId: string;
}

export function ClubCombobox({
  clubs,
  selectedClubId,
  onSelect,
  userHomeClubId,
}: ClubComboboxProps) {
  const { colors, isDark } = useDesignTokens();
  const [visible, setVisible] = useState(false);

  const filteredClubs = useMemo(() => {
    return clubs
      .filter((club) => club.id !== userHomeClubId)
      .sort((a, b) => a.clubName.localeCompare(b.clubName));
  }, [clubs, userHomeClubId]);

  const selectedClub = clubs.find((c) => c.id === selectedClubId);

  const modalBg = isDark ? colors.surface : '#FFFFFF';
  const overlayBg = 'rgba(0, 0, 0, 0.4)';

  return (
    <>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        className="flex-row items-center justify-between px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-600"
        style={{ backgroundColor: isDark ? colors.surface : '#F9FAFB' }}
      >
        <ThemedText className={selectedClub ? '' : 'opacity-50'}>
          {selectedClub ? selectedClub.clubName : 'Select away team...'}
        </ThemedText>
        <IconSymbol name="chevron.down" size={16} color={colors.textMuted} />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable
          className="flex-1 justify-center items-center p-6"
          style={{ backgroundColor: overlayBg }}
          onPress={() => setVisible(false)}
        >
          <Pressable
            className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl max-h-[80%]"
            style={{ backgroundColor: modalBg }}
            onPress={(e) => e.stopPropagation()}
          >
            <View className="flex-row justify-between items-center p-5 pb-3">
              <Text style={{ color: colors.text }} className="text-lg font-bold">
                Select Away Team
              </Text>
              <TouchableOpacity onPress={() => setVisible(false)} className="p-1">
                <IconSymbol name="xmark" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            {filteredClubs.length === 0 ? (
              <View className="p-8 items-center">
                <ThemedText className="opacity-50">No clubs available</ThemedText>
              </View>
            ) : (
              <FlatList
                data={filteredClubs}
                keyExtractor={(item) => item.id}
                className="px-3 pb-4"
                renderItem={({ item }) => {
                  const isSelected = item.id === selectedClubId;
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        onSelect(item.id);
                        setVisible(false);
                      }}
                      className="flex-row items-center px-3 py-3 rounded-xl mb-1"
                      style={{
                        backgroundColor: isSelected ? colors.accent + '20' : 'transparent',
                      }}
                    >
                      <ThemedText
                        className="flex-1"
                        style={{ fontWeight: isSelected ? 'bold' : 'normal' }}
                      >
                        {item.clubName}
                      </ThemedText>
                      {isSelected && (
                        <IconSymbol name="checkmark" size={18} color={colors.accent} />
                      )}
                    </TouchableOpacity>
                  );
                }}
              />
            )}

            <View className="p-4 pt-2 border-t border-zinc-200 dark:border-zinc-700">
              <TouchableOpacity
                onPress={() => setVisible(false)}
                className="items-center py-2"
              >
                <Text style={{ color: colors.textMuted }} className="font-semibold">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
