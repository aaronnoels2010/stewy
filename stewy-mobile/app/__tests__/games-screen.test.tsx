import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import GamesScreen from '@/app/(app)/(tabs)/games';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (s: string) => s }),
}));

jest.mock('@/hooks/useDesignTokens', () => ({
  useDesignTokens: () => ({
    colors: {
      background: '#F2F5F7', accent: '#006B22', border: '#BECAB9', danger: '#BA1A1A',
    },
    isDark: false,
  }),
}));

jest.mock('@/contexts/games.context', () => ({
  useGames: () => ({
    games: [],
    isLoading: false,
    error: null,
  }),
}));

jest.mock('@/contexts/auth.context', () => {
  const mock = {
    profile: null,
    profileStatus: null,
    volunteerRole: null,
    isProfileApproved: false,
    isHoofdSteward: false,
  };
  return {
    useSession: () => mock,
    __setSession: (overrides: Record<string, unknown>) => {
      Object.assign(mock, overrides);
    },
  };
});

jest.mock('@/services/game.service', () => ({
  gameService: {
    getMyClubGames: jest.fn().mockResolvedValue({ items: [] }),
  },
}));

jest.mock('@/components/GameCard', () => {
  const R = require('react');
  const RN = require('react-native');
  return {
    GameCard: ({ game }: any) =>
      R.createElement(RN.View, { testID: `game-card-${game?.id}` }),
  };
});

jest.mock('@/components/ThemedText', () => {
  const R = require('react');
  const RN = require('react-native');
  return {
    ThemedText: (p: any) => R.createElement(RN.Text, null, p.children),
  };
});

jest.mock('@/components/ThemedView', () => {
  const R = require('react');
  const RN = require('react-native');
  return {
    ThemedView: (p: any) => R.createElement(RN.View, null, p.children),
  };
});

jest.mock('@/components/ThemedCard', () => {
  const R = require('react');
  const RN = require('react-native');
  return {
    ThemedCard: (p: any) => R.createElement(RN.View, null, p.children),
  };
});

jest.mock('@/components/ThemedButton', () => {
  const R = require('react');
  const RN = require('react-native');
  return {
    ThemedButton: ({ label, onPress }: any) =>
      R.createElement(
        RN.TouchableOpacity,
        { onPress, testID: `btn-${label}` },
        R.createElement(RN.Text, null, label),
      ),
  };
});

jest.mock('@/components/ThemedBadge', () => {
  const R = require('react');
  const RN = require('react-native');
  return {
    ThemedBadge: ({ label }: any) =>
      R.createElement(RN.Text, { testID: `badge-${label}` }, label),
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

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children, ...rest }: any) => {
    const R = require('react');
    const RN = require('react-native');
    return R.createElement(RN.View, rest, children);
  },
}));

jest.mock('expo-status-bar', () => ({
  StatusBar: () => null,
}));

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));

const { __setSession } = require('@/contexts/auth.context');
const { gameService } = require('@/services/game.service');

beforeEach(() => {
  jest.clearAllMocks();
  __setSession({
    profile: null,
    profileStatus: null,
    volunteerRole: null,
    isProfileApproved: false,
    isHoofdSteward: false,
  });
});

describe('GamesScreen', () => {
  it('renders title and upcoming section', async () => {
    const { getByText } = render(<GamesScreen />);

    await waitFor(() => {
      expect(getByText('Game Planner')).toBeTruthy();
      expect(getByText('Upcoming Games')).toBeTruthy();
    });
  });

  it('shows Create button and My Club Games when profile approved and HoofdSteward', async () => {
    __setSession({
      profile: { id: 'p1', role: 'HOOFD_STEWARD', profileStatus: 'APPROVED' },
      profileStatus: 'APPROVED',
      volunteerRole: 'HOOFD_STEWARD',
      isProfileApproved: true,
      isHoofdSteward: true,
    });

    const { getByText, queryByText } = render(<GamesScreen />);

    await waitFor(() => {
      expect(queryByText('Create')).toBeTruthy();
      expect(queryByText('My Club Games')).toBeTruthy();
    });
  });

  it('hides Create button and My Club Games when profile not approved', async () => {
    __setSession({
      profile: { id: 'p1', role: 'HOOFD_STEWARD', profileStatus: 'PENDING_APPROVAL' },
      profileStatus: 'PENDING_APPROVAL',
      volunteerRole: 'HOOFD_STEWARD',
      isProfileApproved: false,
      isHoofdSteward: true,
    });

    const { queryByText } = render(<GamesScreen />);

    await waitFor(() => {
      expect(queryByText('Create')).toBeNull();
      expect(queryByText('My Club Games')).toBeNull();
    });
  });

  it('hides Create button and My Club Games when not HoofdSteward even if approved', async () => {
    __setSession({
      profile: { id: 'p1', role: 'STEWARD', profileStatus: 'APPROVED' },
      profileStatus: 'APPROVED',
      volunteerRole: 'STEWARD',
      isProfileApproved: true,
      isHoofdSteward: false,
    });

    const { queryByText } = render(<GamesScreen />);

    await waitFor(() => {
      expect(queryByText('Create')).toBeNull();
      expect(queryByText('My Club Games')).toBeNull();
    });
  });

  it('fetches club games when profile approved and HoofdSteward', async () => {
    __setSession({
      profile: { id: 'p1', role: 'HOOFD_STEWARD', profileStatus: 'APPROVED' },
      profileStatus: 'APPROVED',
      volunteerRole: 'HOOFD_STEWARD',
      isProfileApproved: true,
      isHoofdSteward: true,
    });

    render(<GamesScreen />);

    await waitFor(() => {
      expect(gameService.getMyClubGames).toHaveBeenCalled();
    });
  });

  it('does not fetch club games when profile not approved', async () => {
    __setSession({
      profile: { id: 'p1', role: 'HOOFD_STEWARD', profileStatus: 'PENDING_APPROVAL' },
      profileStatus: 'PENDING_APPROVAL',
      volunteerRole: 'HOOFD_STEWARD',
      isProfileApproved: false,
      isHoofdSteward: true,
    });

    render(<GamesScreen />);

    await waitFor(() => {
      expect(gameService.getMyClubGames).not.toHaveBeenCalled();
    });
  });
});
