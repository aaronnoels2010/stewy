import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CreateGameScreen from '@/app/(app)/create-game';
import { createGameSchema } from '@/lib/createGameSchema';

const mockCreateGame = jest.fn().mockResolvedValue({ id: 'game-new' });
const mockRouterBack = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (s: string) => s }),
}));

jest.mock('@/hooks/useDesignTokens', () => {
  const colors = {
    background: '#F2F5F7', surface: '#FFFFFF', surfaceAlt: '#E7EEFF',
    border: '#BECAB9', borderStrong: '#6F7A6C',
    text: '#111C2D', textMuted: '#3F4A3D', textSubtle: '#6F7A6C',
    textInverse: '#FFFFFF', textWhite: '#FFFFFF',
    tint: '#006B22', accent: '#006B22', accentDark: '#005318',
    accentLight: '#178632', accentBright: '#2D963F',
    accentFixed: '#91FA95', accentFixedDim: '#75DC7C',
    accentSubtle: '#E7F5E8', accentText: '#005318',
    tabIconDefault: '#6F7A6C', tabIconSelected: '#006B22',
    success: '#006B22', successSubtle: '#E7F5E8', successText: '#005318',
    warning: '#8A6D00', warningSubtle: '#FFF8E1', warningText: '#6B5200',
    danger: '#BA1A1A', dangerSubtle: '#FFDAD6', dangerText: '#93000A',
    info: '#175B8A', infoSubtle: '#E1F0FF', infoText: '#0D4368',
    icon: '#3F4A3D', surfaceHover: '#D8E3FB', accentDeep: '#003D12',
  };
  return {
    useDesignTokens: () => ({
      colors,
      classes: {
        text: 'text-[#111C2D]', textMuted: 'text-[#3F4A3D]',
        textSubtle: 'text-[#6F7A6C]', textInverse: 'text-[#FFFFFF]',
        textAccent: 'text-[#006B22]', background: 'bg-[#F2F5F7]',
        surface: 'bg-[#FFFFFF]', surfaceAlt: 'bg-[#E7EEFF]',
        border: 'border-[#BECAB9]',
      },
      isDark: false,
      scheme: 'light',
    }),
  };
});

jest.mock('@/contexts/auth.context', () => ({
  useSession: () => ({
    signIn: jest.fn(), signOut: jest.fn(),
    user: { id: 'u1', firstName: 'A', lastName: 'U', email: 'a@b.com', role: 'ADMIN', status: 'ACTIVE', phone: '', address: '' },
    token: 'tok', session: 'tok', isAdmin: true, isLoading: false, isAuthenticated: true,
  }),
}));

const mockClubs = [
  { id: 'home-1', clubName: 'Home Club' },
  { id: 'away-1', clubName: 'Away Team Alpha' },
  { id: 'away-2', clubName: 'Away Team Beta' },
];

jest.mock('@/services/club.service', () => ({
  clubService: { getClubs: jest.fn().mockResolvedValue({ items: mockClubs, total: 3 }) },
}));

jest.mock('@/services/volunteer.service', () => ({
  volunteerService: {
    getMyProfile: jest.fn().mockResolvedValue({
      id: 'p1', firstName: 'A', lastName: 'U', role: 'HOOFD_STEWARD',
      club: { id: 'home-1', clubName: 'Home Club' },
      kbvbId: 'KBVB001', profileStatus: 'APPROVED', clubStatus: 'APPROVED',
    }),
  },
}));

jest.mock('@/services/game.service', () => ({
  gameService: { createGame: (...args: unknown[]) => mockCreateGame(...args) },
}));

jest.mock('expo-router', () => ({
  router: { back: mockRouterBack, push: jest.fn() },
}));

jest.mock('@/components/ThemedView', () => {
  const R = require('react');
  const RN = require('react-native');
  return { ThemedView: (p: any) => R.createElement(RN.View, null, p.children) };
});

jest.mock('@/components/ThemedCard', () => {
  const R = require('react');
  const RN = require('react-native');
  return { ThemedCard: (p: any) => R.createElement(RN.View, null, p.children) };
});

jest.mock('@/components/ThemedText', () => {
  const R = require('react');
  const RN = require('react-native');
  return { ThemedText: (p: any) => R.createElement(RN.Text, null, p.children) };
});

jest.mock('@/components/ThemedButton', () => {
  const R = require('react');
  const RN = require('react-native');
  return {
    ThemedButton: ({ label, onPress, loading }: any) =>
      R.createElement(
        RN.TouchableOpacity,
        { onPress, disabled: loading, testID: `btn-${label}` },
        R.createElement(RN.Text, null, label),
      ),
  };
});

jest.mock('@/components/ThemedInput', () => {
  const R = require('react');
  const RN = require('react-native');
  return {
    ThemedInput: ({ label, error, value, onChangeText, placeholder, editable }: any) => {
      const children: any[] = [];
      if (label) {
        children.push(R.createElement(RN.Text, { key: 'lbl' }, label));
      }
      children.push(
        R.createElement(RN.TextInput, {
          key: 'input',
          value,
          onChangeText,
          placeholder,
          editable,
          testID: `input-${label || placeholder}`,
        }),
      );
      if (error) {
        children.push(
          R.createElement(RN.Text, { key: 'err', testID: `error-${label || placeholder}` }, error),
        );
      }
      return R.createElement(RN.View, { testID: `input-group-${label || placeholder}` }, ...children);
    },
  };
});

jest.mock('@/components/ThemedTopAppBar', () => {
  const R = require('react');
  const RN = require('react-native');
  return {
    ThemedTopAppBar: ({ title }: any) =>
      R.createElement(RN.View, { testID: 'top-app-bar' }, R.createElement(RN.Text, null, title)),
  };
});

jest.mock('@/components/ClubCombobox', () => {
  const R = require('react');
  const RN = require('react-native');
  return {
    ClubCombobox: ({ clubs, selectedClubId, onSelect, userHomeClubId }: any) => {
      const selected = clubs?.find((c: any) => c.id === selectedClubId);
      return R.createElement(
        RN.TouchableOpacity,
        {
          testID: 'club-combobox',
          onPress: () => {
            const away = clubs?.find((c: any) => c.id !== userHomeClubId);
            if (away) onSelect(away.id);
          },
        },
        R.createElement(RN.Text, null, selected ? selected.clubName : 'Select away team...'),
      );
    },
  };
});

jest.mock('@/components/ThemedDatePickerModal', () => {
  const R = require('react');
  const RN = require('react-native');
  return {
    ThemedDatePickerModal: ({ visible, onChange }: any) => {
      R.useEffect(() => {
        if (visible && onChange) {
          onChange(new Date(2026, 5, 15));
        }
      }, [visible]);
      return visible ? R.createElement(RN.View, { testID: 'date-picker' }) : null;
    },
  };
});

jest.mock('@/components/ThemedTimePickerModal', () => {
  const R = require('react');
  const RN = require('react-native');
  return {
    ThemedTimePickerModal: ({ visible, onChange }: any) => {
      R.useEffect(() => {
        if (visible && onChange) {
          onChange(new Date(2026, 5, 15, 14, 0));
        }
      }, [visible]);
      return visible ? R.createElement(RN.View, { testID: 'time-picker' }) : null;
    },
  };
});

jest.mock('@/components/ThemedTimePickerModal', () => {
  const R = require('react');
  const RN = require('react-native');
  return {
    ThemedTimePickerModal: ({ visible, onChange }: any) => {
      R.useEffect(() => {
        if (visible && onChange) {
          onChange(new Date(2026, 5, 15, 14, 0));
        }
      }, [visible]);
      return visible ? R.createElement(RN.View, { testID: 'time-picker' }) : null;
    },
  };
});

jest.mock('@/components/ui/IconSymbol', () => {
  const R = require('react');
  const RN = require('react-native');
  return {
    IconSymbol: ({ name }: any) =>
      R.createElement(RN.Text, { testID: `icon-${name}` }, name),
  };
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('CreateGameScreen', () => {
  it('loads clubs and profile on mount', async () => {
    render(<CreateGameScreen />);

    await waitFor(() => {
      const { clubService } = require('@/services/club.service');
      const { volunteerService } = require('@/services/volunteer.service');
      expect(clubService.getClubs).toHaveBeenCalled();
      expect(volunteerService.getMyProfile).toHaveBeenCalled();
    });
  });

  it('renders the top bar, title and home club after loading', async () => {
    const { findByText, getByText } = render(<CreateGameScreen />);

    expect(await findByText('Home Club')).toBeTruthy();
    expect(getByText('createGame.title')).toBeTruthy();
    expect(getByText('createGame.homeTeam')).toBeTruthy();
    expect(getByText('createGame.submit')).toBeTruthy();
  });

  it('shows validation errors when submitting empty form', async () => {
    const { findByText, getByTestId } = render(<CreateGameScreen />);

    expect(await findByText('Home Club')).toBeTruthy();

    fireEvent.press(getByTestId('btn-createGame.submit'));

    expect(await findByText('createGame.validation.awayTeamRequired')).toBeTruthy();
    expect(await findByText('createGame.validation.locationRequired')).toBeTruthy();
  });

  it('calls createGame API with correct data on valid submission', async () => {
    jest.spyOn(createGameSchema, 'safeParse').mockReturnValueOnce({
      success: true,
      data: { awayTeamId: '', appointment: new Date(), deadline: new Date(), location: 'Stadium Alpha', accessibility: '' },
    });

    const { findByText, getByTestId } = render(<CreateGameScreen />);

    expect(await findByText('Home Club')).toBeTruthy();

    fireEvent.press(getByTestId('pick-appointment'));
    fireEvent.press(getByTestId('pick-deadline'));
    fireEvent.changeText(getByTestId('input-createGame.location'), 'Stadium Alpha');

    fireEvent.press(getByTestId('btn-createGame.submit'));

    await waitFor(() => {
      expect(mockCreateGame).toHaveBeenCalledWith({
        homeTeam: '',
        awayTeam: '',
        appointment: expect.any(String),
        deadline: expect.any(String),
        location: 'Stadium Alpha',
        accessibility: '',
      });
    });
  });


});
