import { api } from './api';
import type { ClubDto, VolunteerProfileResponse } from '@/types/api';

export interface CreateProfileRequest {
  role: string;
  kbvbId: string;
  clubId?: string;
  clubName?: string;
}

export const volunteerService = {
  createProfile: (dto: CreateProfileRequest) =>
    api.post<VolunteerProfileResponse>('/volunteers/profile', dto),

  getMyProfile: () =>
    api.get<VolunteerProfileResponse>('/volunteers/profile/me'),
};

export type { VolunteerProfileResponse };
