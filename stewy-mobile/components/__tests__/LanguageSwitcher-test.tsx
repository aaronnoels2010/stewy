import * as React from 'react';
import { act, create } from 'react-test-renderer';
import { LanguageSwitcher } from '../LanguageSwitcher';

jest.mock('@/contexts/preferences.context', () => ({
  usePreferences: () => ({
    language: 'nl',
    setLanguage: jest.fn(),
    theme: 'auto',
    setTheme: jest.fn(),
  }),
}));

function render(el: React.ReactElement) {
  let root: ReturnType<typeof create>;
  act(() => { root = create(el); });
  return root!;
}

describe('LanguageSwitcher', () => {
  it('renders correctly', () => {
    const tree = render(<LanguageSwitcher />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
