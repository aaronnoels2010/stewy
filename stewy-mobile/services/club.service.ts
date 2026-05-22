import { api } from './api';
import type { ClubDto } from '@/types/api';

export const clubService = {
  getClubs: (onlyWithHoofdSteward?: boolean) =>
    api.post<{ items: ClubDto[]; total: number }>(
      `/clubs${onlyWithHoofdSteward ? '?onlyWithHoofdSteward=true' : ''}`,
      {
        pageNo: 0,
        pageSize: 100,
        direction: 'ASC',
        sortBy: 'clubName',
      },
    ),
};
