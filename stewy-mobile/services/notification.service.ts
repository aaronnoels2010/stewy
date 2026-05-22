import { api } from './api';

export const notificationService = {
  updatePushToken: (pushToken: string) =>
    api.post<void>('/users/push-token', { pushToken }),
};
