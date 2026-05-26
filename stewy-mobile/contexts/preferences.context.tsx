import { useContext, createContext, useState, useEffect, useCallback, type PropsWithChildren } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';

type Language = 'nl' | 'en';
type Theme = 'auto' | 'light' | 'dark';

interface PreferencesContextValue {
  language: Language;
  theme: Theme;
  setLanguage: (lang: Language) => Promise<void>;
  setTheme: (theme: Theme) => Promise<void>;
}

const PreferencesContext = createContext<PreferencesContextValue>({
  language: 'nl',
  theme: 'auto',
  setLanguage: async () => {},
  setTheme: async () => {},
});

const LANGUAGE_KEY = 'app_language';
const THEME_KEY = 'app_theme';

export function usePreferences() {
  const value = useContext(PreferencesContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('usePreferences must be wrapped in a <PreferencesProvider />');
    }
  }
  return value;
}

export function PreferencesProvider({ children }: PropsWithChildren) {
  const [language, setLanguageState] = useState<Language>('nl');
  const [theme, setThemeState] = useState<Theme>('auto');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_KEY).then((stored) => {
      if (stored === 'nl' || stored === 'en') {
        setLanguageState(stored);
        i18n.changeLanguage(stored);
      }
    });
    AsyncStorage.getItem(THEME_KEY).then((stored) => {
      if (stored === 'auto' || stored === 'light' || stored === 'dark') {
        setThemeState(stored);
      }
    }).finally(() => setLoaded(true));
  }, []);

  const setLanguage = useCallback(async (lang: Language) => {
    setLanguageState(lang);
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);
    i18n.changeLanguage(lang);
  }, []);

  const setTheme = useCallback(async (t: Theme) => {
    setThemeState(t);
    await AsyncStorage.setItem(THEME_KEY, t);
  }, []);

  return (
    <PreferencesContext.Provider
      value={{ language, theme: loaded ? theme : 'auto', setLanguage, setTheme }}>
      {children}
    </PreferencesContext.Provider>
  );
}
