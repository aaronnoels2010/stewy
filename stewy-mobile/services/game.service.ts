import { api } from './api';
import type { GameDto } from '@/types/api';

export const gameService = {
  getGames: () => api.get<{ items: GameDto[]; total: number }>('/games'),

  getGameById: (id: string) => api.get<GameDto>(`/games/${id}`),

  // Issue #4: HoofdSteward game creation
  createGame: (dto: {
    homeTeam: string;
    awayTeam: string;
    appointment: string;
    deadline: string;
    location: string;
    accessibility: string;
  }) => api.post<GameDto>('/games/create', dto),

  getMyClubGames: () =>
    api.get<{ items: GameDto[]; total: number }>('/games/my-club-games'),
};
