import {defineStore} from "pinia";

export const useVolunteerStore = defineStore('volunteers', {
    state: () => ({
        volunteers: [],
        volunteer: {},
        volunteerGameParticipations:[]
    }),
    getters: {
        getVolunteers: (state) => {
            return state.volunteers.map(({club,games,...rest}) => {
                return {
                    ...rest,
                    club: !!club ? club.clubName : null
                }
            })
        },
        getVolunteersAsListWithFullName: (state) => {
            return state.volunteers.map(({firstName,lastName,id}) => {
                return {
                    label: firstName + ' ' + lastName,
                    value: id
                }
            })
        },
        getVolunteer: (state) => {
            console.log(state.volunteer)
            return !!state.volunteer.games ? {
                ...state.volunteer,
                games: state.volunteer.games.map(({appointment, ...rest}) => {
                    return {
                        ...rest,
                        appointment: formatDateString(appointment)
                    }
                })
            } : state.volunteer;
        },
        getVolunteerGameParticipations:(state) => {
            return state.volunteerGameParticipations.map(({game,id,...rest}) => {
                return {
                    ...rest,
                    value: id,
                    label: game,
                }
            })
        }
    },
    actions: {
        async fetchAllVolunteers() {
            const {items} = await $fetch('http://localhost:8080/volunteers', {
                server: false,
                method: 'post',
                body:{}
            })

            this.volunteers = items
        },
        async addVolunteer(volunteer){
            try {
                const {items} = await $fetch('http://localhost:8080/volunteers/add', {
                    server: false,
                    method: 'post',
                    body: JSON.stringify(volunteer)
                })
            }catch (Exception){}

            this.volunteers = items
        },
        async subscribeVolunteerToGame(volunteerId,gameId) {
            const query = `/${volunteerId}/${gameId}`
            const url = 'http://localhost:8080/volunteers' + query
            console.log(volunteerId)
            console.log(gameId)
            console.log(url)
            await $fetch(url, {
                server: false,
                method: 'post',
                body: JSON.stringify({})
            })
        },
        async generateError(){
            const { data, error, pending, refresh }  = await $fetch( "http://localhost:8080/errors",{
                server: false,
                method: 'get'
            })
        },

        async fetchVolunteerById(volunteerId){
            const data = await $fetch(`http://localhost:8080/volunteers/${volunteerId}`, {
                server: false,
                method: 'get'
            })

            this.volunteer = {
                ...data,
                clubId: data.club.id
            }
        },
        async findGamesWithParticipationStatus(volunteerId){
            this.volunteerGameParticipations = await $fetch(`http://localhost:8080/volunteers/${volunteerId}/games/participation`, {
                server: false,
                method: 'get'
            })
        }

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
