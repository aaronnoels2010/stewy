import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { usePreferences } from '@/contexts/preferences.context';

type Language = 'nl' | 'en';

const FLAGS: Record<Language, string> = {
  nl: '\u{1F1F3}\u{1F1F1}',
  en: '\u{1F1EC}\u{1F1E7}',
};

const LANGUAGES: Language[] = ['nl', 'en'];

export function LanguageSwitcher() {
  const { language, setLanguage } = usePreferences();

  return (
    <View className="flex flex-row items-center gap-1">
      {LANGUAGES.map((lang) => {
        const isActive = language === lang;
        return (
          <TouchableOpacity
            key={lang}
            onPress={() => setLanguage(lang)}
            className={`px-2 py-1 rounded-lg ${isActive ? 'bg-zinc-200 dark:bg-zinc-700 border-2 border-zinc-400 dark:border-zinc-500' : 'opacity-50'}`}
            accessibilityLabel={`Switch language to ${lang === 'nl' ? 'Nederlands' : 'English'}`}
          >
            <ThemedText className="text-lg">{FLAGS[lang]}</ThemedText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
