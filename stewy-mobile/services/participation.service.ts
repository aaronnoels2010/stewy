import { api } from './api';
import type { VolunteerGameEntry } from '@/types/api';

export const participationService = {
  request: (volunteerId: string, gameId: string) =>
    api.post<{ status: string }>(`/volunteers/${volunteerId}/games/${gameId}/request`, {}),

  approve: (volunteerId: string, gameId: string) =>
    api.post<{ status: string }>(`/volunteers/${volunteerId}/games/${gameId}/approve`, {}),

  reject: (volunteerId: string, gameId: string) =>
    api.post<{ status: string }>(`/volunteers/${volunteerId}/games/${gameId}/reject`, {}),

  // HoofdSteward approve/reject (Issue #5)
  approveByHoofdSteward: (gameId: string, volunteerId: string) =>
    api.post<{ status: string }>(`/games/${gameId}/requests/${volunteerId}/approve`, {}),

  rejectByHoofdSteward: (gameId: string, volunteerId: string) =>
    api.post<{ status: string }>(`/games/${gameId}/requests/${volunteerId}/reject`, {}),

  getPendingRequests: (gameId: string) =>
    api.get<VolunteerGameEntry[]>(`/games/${gameId}/requests/pending`),

  // Invite flow (Issue #6)
  inviteVolunteer: (gameId: string, volunteerId: string) =>
    api.post<{ status: string }>(`/games/${gameId}/invite/${volunteerId}`, {}),

  acceptInvitation: (gameId: string) =>
    api.post<{ status: string }>(`/volunteers/invites/${gameId}/accept`, {}),

  declineInvitation: (gameId: string) =>
    api.post<{ status: string }>(`/volunteers/invites/${gameId}/reject`, {}),

  getMyInvitations: () =>
    api.get<VolunteerGameEntry[]>('/volunteers/invitations'),

  // HoofdSteward aggregate endpoints
  getPendingRequestsForClub: () =>
    api.get<VolunteerGameEntry[]>('/hoofdsteward/games/pending-requests'),

  getPendingInvitationsForClub: () =>
    api.get<VolunteerGameEntry[]>('/hoofdsteward/games/pending-invitations'),

  // Cancel & Withdraw (Issue #7)
  cancelParticipation: (gameId: string, volunteerId: string) =>
    api.post<{ status: string }>(`/games/${gameId}/participants/${volunteerId}/cancel`, {}),

  withdrawParticipation: (gameId: string) =>
    api.post<{ status: string }>(`/volunteers/games/${gameId}/withdraw`, {}),
};
