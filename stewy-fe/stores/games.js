import { defineStore } from 'pinia'


export const useGameStore = defineStore('games', {
    state: () => ({
        games: [{id: 1, game: 'Club Brugge - Anderlecht', date: "2024-04-01 20:30", participants: 45},
            {id: 2, game: 'Genk - Standard Liège', date: "2024-04-02 18:00", participants: 56},
            {id: 3, game: 'Gent - Antwerp', date: "2024-04-03 20:45", participants: 32},
            {id: 4, game: 'Charleroi - Mechelen', date: "2024-04-04 19:00", participants: 64},
            {id: 5, game: 'Oostende - Beerschot', date: "2024-04-05 17:15", participants: 23},
            {id: 6, game: 'Cercle Brugge - Zulte Waregem', date: "2024-04-06 18:30", participants: 89},
            {id: 7, game: 'Kortrijk - Union SG', date: "2024-04-07 20:00", participants: 77},
            {id: 8, game: 'Eupen - Seraing', date: "2024-04-08 18:45", participants: 50},
            {id: 9, game: 'Sint-Truiden - Leuven', date: "2024-04-09 19:30", participants: 68},
            {id: 10, game: 'Westerlo - Mouscron', date: "2024-04-10 20:15", participants: 33},
            {id: 11, game: 'Antwerp - Club Brugge', date: "2024-04-11 18:00", participants: 91},
            {id: 12, game: 'Standard Liège - Gent', date: "2024-04-12 20:30", participants: 47},
            {id: 13, game: 'Anderlecht - Charleroi', date: "2024-04-13 18:45", participants: 29},
            {id: 14, game: 'Mechelen - Oostende', date: "2024-04-14 20:00", participants: 71},
            {id: 15, game: 'Beerschot - Cercle Brugge', date: "2024-04-15 19:15", participants: 54},
            {id: 16, game: 'Zulte Waregem - Kortrijk', date: "2024-04-16 20:45", participants: 48},
            {id: 17, game: 'Union SG - Eupen', date: "2024-04-17 18:30", participants: 85},
            {id: 18, game: 'Seraing - Sint-Truiden', date: "2024-04-18 20:00", participants: 65},
            {id: 19, game: 'Leuven - Westerlo', date: "2024-04-19 19:45", participants: 90},
            {id: 20, game: 'Mouscron - Genk', date: "2024-04-20 21:00", participants: 72},],
    }),
    getters: {
        getGames: (state) => state.games,
    },
    actions: {
        addGame(game) {
            this.games.push(game)
        },
    },
});