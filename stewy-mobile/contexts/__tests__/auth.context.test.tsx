import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import { SessionProvider, useSession } from '../auth.context';

const mockSecureStoreGet = jest.fn();

jest.mock('expo-secure-store', () => ({
  getItemAsync: (...args: unknown[]) => mockSecureStoreGet(...args),
  setItemAsync: jest.fn(() => Promise.resolve()),
  deleteItemAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('@/services/auth.service', () => ({
  authService: {
    getMe: jest.fn(),
    login: jest.fn(),
  },
}));

jest.mock('@/services/volunteer.service', () => ({
  volunteerService: {
    getMyProfile: jest.fn(),
  },
}));

type SessionValues = {
  isProfileApproved: boolean;
  isHoofdSteward: boolean;
  profileStatus: string | null;
  volunteerRole: string | null;
  profile: Record<string, unknown> | null;
};

function renderWithContext() {
  let captured: SessionValues | null = null;

  function Consumer() {
    const ctx = useSession();
    captured = {
      isProfileApproved: ctx.isProfileApproved,
      isHoofdSteward: ctx.isHoofdSteward,
      profileStatus: ctx.profileStatus,
      volunteerRole: ctx.volunteerRole,
      profile: ctx.profile,
    };
    return null;
  }

  render(
    <SessionProvider>
      <Consumer />
    </SessionProvider>,
  );

  return { getValues: () => captured };
}

describe('SessionProvider profile derivation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const { authService } = require('@/services/auth.service');
    authService.getMe.mockResolvedValue({
      id: 'u1', role: 'VOLUNTEER', status: 'ACTIVE',
    });
    mockSecureStoreGet.mockResolvedValue('mock-token');
  });

  async function renderAndFlush() {
    const result = renderWithContext();
    await act(async () => {});
    return result;
  }

  it('defaults profile to null then loads from API', async () => {
    const { volunteerService } = require('@/services/volunteer.service');
    volunteerService.getMyProfile.mockResolvedValue({
      id: 'p1', role: 'STEWARD', profileStatus: 'APPROVED',
    });

    const { getValues } = renderWithContext();
    expect(getValues()!.profile).toBeNull();
    await act(async () => {});
    await waitFor(() => expect(getValues()!.profile).not.toBeNull());
  });

  it('sets isProfileApproved when profile is APPROVED', async () => {
    const { authService } = require('@/services/auth.service');
    const { volunteerService } = require('@/services/volunteer.service');

    volunteerService.getMyProfile.mockResolvedValue({
      id: 'p1', role: 'STEWARD', profileStatus: 'APPROVED',
    });

    const { getValues } = await renderAndFlush();

    await waitFor(() => {
      const vals = getValues();
      expect(vals!.profile).not.toBeNull();
      expect(vals!.profileStatus).toBe('APPROVED');
      expect(vals!.isProfileApproved).toBe(true);
    });
  });

  it('sets isProfileApproved false for PENDING_APPROVAL profile', async () => {
    const { authService } = require('@/services/auth.service');
    const { volunteerService } = require('@/services/volunteer.service');

    volunteerService.getMyProfile.mockResolvedValue({
      id: 'p1', role: 'STEWARD', profileStatus: 'PENDING_APPROVAL',
    });

    const { getValues } = await renderAndFlush();

    await waitFor(() => {
      const vals = getValues();
      expect(vals!.profileStatus).toBe('PENDING_APPROVAL');
      expect(vals!.isProfileApproved).toBe(false);
    });
  });

  it('sets isProfileApproved false for REJECTED profile', async () => {
    const { authService } = require('@/services/auth.service');
    const { volunteerService } = require('@/services/volunteer.service');

    volunteerService.getMyProfile.mockResolvedValue({
      id: 'p1', role: 'STEWARD', profileStatus: 'REJECTED',
    });

    const { getValues } = await renderAndFlush();

    await waitFor(() => {
      const vals = getValues();
      expect(vals!.profileStatus).toBe('REJECTED');
      expect(vals!.isProfileApproved).toBe(false);
    });
  });

  it('sets isHoofdSteward true for HOOFD_STEWARD role', async () => {
    const { authService } = require('@/services/auth.service');
    const { volunteerService } = require('@/services/volunteer.service');

    volunteerService.getMyProfile.mockResolvedValue({
      id: 'p1', role: 'HOOFD_STEWARD', profileStatus: 'APPROVED',
    });

    const { getValues } = await renderAndFlush();

    await waitFor(() => {
      const vals = getValues();
      expect(vals!.volunteerRole).toBe('HOOFD_STEWARD');
      expect(vals!.isHoofdSteward).toBe(true);
    });
  });

  it('sets isHoofdSteward false for STEWARD role', async () => {
    const { authService } = require('@/services/auth.service');
    const { volunteerService } = require('@/services/volunteer.service');

    volunteerService.getMyProfile.mockResolvedValue({
      id: 'p1', role: 'STEWARD', profileStatus: 'APPROVED',
    });

    const { getValues } = await renderAndFlush();

    await waitFor(() => {
      const vals = getValues();
      expect(vals!.volunteerRole).toBe('STEWARD');
      expect(vals!.isHoofdSteward).toBe(false);
    });
  });

  it('sets profile to null when getMyProfile fails', async () => {
    const { authService } = require('@/services/auth.service');
    const { volunteerService } = require('@/services/volunteer.service');

    volunteerService.getMyProfile.mockRejectedValue(new Error('No profile'));

    const { getValues } = await renderAndFlush();

    await waitFor(() => {
      const vals = getValues();
      expect(vals!.profile).toBeNull();
      expect(vals!.profileStatus).toBeNull();
      expect(vals!.isProfileApproved).toBe(false);
    });
  });
});
