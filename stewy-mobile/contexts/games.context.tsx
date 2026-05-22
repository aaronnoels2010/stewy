import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { gameService } from '@/services/game.service';
import type { GameDto } from '@/types/api';

export type Game = {
  id: string;
  homeTeam: { clubName: string };
  awayTeam: { clubName: string };
  appointment: string;
  deadline: string;
  status: GameDto['status'];
  location: string;
  accessibility: string;
  participants: unknown[];
};

interface GameContextType {
  games: Game[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await gameService.getGames();
      const mappedGames: Game[] = response.items.map((dto: GameDto) => ({
        id: dto.id,
        homeTeam: { clubName: dto.homeTeam.clubName },
        awayTeam: { clubName: dto.awayTeam.clubName },
        appointment: dto.appointment,
        deadline: dto.deadline,
        status: dto.status,
        location: dto.location,
        accessibility: dto.accessibility,
        participants: dto.participants,
      }));
      setGames(mappedGames);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load games');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  return (
    <GameContext.Provider
      value={{
        games,
        isLoading,
        error,
        refresh: fetchGames,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGames() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGames must be used within a GameProvider');
  }
  return context;
}
