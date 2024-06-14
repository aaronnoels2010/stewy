<template>
  <div class="row" style="margin-left: 20px">
    <div class="col-auto">
      <q-btn @click="backToClubList">
        <template v-slot:default>
          <q-icon name="arrow_back"></q-icon>
        </template>
      </q-btn>
    </div>
    <div class="text-h6 text-bold">
      Club details
    </div>
  </div>
  <div class="row">
    <q-tabs
        style="width: 100%"
        v-model="tab"
        align="justify"
        narrow-indicator
        class="q-mb-lg"
    >
      <q-tab class="text-purple" name="volunteers" label="volunteers" />
      <q-tab class="text-orange" name="futureGames" label="Upcoming games" />
      <q-tab class="text-teal" name="pastGames" label="past games" />
      <q-tab class="text-teal" name="responsible" label="responsible" />
    </q-tabs>
  </div>
  <div class="row">
    <q-tab-panels
        style="width: 100%"
        v-model="tab"
        animated
        transition-prev="scale"
        transition-next="scale"
        class="text-black text-center"
    >
      <q-tab-panel name="volunteers">
        <div class="row text-bold text-h4" style="margin-left: 20px;margin-top: 20px">
          Volunteers
        </div>
        <div class="row">
          <div class="col">
            <q-table
                grid
                :rows="getSelectedClub.volunteerList"
            >
              <template v-slot:item="props">
                <VolunteerOverview
                    :volunteer="props.row"
                />
              </template>
              <template v-slot:no-data>
                <div class="col" style="padding-left: 0">
                  <q-card style="width: 100%;margin-top: 20px">
                    <q-card-section>
                      <div class="row justify-between text-bold">
                        <div class="col">
                          no responsible person has been assigned yet
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
              </template>
            </q-table>
          </div>
        </div>


      </q-tab-panel>
      <q-tab-panel name="futureGames">
        <div class="row text-bold text-h4" style="margin-top: 20px">
          Upcoming games
        </div>
        <div class="row">
          <div class="col">
            <q-table
                grid
                :rows="getSelectedClub.gameList"
            >
              <template v-slot:item="props">
                <GameOverview
                    :game="props.row"
                />
              </template>
              <template v-slot:no-data>
                <div class="col" style="padding-left: 0">
                  <q-card style="width: 100%;margin-top: 20px">
                    <q-card-section>
                      <div class="row justify-between text-bold">
                        <div class="col">
                          no games planned in the future
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
              </template>
            </q-table>
          </div>
        </div>
      </q-tab-panel>
      <q-tab-panel name="pastGames">
        <div class="row text-bold text-h4" style="margin-left: 20px;margin-top: 20px">
          Volunteers
        </div>
        <div class="row">
          <div class="col">
            <q-table
                grid
                :rows="getSelectedClub.volunteerList"
            >
              <template v-slot:item="props">
                <VolunteerOverview
                    :volunteer="props.row"
                />
              </template>
              <template v-slot:no-data>
                <div class="col" style="padding-left: 0">
                  <q-card style="width: 100%;margin-top: 20px">
                    <q-card-section>
                      <div class="row justify-between text-bold">
                        <div class="col">
                          no responsible person has been assigned yet
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
              </template>
            </q-table>
          </div>
        </div>

      </q-tab-panel>
      <q-tab-panel name="responsible">
        <div class="row text-bold text-h4" style="margin-left: 20px;margin-top: 20px;margin-bottom: 20px">
          Responsible
        </div>
        <div v-if="!!getSelectedClub.responsible" class="row" style="margin-left: 20px">
          <q-card style="width: 100%;margin-top: 20px">
            <div class="row" style="display: flex; justify-content: space-between">
              <div class="col-3">
                <q-card-section>
                  <div class="text-grey text-center">
                    Last name
                  </div>
                  <div class="text-bold text-center">
                    {{getSelectedClub.responsible.lastName}}
                  </div>
                </q-card-section>
              </div>
              <div class="col-3">
                <q-card-section>
                  <div class="text-grey text-center">
                    First name
                  </div>
                  <div class="text-bold text-center">
                    {{getSelectedClub.responsible.firstName}}

                  </div>
                </q-card-section>
              </div>
              <div class="col-3">
                <q-card-section>
                  <div class="text-grey text-center">
                    Role
                  </div>
                  <div class="text-bold text-center">
                    <q-badge color="green" :label="getSelectedClub.responsible.role"/>
                  </div>
                </q-card-section>
              </div>
              <div class="col-auto" >
                <q-card-section style="display: flex;justify-content: end">
                  <q-btn class="editButton"  @click="printHello" >
                    <q-icon name="edit" color="orange"></q-icon>
                  </q-btn>
                </q-card-section>
              </div>
            </div>
          </q-card>
        </div>
        <div v-else style="margin-left: 20px;margin-top: 10px">
          <div class="row">
            <div class="col-auto">
              <q-btn @click="assignResponsible" color="blue">
                <template v-slot:default>
                  <div class="row">
                    <div class="col-auto">
                      <q-icon name="add" size="26px"></q-icon>
                    </div>
                    <div class="col" style="font-size: 16px">
                      assign person
                    </div>
                  </div>
                </template>
              </q-btn>
            </div>
          </div>
          <div class="row">
            <q-card style="width: 100%;margin-top: 20px">
              <q-card-section>
                <div class="row justify-between text-bold">
                  <div class="col">
                    no responsible person has been assigned yet
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>
    <Dialog
      v-model:open="openAssingModal"
      component="AssignForm"
      />
  </div>




</template>
<script>
import {mapActions, mapState} from "pinia";

export default {
  data(){
    return {
      tab: 'volunteers',
      openAssingModal: false,
      responsible: {
        id: 1, game: 'Club Brugge - Anderlecht', date: "2024-04-01 20:30", participants: 45

      },
      volunteers:[
        {
          name: 'Amadeo Noels',
          status: 'Pending',
          responsible: 'ST',
        }
      ]
    }
  },
  methods: {
    ...mapActions(useClubStore,{fetchClubById:'fetchClubById'}),
    ...mapActions(useVolunteerStore,{fetchVolunteers:'fetchAllVolunteers'}),
    backToClubList(){
      this.$router.push('/clubs')
    },
    printHello(){
      console.log("print")
    },
    assignResponsible(){
      this.openAssingModal = true;
      this.fetchVolunteers()
    },
    goToVolunteerDetails(volunteerId){
      this.$router.push(`/volunteers/${volunteerId}`)
    }
  },

  async created() {
    const {slug} = this.$route.params
    await this.fetchClubById(slug)
  },
  computed:{
    ...mapState(useClubStore,['getSelectedClub']),
  }
}
</script>
<style scoped>
.q-btn:before{
  box-shadow: none;
}

.element:hover {
  background: rgba(0, 0, 0, 0.03);
}
</style>
