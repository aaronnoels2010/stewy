import * as React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemeSwitcher } from '../ThemeSwitcher';

const mockSetTheme = jest.fn();

jest.mock('@expo/vector-icons/FontAwesome', () => {
  const R = require('react');
  const RN = require('react-native');
  return (p: any) => R.createElement(RN.Text, { testID: 'icon' }, p.name);
});

jest.mock('@/contexts/preferences.context', () => ({
  usePreferences: () => ({
    language: 'nl',
    setLanguage: jest.fn(),
    theme: 'light',
    setTheme: mockSetTheme,
  }),
}));

jest.mock('@/hooks/useDesignTokens', () => ({
  useDesignTokens: () => ({
    colors: { text: '#111C2D' },
    classes: {},
    isDark: false,
    scheme: 'light',
  }),
}));

describe('ThemeSwitcher', () => {
  beforeEach(() => {
    mockSetTheme.mockClear();
  });

  it('renders compact button with current theme', () => {
    const { getByLabelText } = render(<ThemeSwitcher />);
    expect(getByLabelText(/Theme: Light/)).toBeTruthy();
  });

  it('cycles to dark on press (light → dark)', () => {
    const { getByLabelText } = render(<ThemeSwitcher />);

    fireEvent.press(getByLabelText(/Theme:/));

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });
});
