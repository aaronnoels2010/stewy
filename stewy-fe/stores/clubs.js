import {defineStore} from "pinia";

export const useClubStore = defineStore('clubs', {
    state: () => ({
        clubs: [],
        selectedClub: {
            volunteerList:[]
        }
    }),
    getters: {
        getClubsAsListOptions: (state) => {
            console.log(state.clubs)
            const res  = state.clubs.map(({clubName,id}) => {
                return {
                    label: clubName,
                    value: id
                }
            })

            return res
        },
        getClubs: (state) => state.clubs,
        getSelectedClub: (state) => {
            if (JSON.stringify(state.selectedClub) === '{}') return []
            const {volunteerList,club , ...rest} = state.selectedClub
            const list =volunteerList.map(({firstName,lastName,role,...rest}) => {
                return {
                    ...rest,
                    firstName:firstName,
                    lastName:lastName,
                    role:role
                }
            })
            return {
                ...rest,
                volunteerList:list
            }
        }
    },
    actions: {
        async fetchAllClubs() {
            const {items} = await $fetch('http://localhost:8080/clubs', {
                server: false,
                method: 'post',
                body:{}
            })

            this.clubs = items

            //this.clubs = clubs

        },
        async addClub(club){
            const {items} = await $fetch('http://localhost:8080/clubs/add', {
                server: false,
                method: 'post',
                body: JSON.stringify(club)
            })

            console.log(items)


            this.clubs = items
        },
        async fetchClubById(clubId){
            const {gameList,...rest} = await $fetch(`http://localhost:8080/clubs/${clubId}`, {
                server: false,
                method: 'get',
            })

            const updateGameList = gameList.map(({appointment,...rest}) => {
                return {
                    ...rest,
                    appointment: formatDateString(appointment)
                }
            })

            this.selectedClub = {
                ...rest,
                gameList: updateGameList
            }

        },
        async assignVolunteer(clubId,volunteerId){
            const baseQuery = 'http://localhost:8080/clubs/assignVolunteer';
            const query = baseQuery + `?clubId=${clubId}&volunteerId=${volunteerId}`
            this.selectedClub = await $fetch(query, {
                server: false,
                method: 'post',
                body: JSON.stringify(volunteerId)
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
