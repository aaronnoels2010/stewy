import { DarkTheme as NavDarkTheme, DefaultTheme as NavDefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import 'react-native-reanimated';
import '../global.css';
import '../translation'

import { useColorScheme } from 'nativewind';
import { SessionProvider } from '@/contexts/auth.context';
import { PreferencesProvider, usePreferences } from '@/contexts/preferences.context';
import { Colors } from '@/constants/Colors';

import {
  ArchivoNarrow_700Bold,
  ArchivoNarrow_600SemiBold,
} from '@expo-google-fonts/archivo-narrow';
import {
  HankenGrotesk_400Regular,
  HankenGrotesk_600SemiBold,
} from '@expo-google-fonts/hanken-grotesk';
import {
  JetBrainsMono_500Medium,
} from '@expo-google-fonts/jetbrains-mono';

SplashScreen.preventAutoHideAsync();

function ThemeEffect() {
  const { theme } = usePreferences();
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    if (theme === 'auto') {
      setColorScheme('system');
    } else {
      setColorScheme(theme);
    }
  }, [theme, setColorScheme]);

  return null;
}

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ArchivoNarrow_700Bold,
    ArchivoNarrow_600SemiBold,
    HankenGrotesk_400Regular,
    HankenGrotesk_600SemiBold,
    JetBrainsMono_500Medium,
  });

  const theme = useMemo(() => {
    const isDark = colorScheme === 'dark';
    const baseTheme = isDark ? NavDarkTheme : NavDefaultTheme;
    const colors = isDark ? Colors.dark : Colors.light;

    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        primary: colors.accent,
        background: colors.background,
        card: colors.surface,
        text: colors.text,
        border: colors.border,
        notification: colors.danger,
      },
    };
  }, [colorScheme]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={theme}>
      <SessionProvider>
        <PreferencesProvider>
          <ThemeEffect />
          <Slot />
          <StatusBar style="auto" />
        </PreferencesProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
