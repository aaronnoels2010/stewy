import React from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import { PreferencesProvider, usePreferences } from '../preferences.context';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

jest.mock('i18next', () => ({
  changeLanguage: jest.fn(),
}));

describe('PreferencesContext', () => {
  it('provides default values on first mount', async () => {
    let language: string | null = null;
    let theme: string | null = null;
    function Test() {
      const ctx = usePreferences();
      language = ctx.language;
      theme = ctx.theme;
      return null;
    }
    render(
      <PreferencesProvider>
        <Test />
      </PreferencesProvider>
    );
    await waitFor(() => {
      expect(language).toBe('nl');
      expect(theme).toBe('auto');
    });
  });

  it('changes language and persists', async () => {
    let consumer: { setLanguage: (l: string) => void; language: string } | null = null;
    function Test() {
      const ctx = usePreferences();
      consumer = ctx;
      return null;
    }
    render(
      <PreferencesProvider>
        <Test />
      </PreferencesProvider>
    );
    await act(async () => {
      await consumer!.setLanguage('en');
    });
    expect(consumer!.language).toBe('en');
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('app_language', 'en');
    const i18next = require('i18next');
    expect(i18next.changeLanguage).toHaveBeenCalledWith('en');
  });

  it('changes theme and persists', async () => {
    let consumer: { setTheme: (t: string) => void; theme: string } | null = null;
    function Test() {
      const ctx = usePreferences();
      consumer = ctx;
      return null;
    }
    render(
      <PreferencesProvider>
        <Test />
      </PreferencesProvider>
    );
    await act(async () => {
      await consumer!.setTheme('dark');
    });
    expect(consumer!.theme).toBe('dark');
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('app_theme', 'dark');
  });
});
