import { View, Text, TouchableOpacity } from 'react-native';

export interface RoleOption {
  value: string;
  label: string;
}

interface RolePickerProps {
  roles: RoleOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function RolePicker({ roles, value, onChange, error }: RolePickerProps) {
  return (
    <View className="gap-2">
      {roles.map((role) => {
        const isSelected = value === role.value;
        return (
          <TouchableOpacity
            key={role.value}
            onPress={() => onChange(role.value)}
            activeOpacity={0.75}
            className={`flex-row items-center gap-3 px-4 py-3 rounded-xl border ${
              isSelected
                ? 'bg-accent-500 border-accent-500'
                : 'bg-transparent border-zinc-300 dark:border-zinc-600'
            }`}
          >
            <View
              className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                isSelected
                  ? 'border-white'
                  : 'border-zinc-400 dark:border-zinc-500'
              }`}
            >
              {isSelected && <View className="w-2.5 h-2.5 rounded-full bg-white" />}
            </View>
            <Text
              className={`text-base font-semibold ${
                isSelected
                  ? 'text-white'
                  : 'text-zinc-800 dark:text-zinc-200'
              }`}
            >
              {role.label}
            </Text>
          </TouchableOpacity>
        );
      })}
      {error && (
        <Text className="text-red-500 text-sm">{error}</Text>
      )}
    </View>
  );
}
