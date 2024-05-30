import {defineStore} from "pinia";

export const useTeamStore = defineStore('teams', {
    state: () => ({
        teams: [
            { "id": 1, "name": "RSC Anderlecht" },
            { "id": 2, "name": "Club Brugge" },
            { "id": 3, "name": "Standard Luik" },
            { "id": 4, "name": "KAA Gent" },
            { "id": 5, "name": "KRC Genk" },
            { "id": 6, "name": "Antwerp FC" },
            { "id": 7, "name": "Sporting Charleroi" },
            { "id": 8, "name": "KV Mechelen" },
            { "id": 9, "name": "Zulte Waregem" },
            { "id": 10, "name": "KV Oostende" }
        ]
    }),
    getters: {
        getTeams: (state) => state.teams.map(({name,id}) =>  {
            return {
                value: id,
                label: name
            }

        }),
    },
    actions: {
        addTeam(team) {
            this.teams.push(team)
        },
    },
});