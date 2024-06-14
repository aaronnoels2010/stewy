import {defineStore} from 'pinia'


export const useGameStore = defineStore('games', {
    state: () => ({
        games: [],
        selectedGame:{}
    }),
    getters: {
        getGames: (state) => state.games,
        getSelectedGame: (state) => state.selectedGame,
        getGamesAsOptionList: (state) => {
            return state.games.map(({id,game,...rest}) => {
                return {
                    label: game,
                    value: id
                }
            })
        },
        getOpenGames:(state) => {
            return state.games;
        },
        getGameAsForm:(state) => {
            console.log(!!state.selectedGame.homeTeam ? state.selectedGame.homeTeam.id : '')
            console.log("getGameAsForm")
            return {
                ...state.selectedGame,
                appointment: formatDateString(state.selectedGame.appointment),
                deadline: formatDateString(state.selectedGame.deadline),
                homeTeam: !!state.selectedGame.homeTeam ? state.selectedGame.homeTeam.id : '',
                awayTeam: !!state.selectedGame.awayTeam ? state.selectedGame.awayTeam.id : '',
            }

        }
    },
    actions: {
        async addGame(game) {
            const {items} = await $fetch('http://localhost:8080/games/add', {
                    server: false,
                    method: 'post',
                    body: JSON.stringify(game)
                })

            this.games = items.map(({appointment,...rest}) => {
                return {
                    ...rest,
                    appointment: formatDateString(appointment)
                }
            })
        },

        async fetchAllGames() {
            const {items} = await $fetch('http://localhost:8080/games', {
                server: false,
                method: 'post',
                body:{}
            })

            this.games = items.map(({appointment,...rest}) => {
                return {
                    ...rest,
                    appointment: formatDateString(appointment)
                }
            })
        },
        async fetchAllOpenGames() {
            const items = await $fetch('http://localhost:8080/games/open', {
                server: false,
                method: 'post',
                body:{}
            })

            console.log(items)

            this.games = items.map(({appointment,...rest}) => {
                return {
                    ...rest,
                    appointment: formatDateString(appointment)
                }
            })
        },
        async fetchGameById(gameId) {
            const response = await $fetch(`http://localhost:8080/games/${gameId}`, {
                server: false,
                method: 'get',
            })

            this.selectedGame = {
                ...response,
                appointment: formatDateString(response.appointment)
            }
        },
        async deadlineSubscriptionGamePast(gameId,place) {
            console.log('deadline subscription')
            console.log(place)
            await this.updateGame(gameId, "CLOSED")
        },
        async openSubscriptionsToGame(game) {
            game.status = 'OPEN'

            const data =  await $fetch(`http://localhost:8080/games/${game.id}`, {
                server: false,
                method: 'post',
                body: JSON.stringify('OPEN')
            })

            this.games = data
        },

        async updateGame(game) {
            const {participants,game:gameName,responsible, ...rest} =  game

            const data =  await $fetch(`http://localhost:8080/games/saveOrUpdate`, {
                server: false,
                method: 'post',
                body: JSON.stringify(rest)
            })
            console.log(data)

            this.selectedGame = {
                ...data,
                appointment: formatDateString(data.appointment)
            }

        },

        async updateGamesReturnOpenGames(gameId) {
            console.log('update game')
            this.games = await $fetch(`http://localhost:8080/games/open/${gameId}`, {
                server: false,
                method: 'post',
                body: JSON.stringify('CLOSED')
            })

        },

    },
});

export default function formatDateString(dateString) {
    // Parse the date string to a Date object
    let date = new Date(dateString);

    // Extract the date components
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    let day = String(date.getDate()).padStart(2, '0');
    let hours = String(date.getHours()).padStart(2, '0');
    let minutes = String(date.getMinutes()).padStart(2, '0');

    // Format the date and time in the desired format
    let formattedDateString = `${year}-${month}-${day} ${hours}:${minutes}`;

    return formattedDateString;
}
