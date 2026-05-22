import { api } from './api';
import type { UserDto } from '@/types/api';

export const adminService = {
  getPendingUsers: () => api.get<UserDto[]>('/users/pending'),

  activateUser: (userId: string) =>
    api.post<UserDto>(`/users/${userId}/activate`, {}),

  approveProfile: (volunteerId: string) =>
    api.post<Record<string, unknown>>(`/volunteers/${volunteerId}/profile/approve`, {}),

  rejectProfile: (volunteerId: string, reason?: string) =>
    api.post<Record<string, unknown>>(`/volunteers/${volunteerId}/profile/reject`, { reason }),
};
