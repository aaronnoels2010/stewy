import { useState, useCallback } from 'react';
import { participationService } from '@/services/participation.service';

export type ParticipationStatusType = 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'INVITED' | 'CANCELLED' | 'WITHDRAWN' | null;

export function useGameParticipation() {
  const [loading, setLoading] = useState(false);
  const [participationStatus, setParticipationStatus] = useState<ParticipationStatusType>(null);

  const request = useCallback(async (volunteerId: string, gameId: string) => {
    setLoading(true);
    try {
      await participationService.request(volunteerId, gameId);
      setParticipationStatus('REQUESTED');
    } finally {
      setLoading(false);
    }
  }, []);

  const approve = useCallback(async (volunteerId: string, gameId: string) => {
    setLoading(true);
    try {
      await participationService.approve(volunteerId, gameId);
      setParticipationStatus('APPROVED');
    } finally {
      setLoading(false);
    }
  }, []);

  const reject = useCallback(async (volunteerId: string, gameId: string) => {
    setLoading(true);
    try {
      await participationService.reject(volunteerId, gameId);
      setParticipationStatus('REJECTED');
    } finally {
      setLoading(false);
    }
  }, []);

  return { request, approve, reject, participationStatus, loading };
}

