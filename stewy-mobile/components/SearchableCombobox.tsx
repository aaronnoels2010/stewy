import { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';

interface ComboboxOption {
  id: string;
  clubName: string;
}

interface SearchableComboboxProps {
  options: ComboboxOption[];
  value: string;
  onSelect: (option: ComboboxOption | null, createNewName?: string) => void;
  placeholder?: string;
  loading?: boolean;
  emptyMessage?: string;
  error?: string;
  allowCreate?: boolean;
  createNewLabel?: string;
}

export function SearchableCombobox({
  options,
  value,
  onSelect,
  placeholder = 'Search...',
  loading = false,
  emptyMessage,
  error,
  allowCreate = false,
  createNewLabel,
}: SearchableComboboxProps) {
  const [searchText, setSearchText] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = useMemo(() => {
    if (!searchText.trim()) return options;
    const query = searchText.toLowerCase();
    return options.filter((opt) =>
      opt.clubName.toLowerCase().includes(query)
    );
  }, [options, searchText]);

  const selectedOption = options.find((opt) => opt.id === value);

  const handleSelect = (option: ComboboxOption) => {
    onSelect(option);
    setSearchText('');
    setIsOpen(false);
  };

  const handleCreateNew = () => {
    onSelect(null, searchText);
    setSearchText('');
    setIsOpen(false);
  };

  const showCreateNew = allowCreate && searchText.trim().length > 0
    && !filteredOptions.some((opt) => opt.clubName.toLowerCase() === searchText.toLowerCase());

  return (
    <View className="relative">
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.75}
        className="flex-row items-center justify-between px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800"
      >
        <Text className={`text-base ${selectedOption ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400'}`}>
          {selectedOption ? selectedOption.clubName : placeholder}
        </Text>
        <Text className="text-zinc-400">{isOpen ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {error && (
        <Text className="text-red-500 text-sm mt-1">{error}</Text>
      )}

      {isOpen && (
        <View className="mt-1 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 max-h-48">
          <TextInput
            className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-700 text-base text-zinc-900 dark:text-zinc-100"
            placeholder="Type to filter..."
            placeholderTextColor="#9CA3AF"
            value={searchText}
            onChangeText={setSearchText}
          />

          {loading ? (
            <View className="py-4 items-center">
              <ActivityIndicator />
            </View>
          ) : filteredOptions.length === 0 && !showCreateNew ? (
            <View className="py-4 px-4">
              <Text className="text-zinc-400 text-sm">
                {emptyMessage || 'No results found'}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item)}
                  className={`px-4 py-3 ${value === item.id ? 'bg-accent-100 dark:bg-accent-900' : ''}`}
                >
                  <Text className={`text-base ${value === item.id ? 'text-accent-700 dark:text-accent-300 font-semibold' : 'text-zinc-800 dark:text-zinc-200'}`}>
                    {item.clubName}
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}

          {showCreateNew && (
            <TouchableOpacity
              onPress={handleCreateNew}
              className="px-4 py-3 border-t border-zinc-200 dark:border-zinc-700 bg-accent-50 dark:bg-accent-900/30"
            >
              <Text className="text-accent-600 dark:text-accent-400 text-base font-semibold">
                {createNewLabel || `Create new "${searchText}"`}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}
