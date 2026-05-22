import { api } from './api';
import type { AuthResponse, LoginRequest } from '@/types/api';

export const authService = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password } as LoginRequest),

  register: (dto: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    address: string;
  }) => api.post<AuthResponse>('/auth/register', dto),

  getMe: () => api.get<import('@/types/api').UserDto>('/auth/me'),
};
