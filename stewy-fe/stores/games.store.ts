import { defineStore } from "pinia";
import gamesData from "../data/games.json";
import type { Game } from "~/types/game.type";

export const useGameStore = defineStore("games", () => {
  const games = ref(gamesData);

  const getGameById = (id: string): Game | undefined => {
    return games.value.find((game) => game.id === id);
  };

  return { games, getGameById };
});
